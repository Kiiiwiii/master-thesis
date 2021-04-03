import React from "react";
import Plot from '../Plotly';
import { SliderState, SliderChange } from "../../components/visual-scenario-board/visual-scenario-board";
import { ColorType } from "../parallel-coordinates/parallel-coordinates";

interface Props {
  originalData: Data[];
  sliderStates: SliderState[];
  highlightedSamples: string[];

  dimensionSize?: number;
  sliderRangeChange?: (changes: SliderChange[]) => void
}
interface State {
  sliderStates: SliderState[];
}

// 3 ~ 6 attributes
class ScatterPlotMatrix extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.sliderStates !== prevState.sliderStates) {
      return { sliderStates: nextProps.sliderStates };
    }
    return null;
  }
  private get sliders() {
    return this.state.sliderStates.filter(s => s.checked);
  }
  private colorScales: Array<[number, string]> = [];
  private ref: React.RefObject<any>;
  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      sliderStates: []
    }
  }

  render() {
    const {originalData, highlightedSamples} = this.props;
    const colors = this.getColors(originalData, highlightedSamples);
    if (colors.every(c => c === 0)) {
      this.colorScales = [[0, '#00C6A0'], [1, '#00C6A0']]
    } else {
      this.colorScales = [[0, '#00C6A0'], [0.5, '#00C6A0'], [0.5, '#3C31B3'], [1, '#3C31B3']];
    }

    if (!this.isDataValid(this.sliders)) {
      return <div>No data or data is not valid</div>
    }
    const traces = [{
      type: 'splom',
      dimensions: this.getDimensions(originalData, this.sliders),
      marker: {
        color: colors,
        colorscale: this.colorScales,
        size: 5,
        line: {
          color: 'white',
          width: 0.5
        }
      },
      // https://plot.ly/javascript/splom/
      // Notes: https://plot.ly/javascript/reference/#splom-selectedpoints
      selectedpoints: this.getSelectedPoints(originalData, this.sliders),
      unselected: {
        marker: {
          opacity: 0.15
        }
      }
    }] as any;
    return (
      <Plot
        ref={this.ref}
        data={traces}
        layout={this.getLayout(this.sliders)}
        onSelected={this.handleSelect}/>
    );
  }

  private handleSelect = (e: any) => {
    // reset all
    if(!e) {
      this.resetRangeSelect();
      return;
    }

    const axes = Object.keys(e.range);
    const regex = /\d+/g;
    const xIndex = axes[0].match(regex) ? +(axes[0].match(regex) as any)[0] - 1 : 0;
    const yIndex = axes[1].match(regex) ? +(axes[1].match(regex) as any)[0] - 1 : 0;
    if(xIndex === yIndex) {
      if(e.points.length === 0) {
        this.resetRangeSelect();
        return;
      }
      const attributeName = this.sliders[yIndex].name;
      const values = e.points.map((p: any) => p.x);
      const from = Math.min(...values);
      const to = Math.max(...values);
      const c = this.sliders.map(state => {
        if(state.name === attributeName){
          return {
            name: attributeName,
            from,
            to
          }
        }
        return {
          from: state.min,
          to: state.max,
          name: state.name
        }
      })
      if(this.props.sliderRangeChange) {
        this.props.sliderRangeChange(c);
      }
      return;
    }

    const attribute1Name = this.sliders[xIndex].name;
    const range1 = e.range[axes[0]];
    const attribute2Name = this.sliders[yIndex].name;
    const range2 = e.range[axes[1]];
    const changes = this.sliders.map(state => {
      if(state.name === attribute1Name) {
        return {
          from: Math.max(state.min, range1[0]),
          to: Math.min(state.max, range1[1]),
          name: state.name
        }
      }
      if (state.name === attribute2Name) {
        return {
          from: Math.max(state.min, range2[0]),
          to: Math.min(state.max, range2[1]),
          name: state.name
        }
      }
      return {
        from: state.min,
        to: state.max,
        name: state.name
      }
    });
    if(this.props.sliderRangeChange) {
      this.props.sliderRangeChange(changes);
    }
  }

  private resetRangeSelect() {
    const changes = this.sliders.map(state => ({
      from: state.min,
      to: state.max,
      name: state.name
    }))
    if(this.props.sliderRangeChange) {
      this.props.sliderRangeChange(changes);
    }
  }

  private getSelectedPoints(originalData: Data[], sliderStates: SliderState[]) {
    const result = [] as number[];
    originalData.map((d, index) => {
      if (sliderStates.every(state => d[state.name] >= state.from && d[state.name] <= state.to)) {
        result.push(index);
      }
    });
    return result;
  }
  private getLayout(sliderStates: SliderState[]) {
    const attributes = sliderStates.map(s => s.name);
    const baseLayout = {
      width: this.props.dimensionSize || attributes.length * 150,
      height: this.props.dimensionSize || attributes.length * 150,
      autosize: false,
      hovermode: 'closest',
      dragmode: 'select',
      plot_bgcolor: 'rgba(240,240,240, 0.95)',
    } as any;
    const axis = {
      showline: false,
      zeroline: false,
      gridcolor: '#ffff',
      ticklen: 2,
      tickfont: { size: 10 },
      titlefont: { size: 12 }
    }
    attributes.forEach((_a, index) => {
      if (index === 0) {
        baseLayout.xaxis = axis;
        baseLayout.yaxis = axis;

      } else {
        baseLayout[`xaxis${index + 1}`] = axis;
        baseLayout[`yaxis${index + 1}`] = axis;
      }
    });
    return baseLayout;
  }
  private getDimensions(originalData: Data[], sliderStates: SliderState[]) {
    const attributes = sliderStates.map(s => s.name);
    return attributes.map(attribute => ({
      label: attribute,
      values: originalData.map(d => d[attribute])
    }))
  }
  private getColors(originalData: Data[], highlightedSamples: string[]): ColorType[] {
    return originalData.map(d => {
      if (highlightedSamples.find(name => name === d.sampleName)) {
        return 1;
      }
      return 0;
    });
  }
  private isDataValid(sliderStates: SliderState[]) {
    const attributesSize = sliderStates.length;
    return attributesSize >= 2 && attributesSize <= 6
  }
}

export default ScatterPlotMatrix;