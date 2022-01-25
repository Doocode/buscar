import App from './App.svelte';

import "carbon-components-svelte/css/all.css";
import './Fonts/Quartz/style.css';

const app = new App({
	target: document.body,
	props: {
		appname: 'Buscar',
		appversion: '0.1.0 Dev',
		license: 'LGPL v.3',
	}
});

export default app;