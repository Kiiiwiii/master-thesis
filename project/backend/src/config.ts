const env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
  // tslint:disable-next-line:no-var-requires
  const config = require('../config.json');
  Object.keys((config as any)[env]).forEach(key => {
    process.env[key] = (config as any)[env][key];
  });
}
