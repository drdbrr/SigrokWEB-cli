module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        forceAllTransforms: true,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs', 
    '@babel/plugin-proposal-object-rest-spread',
    "babel-plugin-styled-components",
  ].filter(Boolean),
}  
