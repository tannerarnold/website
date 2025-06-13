import { mount } from 'svelte';
import App from './components/App.svelte';
import './styles.scss';

// Mount the app on to the DOM.
mount(App, { target: document.getElementById('app')! });
