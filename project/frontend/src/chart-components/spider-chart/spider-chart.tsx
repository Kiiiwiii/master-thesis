import React from "react";
import Plot from '../Plotly';
import { StatefulData } from "../../components/visual-scenario-board/visual-scenario-board";
import { normalizeDataBetweenMinandMax } from "../ultis";

interface Props {
  data: StatefulData[];
  height?: number;
  width?: number;
}
// 3 ~ 6 attributes and maximal 5 samples
class SpiderChart extends React.Component<Props> {

  private layout = {
    polar: {
      radialaxis: {
        visible: true,
      }
    },
    width: this.props.width || 600, height: this.props.height || 400
  }
  render() {
    const {data} = this.props;

    if(!this.isDataValid(data)) {
      return <div>No data or data is not valid</div>
    }

    return <Plot data={this.getTraces(data)} layout={this.layout} />;
  }

  private getTraces(data: StatefulData[]) {
    return data.map(d => {
      return {
        type: 'scatterpolar',
        fill: 'toself',
        name: d.data.sampleName,
        hoverinfo: 'text+name',
        r: this.getR(data, d.data.sampleName),
        theta: this.getTheta(data),
        text: this.getText(data, d.data.sampleName)
      }
    });
  }
  private getText(data: StatefulData[], sampleName: string) {
    const findedData = data.find(d => d.data.sampleName === sampleName) as StatefulData;
    return Object.keys(findedData.data).filter(k => k !== 'sampleName').map(attributeName => {
      const {text} = normalizeDataBetweenMinandMax(findedData.data[attributeName] as number, 1, 10);
      return `${attributeName}: ${text}`;
    })
  }
  private getR(data: StatefulData[], sampleName: string) {
    const findedData = data.find(d => d.data.sampleName === sampleName) as StatefulData;
    return Object.keys(findedData.data).filter(k => k !== 'sampleName').map(attributeName => {
      const { result } = normalizeDataBetweenMinandMax(findedData.data[attributeName] as number, 1, 10);
      return result;
    })
  }
  private getTheta(data: StatefulData[]) {
    return Object.keys(data[0].data).filter(key => key !== 'sampleName');
  }
  private isDataValid(data: StatefulData[]) {
    if (data.length === 0) {
      return false;
    }
    const sampleSize = data.length;
    const attributesSize = Object.keys(data[0].data).filter(key => key !== 'sampleName').length;
    return sampleSize < 6 && attributesSize >= 3 && attributesSize <= 6;
  }
}

export default SpiderChart;