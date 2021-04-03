// how to import part of the plotly
// https://github.com/plotly/plotly.js/issues/3604#issuecomment-469506830
// https://github.com/plotly/react-plotly.js#customizing-the-plotlyjs-bundle
// https://github.com/plotly/plotly.js#modules
// or
// use a sub part of plotly.js
// https://www.npmjs.com/package/plotly.js-gl2d-dist
import Plotly from 'plotly.js/lib/core';
import createPlotlyComponent from 'react-plotly.js/factory';

// npm install --save plotly.js-gl2d-dist
// import SubsetPlotly from 'plotly.js-gl2d-dist';
// createPlotlyComponent(SubsetPlotly)

// import the necessary trace type
(Plotly as any).register([
  // tslint:disable-next-line:no-var-requires
  require('plotly.js/lib/scatter'),
  // tslint:disable-next-line:no-var-requires
  require('plotly.js/lib/bar'),
  // tslint:disable-next-line:no-var-requires
  require('plotly.js/lib/parcoords'),
  // tslint:disable-next-line:no-var-requires
  require('plotly.js/lib/scatterpolar'),
  // tslint:disable-next-line:no-var-requires
  require('plotly.js/lib/splom')
]);

export default createPlotlyComponent(Plotly);