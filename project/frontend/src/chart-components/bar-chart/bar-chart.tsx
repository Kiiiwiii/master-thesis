import React from 'react';
import Plot from '../Plotly';
import { StatefulData } from '../../components/visual-scenario-board/visual-scenario-board';
import { highlightColor, normalColor } from '../ultis';

interface Props {
  data: StatefulData[];
  height: number;
  width?: number;
  toggleGraphElementHighlight?: (params: Array<{ sampleName: string, isHighlight: boolean }>) => void;
}

// 1 attribute
class BarChart extends React.Component<Props> {
  private layout = {
    width: this.props.width || Math.min(Math.max(this.props.data.length * 50, 300), 1000),
    height: this.props.height,
    yaxis: this.getYaxis(this.props.data),
    hovermode: 'closest'
  } as any;
  render() {
    const {data} = this.props;
    if (!this.isDataValid(data)) {
      return <div>No data or data is not valid</div>;
    }
    const d = [
      {
        x: this.getX(data),
        y: this.getY(data),
        marker: {
          color: this.getColor(data)
        },
        type: 'bar' as any
      }
    ];
    return <Plot
      data={d}
      layout={this.layout}
      onClick={this.handleBarchartClick}
    />
  }
  private handleBarchartClick = (e: any) => {
    const sampleName = e.points[0].x;
    const isHighlight = !(this.props.data.find(d => d.data['sampleName'] === sampleName) as StatefulData).isHighlighted;
    if(this.props.toggleGraphElementHighlight) {
      this.props.toggleGraphElementHighlight([{ sampleName, isHighlight }]);
    }
  }
  private getX(data: StatefulData[]) {
    return data.map(d => d.data.sampleName)
  }
  private getY(data: StatefulData[]) {
    return data.map(d => {
      const key = Object.keys(d.data).filter(k => k !== 'sampleName')[0];
      return d.data[key];
    })
  }
  private getColor(data: StatefulData[]) {
    return data.map(d => {
      if(d.isHighlighted) {
        return highlightColor;
      }
      return normalColor;
    })
  }

  private getYaxis(data: StatefulData[]) {
    const key = data.length > 0 ? Object.keys(data[0].data).filter(k => k !== 'sampleName')[0] : '';
    return {
      title: key,
      titlefont: {
        size: 16,
        color: 'rgb(107, 107, 107)'
      },
      tickfont: {
        size: 14,
        color: 'rgb(107, 107, 107)'
      }
    }
  }

  private isDataValid(data: StatefulData[]) {
    return data.length > 0 && data.length < 20 && Object.keys(data[0].data).filter(key => key !== 'sampleName').length === 1;
  }
}

export default BarChart;