module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    transformIgnorePatterns: [
        'node_modules/(?!react-markdown|vfile|unist-util-stringify-position|property-information|space-separated-tokens|comma-separated-tokens|zwitch|unist-util-visit|unist-util-is|hast-util-whitespace)',
    ],
};
