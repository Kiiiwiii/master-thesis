import React from "react";
import { SliderState, OptionState } from "../../components/visual-scenario-board/visual-scenario-board";
import Plot from '../Plotly';
import { shapeTypes, colorTypes } from "../ultis";
import { Popover, Icon } from "antd";
import styles from './scatter-chart.module.less';

interface Props {
  originalData: Data[];
  height: number;
  width: number;
  sliderStates: SliderState[];
  optionStates: OptionState[];

  selectedSamplesChange?: (selectedSamples: string[]) => void;
}

interface State {
  originalData: Data[];
  sliderStates: SliderState[];
  optionStates: OptionState[];
}

interface EncodedAttribute {
  xAttributeName: string;
  yAttributeName: string;
  colorAttributeName?: string;
  shapeAttributeName?: string;
}

// https://codepen.io/JungleDesigner/pen/ydBQNx
// N: Nominal data, Q: Quantitive
// 1N / 2Q / 1N + 1Q / 2N / 1N + 2Q / 2N + 1Q / 2N + 2Q
class ScatterChart extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if(nextProps.originalData !== prevState.originalData) {
      return {
        originalData: nextProps.originalData,
        sliderStates: nextProps.sliderStates,
        optionStates: nextProps.optionStates
      }
    }
    return null;
  }

  private baseLayout = {
    height: this.props.height,
    width: this.props.width,
    hovermode: 'closest',
    hoverlabel: {
      namelength: 30
    }
  }

  private baseTrace = {
    type: 'scatter',
    mode: 'markers',
  };
  private hint = `Use the box select or click/double-click the categories on the right side(if exists)`;
  private ref: React.RefObject<any>;
  private plotlyData: any[] = [];
  private plotlyLayout: any = {};
  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      originalData: [],
      optionStates: [],
      sliderStates: []
    }
  }

  componentDidMount() {
    this.setState({
      originalData: [...this.state.originalData],
    })
  }
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if(this.state !== nextState) {
      const {data, layout} = this.getPlotly(nextState.originalData, nextState.sliderStates, nextState.optionStates);
      this.plotlyData = data;
      this.plotlyLayout = layout;
      return true;
    }
    return false;
  }
  render() {
    return this.isDataValid() ? (
     <div className={styles['wrapper']}>
      <Popover content={this.hint} title="Hint">
        <div className={styles['wrapper__hint']}>
          <Icon type="question-circle" style={{marginRight: '5px'}}/>
          <span>Try to use some in-chart actions to interact!</span>
        </div>
      </Popover>
      <Plot
        ref={this.ref}
        data={this.plotlyData}
        layout={this.plotlyLayout}
        onSelected={this.handleBoxSelect}
        onDeselect={this.handleDeselect}
        onLegendClick={this.toggleCategory} />
     </div>
    ) : <div>No data or data is not valid</div>
  }

  // https://codepen.io/JungleDesigner/pen/ydBQNx
  // https://codepen.io/plotly/pen/dogexw
  // scatter chart, there are some test data
  // replace scatter chart with this component
  // reorder?
  // filtering?
  // highlight?

  private toggleCategory = (e: any) => {
    if (!e) {
      return;
    }
    setTimeout(() => {
      const selectedSamples = this.getFilteredSampleNames(this.ref.current.props.data)
      if(this.props.selectedSamplesChange) {
        this.props.selectedSamplesChange(selectedSamples);
      }
    }, 500);
  }
  private handleDeselect = (e: any) => {
    setTimeout(() => {
      const selectedSamples = this.getFilteredSampleNames(this.ref.current.props.data)
      if(this.props.selectedSamplesChange) {
        this.props.selectedSamplesChange(selectedSamples);
      }
    }, 500);
  }
  private handleBoxSelect = (e: any) => {
    if(!e) {
      return;
    }
    setTimeout(() => {
      const selectedSamples = this.getFilteredSampleNames(this.ref.current.props.data)
      if(this.props.selectedSamplesChange) {
        this.props.selectedSamplesChange(selectedSamples);
      }
    }, 500);
  }

  private getFilteredSampleNames(data: Array<{text: string[], selectedpoints?: number[], visible: true | 'legendonly'}>): string[] {
    const result = [] as string[];
    data.forEach(item => {
      if(item.visible === true || !item.visible) {
        const selected = item.selectedpoints ? item.selectedpoints.map(pointIndex => item.text[pointIndex]) : item.text
        result.push(...selected);
      }
    });
    return result;
  }

  private getPlotly(originalData: Data[], sliderStates: SliderState[], optionStates: OptionState[]): {data: any, layout: any} {
    const nominalDataLength = optionStates.length;
    const quantitiveDataLength = sliderStates.length;
    if(!this.isDataValid()) {
      return {data: {}, layout: {}}
    }
    // 1Q / 2Q
    if (nominalDataLength === 0) {
      const trace = {
        x: originalData.map(d => quantitiveDataLength > 1 ? d[sliderStates[1].name] : d['sampleName']),
        y: originalData.map(d => d[sliderStates[0].name]),
        text: this.props.originalData.map(d => d['sampleName']),
        ...this.baseTrace
      }
      const _layout = {
        yaxis: {
          title: sliderStates[0].name
        },
        xaxis: {
          title: quantitiveDataLength > 1 ? sliderStates[1].name : 'Sample Name'
        },
        ...this.baseLayout
      }
      return {
        data: [trace],
        layout: _layout
      }
    }

    // other situations
    const {xAttributeName, yAttributeName, colorAttributeName, shapeAttributeName} = this.mapData2EncodedInformation(nominalDataLength, quantitiveDataLength, sliderStates, optionStates);
    const traces = [] as any;
    // 1N
    if(!colorAttributeName && !shapeAttributeName) {
      traces.push({
        x: this.props.originalData.map(d => d[xAttributeName]),
        y: this.props.originalData.map(d => d[yAttributeName]),
        text: this.props.originalData.map(d => d['sampleName']),
        ...this.baseTrace
      })
    } else if (colorAttributeName && !shapeAttributeName) {
      const firstNominalDataNames = (optionStates.find(state => state.name === colorAttributeName) as OptionState).allOptions;
      firstNominalDataNames.forEach(name => {
        const filteredSamples = this.props.originalData.filter(d => d[colorAttributeName] === name);
        traces.push({
          x: filteredSamples.map(d => d[xAttributeName]),
          y: filteredSamples.map(d => d[yAttributeName]),
          text: filteredSamples.map(d => d.sampleName),
          name,
          ...this.baseTrace
        })
      })
    } else if (colorAttributeName && shapeAttributeName) {
      const firstNominalDataNames = (optionStates.find(state => state.name === colorAttributeName) as OptionState).allOptions;
      const secondNominalDataNames = (optionStates.find(state => state.name === shapeAttributeName) as OptionState).allOptions;
      firstNominalDataNames.forEach((firstName, index1) => {
        secondNominalDataNames.forEach((secondName, index2) => {
          const filteredSamples = this.props.originalData.filter(d => d[colorAttributeName] === firstName).filter(d => d[shapeAttributeName] === secondName)
          this.props.originalData.filter(d => d[colorAttributeName] === firstName).filter(d => d[shapeAttributeName] === secondName)
          traces.push({
            x: filteredSamples.map(d => d[xAttributeName]),
            y: filteredSamples.map(d => d[yAttributeName]),
            text: filteredSamples.map(d => d.sampleName),
            marker: {
              color: colorTypes[index1 % colorTypes.length],
              symbol: +shapeTypes[index2*4 % shapeTypes.length]
            },
            name: `${firstName} - ${secondName}`,
            ...this.baseTrace
          })
        });
      })
    }
    const layout = {
      yaxis: {
        title: yAttributeName
      },
      xaxis: {
        title: xAttributeName
      },
      ...this.baseLayout
    }
    return {data: traces, layout};
  }

  private mapData2EncodedInformation(
    nominalDataLength: number,
    quantitiveDataLength: number,
    sliderStates: SliderState[],
    optionStates: OptionState[])
    : EncodedAttribute{
    const getNameSafely = (obj: any) => {
      return obj ? obj.name : '';
    }
    const mapping: {
      [nominalKey in number]: {
        [quantitiveKey in number]: EncodedAttribute
      }
    } = {
      1: {
        0: {
          xAttributeName: 'sampleName',
          yAttributeName: getNameSafely(optionStates[0])
        },
        1: {
          xAttributeName: 'sampleName',
          yAttributeName: getNameSafely(sliderStates[0]),
          colorAttributeName: getNameSafely(optionStates[0])
        },
        2: {
          xAttributeName: getNameSafely(sliderStates[0]),
          yAttributeName: getNameSafely(sliderStates[1]),
          colorAttributeName: getNameSafely(optionStates[0])
        }
      },
      2: {
        0: {
          xAttributeName: getNameSafely(optionStates[0]),
          yAttributeName: 'sampleName',
          colorAttributeName: getNameSafely(optionStates[1]),
        },
        1: {
          xAttributeName: getNameSafely(sliderStates[0]),
          yAttributeName: 'sampleName',
          colorAttributeName: getNameSafely(optionStates[0]),
          shapeAttributeName: getNameSafely(optionStates[1])
        },
        2: {
          xAttributeName: getNameSafely(sliderStates[0]),
          yAttributeName: getNameSafely(sliderStates[1]),
          colorAttributeName: getNameSafely(optionStates[0]),
          shapeAttributeName: getNameSafely(optionStates[1])
        }
      }
    }

    return mapping[nominalDataLength][quantitiveDataLength];
  }

  private isDataValid(): boolean {
    const nominalAttributeLen = this.state.optionStates.length;
    const quantitiveAttributeLen = this.state.sliderStates.length;
    let mappingResult;
    try{
      mappingResult = this.mapData2EncodedInformation(nominalAttributeLen, quantitiveAttributeLen, this.state.sliderStates, this.state.optionStates);
    }catch(e){}
    return !!mappingResult || (nominalAttributeLen === 0 && quantitiveAttributeLen === 2);
  }
}

export default ScatterChart;