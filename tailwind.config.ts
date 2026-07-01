import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto Condensed', ...defaultTheme.fontFamily.sans]
			}
		}
	},

	plugins: [flowbitePlugin]
} satisfies Config;
