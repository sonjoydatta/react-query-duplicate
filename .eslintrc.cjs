module.exports = {
	env: {
		browser: true,
		es2020: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react-refresh', '@tanstack/query'],
	rules: {
		'react-refresh/only-export-components': 'warn',
		'@tanstack/query/exhaustive-deps': 'error',
		'@tanstack/query/prefer-query-object-syntax': 'error',
		'react/react-in-jsx-scope': 0,
		'@typescript-eslint/explicit-function-return-type': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'react/prop-types': 0,
		'no-unused-vars': 'off',
		'react/display-name': 'off',
		'react-hooks/rules-of-hooks': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'no-restricted-imports': 'off',
		'@typescript-eslint/no-restricted-imports': [
			'warn',
			{
				name: 'react-redux',
				importNames: ['useSelector', 'useDispatch'],
				message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.',
			},
		],
	},
};
