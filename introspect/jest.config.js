module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
        babelConfig: 'babel.config.js',
    }
},
  testMatch: [
    '**/tests/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: { 
		"^.+\\.js$": "babel-jest",
		"^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "babel-jest",
    "^.+\\.svg$": "jest-svg-transformer",
		'@components/(.*)': '<rootDir>/src/components/$1',
		'@assets/(.*)': '<rootDir>/src/assets/$1',
		'@logic/(.*)': '<rootDir>/src/lib/logic/$1',
		'@utils/(.*)': '<rootDir>/src/lib/utils/$1',
		'@constants/(.*)': '<rootDir>/src/lib/constants/$1',
		'@lib/(.*)': '<rootDir>/src/lib/$1'
  },
  moduleDirectories: [
  'node_modules', 
  'src'
  ],
  moduleFileExtensions: [
		"js",
		"jsx",
		"json",
		"node",
		"ts"
	]
};
