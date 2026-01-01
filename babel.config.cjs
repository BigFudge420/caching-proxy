module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
      modules: false  // Important for ES modules
    }],
    '@babel/preset-typescript',
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: 'commonjs'  // Use CommonJS for tests
        }],
        '@babel/preset-typescript',
      ]
    }
  }
};