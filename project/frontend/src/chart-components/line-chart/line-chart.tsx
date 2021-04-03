import React from "react";
import Plot from '../Plotly';
import { StatefulData } from "../../components/visual-scenario-board/visual-scenario-board";
import { normalColor2, normalColor, highlightColor } from "../ultis";

interface Props {
  data: StatefulData[];
  height: number;
  width?: number;
  toggleGraphElementHighlight?: (params: Array<{ sampleName: string, isHighlight: boolean }>) => void;
}

// 1 ~ 2 attributes, equal or more than 20 samples
class LineChart extends React.Component<Props> {
  private layout = {
    width: this.props.width || Math.min(Math.max(this.props.data.length * 40, 800), 1000),
    height: this.props.height,
    legend: {
      x: 1.05
    }
  }
  render() {
    const {data} = this.props;
    if (!this.isDataValid(data)) {
      return <div>No data or data is not valid</div>;
    }
    const result = this.getResult(data);

    return <Plot
      data={result.data}
      layout={result.layout}
      onClick={this.handleDotsClick} />
  }

  private handleDotsClick = (e: any) => {
    const sampleName = e.points[0].x;
    const isHighlight = !(this.props.data.find(d => d.data['sampleName'] === sampleName) as StatefulData).isHighlighted;
    if(this.props.toggleGraphElementHighlight) {
      this.props.toggleGraphElementHighlight([{ sampleName, isHighlight }]);
    }
  }
  // https://plot.ly/javascript/multiple-axes/#two-y-axes
  private getResult(data: StatefulData[]): {data: any, layout: any} {
    // prepare the first attribute
    const x = data.map(d => d.data['sampleName']);
    const colors1 = data.map(d => {
      if(d.isHighlighted) {return highlightColor};
      return normalColor;
    });
    const attributes = Object.keys(data[0].data).filter(key => key !== 'sampleName');
    const y1 = data.map(d => d.data[attributes[0]]);
    const trace1 = {
      x,
      y: y1,
      name: attributes[0],
      type: 'scatter',
      mode: 'lines+markers',
      marker: {
        color: colors1,
        size: 10
      },
      line: {
        color: normalColor,
        width: 1,
        shape: 'spline'
      }
    };
    const yaxis = {
      title: attributes[0]
    };
    // only one attribute
    if (attributes.length === 1) {
      return {
        data: [trace1],
        layout: {...this.layout, yaxis}
      }
    }
    // two attributes
    const y2 = data.map(d => d.data[attributes[1]]);
    const colors2 = data.map(d => {
      if (d.isHighlighted) { return highlightColor };
      return normalColor2;
    });
    const trace2 = {
      x,
      y: y2,
      name: attributes[1],
      type: 'scatter',
      mode: 'lines+markers',
      yaxis: 'y2',
      marker: {
        color: colors2,
        size: 10
      },
      line: {
        color: normalColor2,
        width: 1,
        shape: 'spline'
      }
    };
    const yaxis2 = {
      title: attributes[1],
      overlaying: 'y',
      side: 'right'
    }
    return {
      data: [trace1, trace2],
      layout: {...this.layout, yaxis, yaxis2}
    }
  }

  private isDataValid(data: StatefulData[]) {
    const attributesLenght = Object.keys(data[0].data).filter(key => key !== 'sampleName').length;
    return data.length > 0 && attributesLenght >= 1 && attributesLenght <= 2
  }
}

export default LineChart;