module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts, tsx}',
        '**/*.d.ts'
    ],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    // preset: '@shelf/jest-mongodb',
    transform: {
        '.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
        '\\.scss$': 'identity-obj-proxy'
    }
}