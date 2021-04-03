import * as React from 'react';
import Plot from 'react-plotly.js';

class Chart extends React.Component {
  public render() {
    const trace = {
      type: 'parcoords',
      // tslint:disable-next-line:object-literal-sort-keys
      line: {
        color: 'blue'
      },

      dimensions: [{
        range: [1, 5],
        // tslint:disable-next-line:object-literal-sort-keys
        constraintrange: [1, 2],
        label: 'A',
        values: [1, 4]
      }, {
        range: [1, 5],
        // tslint:disable-next-line:object-literal-sort-keys
        label: 'B',
        values: [3, 1.5],
        tickvals: [1.5, 3, 4.5]
      }, {
        range: [1, 5],
        // tslint:disable-next-line:object-literal-sort-keys
        label: 'C',
        values: [2, 4],
        tickvals: [1, 2, 4, 5],
        ticktext: ['text 1', 'text 2', 'text 4', 'text 5']
      }, {
        range: [1, 5],
        // tslint:disable-next-line:object-literal-sort-keys
        label: 'D',
        values: [4, 2]
      }]
    } as any;
    return (
      <Plot
        data={[trace]}
        layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
      />
    )
  }
}

export default Chart;