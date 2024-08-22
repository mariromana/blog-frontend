module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['/node_modules/(?!axios)'],
};
