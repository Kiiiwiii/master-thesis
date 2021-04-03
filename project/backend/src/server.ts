import express from 'express';
import './config';
import apiRouter from './route-middleware/api';
import './database/database-entry';
// import apiRouter from './router-middleware/api';

const app = express();
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'dev';
const allowedOrigin = env === 'dev' ? 'http://localhost:3000' : 'https://master-thesis-veav.herokuapp.com';

// static file
app.use('/static', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PATCH, DELETE');
  next();
}, express.static(__dirname + '/../public'));

app.use('/files', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PATCH, DELETE');
  next();
}, express.static(__dirname + '/../files'));

// router middleware - api data
app.use('/api', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PATCH, DELETE');
  next();
}, apiRouter);

const result: string[] = [];
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    const p = `${layer.method.toUpperCase()} ${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`;
    if (!result.find(s => s === p)) {
      result.push(p);
    }
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app.get('*', (_req, res) => {
  res.sendFile('index.html', {
    root: __dirname + '/../public',
  });
});

app._router.stack.forEach(print.bind(null, []));
result.forEach(p => console.log(p));

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`listening on: http://zhan.com:${port}`));
