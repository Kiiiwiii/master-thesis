const { override, fixBabelImports, addLessLoader } = require('customize-cra');

const addWebpackRules = () => (config, _dev) => {
  const plotlyDependencyRule = {
    test: /\.js$/,
    loader: 'ify-loader'
  };
  const rules = [plotlyDependencyRule];
  config.module.rules.push(...rules);
  return config;
}

 module.exports = override(
   fixBabelImports('import', {
     libraryName: 'antd',
     libraryDirectory: 'es',
     style: true,
   }),
   addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { '@primary-color': '#1DA57A' },
  }),
  addWebpackRules()
 );