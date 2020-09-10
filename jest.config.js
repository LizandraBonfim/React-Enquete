module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts, tsx}',
        '!<rootDir>/src/main/**/*',
        '!<rootDir>/src/domain/**/index.ts',
        '!<rootDir>/src/presentation/components/router/**/*',
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