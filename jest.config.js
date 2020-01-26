const {pathsToModuleNameMapper} = require('ts-jest/utils')
const {compilerOptions} = require('./tsconfig.json')

module.exports = {
	'testEnvironment': 'node',
	'moduleDirectories': [
		'node_modules',
		'src'
	],
	'moduleFileExtensions': [
		'ts',
		'tsx',
		'js',
		'jsx'
	],
	'testRegex': '.spec.ts$',
	'transform': {
		'^.+\\.(t|j)s$': 'ts-jest'
	},
	'moduleNameMapper': pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'}  ),
	'collectCoverageFrom': [
		'src/**/*.{ts,js}',
		'!**/node_modules/**'
	],

	'coveragePathIgnorePatterns': [
		'test',
		'src/.*/entity',
		'src/index.ts'
	],
	'coverageDirectory': '<rootDir>/test/coverage/'
}
