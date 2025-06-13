import { mount } from 'svelte';
import App from './components/App.svelte';
import './styles.scss';

mount(App, { target: document.getElementById('app')! });
