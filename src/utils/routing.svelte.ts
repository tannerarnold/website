import type { Component } from 'svelte';
import type { Action } from 'svelte/action';

interface ModuleObject {
  [key: string]: unknown;
}

// Wrapper underneath the hood for routes to define what segments
// the route has, and if they are variable / dynamic or not
const routes: {
  path: string;
  component: () => Promise<ModuleObject>;
  segments: { name: string; variable: boolean }[];
}[] = routeSegments(generateRoutes());

// Current component that is being rendered
let component: Component | undefined = $state<Component | undefined>(undefined);

// Any props to provide to the component from the route
let componentProps: Record<string, string> | undefined = $state<
  Record<string, string> | undefined
>(undefined);

// Accept a routes object in - will define what route produces what component
function generateRoutes() {
  const routes = import.meta.glob<ModuleObject>('/src/routes/**/*.svelte');
  return Object.keys(routes)
    .map((route) => {
      const path = generatePathFromFileName(route);
      return {
        path,
        component: routes[route],
      };
    })
    .reduce((acc, val) => {
      acc[val.path] = val.component;
      return acc;
    }, {} as Record<string, () => Promise<ModuleObject>>);
}

function generatePathFromFileName(route: string): string {
  const prefix = 'src/routes';
  const suffix = 'Page.svelte';
  const path = route
    .replace(prefix, '')
    .replace(suffix, '')
    .replace(/^\/+|\/+$/g, '');
  return path;
}

// Generates the under the hood routes from the public route definition
// with the proper segment information
function routeSegments(routes: Record<string, () => Promise<ModuleObject>>) {
  return Object.entries(routes).map(([path, component]) => ({
    path,
    component,
    segments: path
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .map((segment) => ({
        name: segment.replace(':', ''),
        variable: segment.startsWith(':'),
      })),
  }));
}

// Based on a path, find the corresponding route definition
function findRoute(path: string) {
  const segments = path.replace(/^\/+|\/+$/g, '').split('/');

  return routes.find((route) => {
    if (route.segments.length !== segments.length) return false;
    return segments.every(
      (s, i) => route.segments[i].name === s || route.segments[i].variable
    );
  });
}

// Based on the path and the segment definitions for this route,
// extract the path parameter and generate props for the component
function generateProps(
  path: string,
  segments: { name: string; variable: boolean }[]
) {
  const componentProps: Record<string, string> = {};
  const pathSegments = path.replace(/^\/+|\/+$/g, '').split('/');
  pathSegments.map(
    (s, i) => segments[i].variable && (componentProps[segments[i].name] = s)
  );
  return componentProps;
}

// Load the component based on the route.
export async function loadRoute(path: string) {
  const route = findRoute(path);
  if (!route) {
    console.error(`No route found at ${path}!`);
    return;
  }
  component = (await route.component()).default as Component;
  componentProps = generateProps(path, route.segments);
}

const clickNavigationHandler = (event: MouseEvent, to: string) => {
  event.preventDefault();
  const url = new URL(document.location.href);
  url.hash = to;
  // Using the href, simulate a navigation to a new page
  window.history.pushState(null, '', url);
  loadRoute(url.hash.replace(/^#?\/?/, ''));
};

const enterNavigationHandler = (event: KeyboardEvent, to: string) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const url = new URL(document.location.href);
  url.hash = to;
  window.history.pushState(null, '', url);
  loadRoute(url.hash.replace(/^#?\/?/, ''));
};

export const getCurrentComponent = (): Component | undefined => component;
export const getCurrentComponentProps = ():
  | Record<string, string>
  | undefined => componentProps;

export const navigate: Action<HTMLElement, { to: string }> = (node, { to }) => {
  node.addEventListener('click', (e) => clickNavigationHandler(e, to));
  node.addEventListener('keydown', (e) => enterNavigationHandler(e, to));
};
