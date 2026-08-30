import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
	{
		ignores: [
			'.next/**',
			'out/**',
			'node_modules/**',
			'design/**',
			'next-env.d.ts',
		],
	},
	...nextCoreWebVitals,
];

export default config;
