import React from "react";
import Plot from '../Plotly';
import { StatefulData } from "../../components/visual-scenario-board/visual-scenario-board";
import { highlightColor, normalizeDataBetweenMinandMax } from "../ultis";

interface Props {
  data: StatefulData[];
  height: number;
  width?: number;
  toggleGraphElementHighlight?: (params: Array<{ sampleName: string, isHighlight: boolean }>) => void;
}

// https://mycolor.space/?hex=%233C31B3&sub=1
// const normalColors = ['#90B44B', '#60A956', '#249C64', '#008E70', '#007E79', '#006E7D'];

// 2 ~ 6 attributes and less than 20 samples
class StackedBarChart extends React.Component<Props> {
  private layout = {
    width: this.props.width || Math.min(Math.max(this.props.data.length * 40, 800), 1000),
    height: this.props.height,
    // hovermode: 'closest',
    barmode: 'stack'
  } as any;
  private ref = React.createRef();

  componentDidMount() {
    setTimeout(() => {
      if(this.isDataValid(this.props.data)) {
        this.updateTickColors(this.props.data);
      }
    }, 0);
  }

  componentDidUpdate() {
    setTimeout(() => {
      if (this.isDataValid(this.props.data)) {
        this.updateTickColors(this.props.data);
      }
    }, 0);
  }

  render() {
    const {data} = this.props;
    if (!this.isDataValid(data)) {
      return <div>No data or data is not valid</div>
    }
    const traces = Object.keys(data[0].data).filter(key => key !== 'sampleName')
      .map((attributeName, index) => this.getTrace(attributeName, index, data)) as any;
    return <Plot ref={this.ref} data={traces} layout={this.layout} onClick={this.handleBarchartClick}/>;
  }

  private handleBarchartClick = (e: any) => {
    const sampleName = e.points[0].x;
    const isHighlight = !(this.props.data.find(d => d.data['sampleName'] === sampleName) as StatefulData).isHighlighted;
    if (this.props.toggleGraphElementHighlight) {
      this.props.toggleGraphElementHighlight([{ sampleName, isHighlight }]);
    }
  }

  private updateTickColors = (data: StatefulData[]) => {
    const element = (this.ref.current as any).el as HTMLElement;
    const ticks = element.querySelectorAll('.xtick');
    ticks.forEach((tick, index) => {
      (tick.querySelector('text') as any).style.fill = data[index].isHighlighted ? highlightColor : '#444444';
      (tick.querySelector('text') as any).style.fontWeight = data[index].isHighlighted ? 'bold' : 'normal';
    });
  }

  private getText(statefulDataArr: StatefulData[], attributeName: string) {
    const data = statefulDataArr.map(d => d.data[attributeName]);
    return data.map(d => {
      const { text } = normalizeDataBetweenMinandMax(d as number);
      const combinedText = `${attributeName}: ${text}`;
      return combinedText;
    })

  }

  private getY(attributeName: string, data: StatefulData[]) {
    return data.map(d => {
      const {result} = normalizeDataBetweenMinandMax(d.data[attributeName] as number);
      return result;
    });
  }

  private getTrace(attributeName: string, _index: number, data: StatefulData[]) {
    return {
      x: data.map(d => d.data.sampleName),
      y: this.getY(attributeName, data),
      name: attributeName,
      type: 'bar',
      // marker: {
      //   color: normalColors[index]
      // },
      hoverinfo: 'text',
      text: this.getText(data, attributeName)
    }
  }

  private isDataValid(data: StatefulData[]) {
    if (data.length === 0) {
      return false;
    }
    const sampleSize = data.length;
    const attributesSize = Object.keys(data[0].data).filter(key => key !== 'sampleName').length;
    return sampleSize < 20 && attributesSize >= 2 && attributesSize <= 6;
  }
}
export default StackedBarChart;