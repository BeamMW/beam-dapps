module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
        babelConfig: 'babel.config.js',
    }
},
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: { 
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "babel-jest",
    "^.+\\.svg$": "jest-svg-transformer" 
  }
};
