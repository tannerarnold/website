import { mount } from 'svelte';
import App from './components/App.svelte';
import * as Sentry from '@sentry/svelte';
import './styles.scss';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

// Mount the app on to the DOM.
mount(App, { target: document.getElementById('app')! });
