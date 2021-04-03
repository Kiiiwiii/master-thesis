import React from "react";
import styles from "./visual-scenario-board.module.less";
import SampleTag from "../sample-tag/sample-tag";
import VariableSlider from "../variable-slider/variable-slider";
import { Button, Checkbox, Tabs, Icon, Select } from "antd";
import ParCoords from "../../chart-components/parallel-coordinates/parallel-coordinates";
import BarChart from "../../chart-components/bar-chart/bar-chart";
import LineChart from "../../chart-components/line-chart/line-chart";
import StackedBarChart from "../../chart-components/stacked-bar-chart/stacked-bar-chart";
import SpiderChart from "../../chart-components/spider-chart/spider-chart";
import ScatterPlotMatrix from "../../chart-components/scatter-plot-matrix/scatter-plot-matrix";
import VariableSelect from "../variable-select/variable-select";
import ScatterChart from "../../chart-components/scatter-chart/scatter-chart";
import { allCharts } from "../../chart-components/ultis";
import ChartCard from "../chart-card/chart-card";
import ObjLoader from "../obj-loader/obj-loader";
import HeaderGroup from '../../components/header-group/header-group';
import { RouteComponentProps, withRouter } from "react-router";
import { getSelectOptions, getGraphesWithPurposesBasedOnVariableValues, getTemporaryChartDataBasedOnSelectedVariables } from "../../containers/visualisation-scenario-edit-page/visualisation-scenario-edit-page";
import enviroment from "../../environments/environment";

const { TabPane } = Tabs;
const Option = Select.Option;

export interface StatefulData {
  data: Data;
  isHighlighted: boolean;
}

interface Props extends RouteComponentProps {
  visualScenario: VisualisationScenario;
  project: Project;
  changeVisualScenario: (id: string, change: Partial<VisualisationScenario>) => Promise<VisualisationScenario>;
}

export interface SliderState {
  name: string;
  from: number;
  to: number;
  min: number;
  max: number;
  checked: boolean;
}

export interface OptionState {
  name: string;
  allOptions: string[];
  selected: string[];
  checked: boolean;
}

export interface SliderChange {
  from: number;
  to: number;
  name: string;
}

export interface SelectedOptionChange {
  selected: string[];
  name: string;
}

interface State {
  visualScenario: VisualisationScenario | undefined;
  highlightedSamples: string[];

  sliderStates: SliderState[];
  optionStates: OptionState[];

  graph: Graph | undefined;
  // 3D
  objSrc: string;
  mtlSrc: string;

  isDataReady: boolean;
  isChartDomReady: boolean;
  // scatter chart will filter/control data itself (no control panel anymore)
  chartSelfDataControl?: boolean;
  chartSelectedSamples?: string[];

  chartTabActiveKey: string;

  // chart change
  availableGraphes: Graph[];
  selectedGraph: Graph | undefined;
  selectedVariables: Attribute[];
  availableGraphesWithPurpose: Array<{ purpose: Purpose, graphes: Graph[] }>;
  chartData: Data[];
  temporaryChartData: Data[];
}

const convertData2keyValuesArr = (vsData: Data[]) => {
  const d = {} as { [key in string]: number[] | string[] };
  vsData.forEach(data => {
    Object.keys(data).filter(key => key !== 'sampleName').forEach((key) => {
      if (!d[key]) {
        d[key] = [];
      }
      d[key].push(data[key] as any);
    });
  });
  return d as { [key in string]: number[] | string[] };
}
export const getOriginalSelectedOptions = (vsData: Data[]) => {
  const d = convertData2keyValuesArr(vsData);
  return Object.keys(d).filter(key => typeof d[key][0] === 'string').map(key => ({
    name: key,
    allOptions: [...new Set<string>((d[key] as string[]))],
    selected: [...new Set<string>((d[key] as string[]))],
    checked: true
  })) as OptionState[];
}
export const getOriginalSliderStates = (vsData: Data[]) => {
  const d = convertData2keyValuesArr(vsData);
  // should contain at least one dataset
  return Object.keys(d).filter(key => typeof d[key][0] === 'number').map(key => ({
    name: key,
    from: Math.min(...(d[key] as number[])),
    to: Math.max(...(d[key] as number[])),
    max: Math.max(...(d[key] as number[])),
    min: Math.min(...(d[key] as number[])),
    checked: true
  })) as SliderState[];
}

export const getCurrentSampleList = (originalData: Data[], highlightedSamples: string[], sliderStates: SliderState[], optionsStates: OptionState[]): StatefulData[] => {
  const includedSliderStates = sliderStates.filter(s => s.checked);
  const includedOptionsStates = optionsStates.filter(s => s.checked);
  return originalData.map(s => {
    const filteredData = {} as any;
    // filter the attribute, unchecked attributes are not included
    Object.keys(s).forEach(key => {
      if (key === 'sampleName') {
        filteredData[key] = s[key];
      }
      if (includedSliderStates.find(state => state.name === key)) {
        filteredData[key] = s[key];
      }
      if (includedOptionsStates.find(state => state.name === key)) {
        filteredData[key] = s[key];
      }
    })
    let isHighlighted = false;
    if (highlightedSamples.find(name => name === s.sampleName)) {
      isHighlighted = true;
    }
    return {
      data: filteredData,
      isHighlighted,
    }
  }).filter(d => {
    let shouldInclude = true;
    // filter the samples by sliders
    for (const state of includedSliderStates) {
      const max = state.to;
      const min = state.from;
      const value = d.data[state.name];
      if (value > max || value < min) {
        shouldInclude = false;
      }
      if (!shouldInclude) {
        return;
      }
    }
    // filter the samples by select options
    for (const state of includedOptionsStates) {
      const value = d.data[state.name];
      if (!state.selected.find(s => s === value)) {
        shouldInclude = false;
      }
      if (!shouldInclude) {
        return;
      }
    }
    return shouldInclude;
  });
}

class VisualScenarioBoard extends React.Component<Props, State>{

  static getDerivedStateFromProps(nextProps: Props, preState: State): State | null {
    if (nextProps.visualScenario !== preState.visualScenario) {
      const vs = nextProps.visualScenario;
      const project = nextProps.project;
      const chartData = getTemporaryChartDataBasedOnSelectedVariables(vs.selectedVariables, project.data)
      const data = {
        visualScenario: vs,
        highlightedSamples: [],
        objSrc: project.files[0].objFileName,
        mtlSrc: project.files[0].mtlFileName,
        isDataReady: true,
        graph: undefined,
        isChartDomReady: false,
        chartSelfDataControl: vs.selectedGraph === 'ScatterChart',

        availableGraphes: vs.availableGraphes,
        selectedGraph: vs.selectedGraph,
        selectedVariables: vs.selectedVariables,
        chartData,
        temporaryChartData: chartData,
        availableGraphesWithPurpose: getGraphesWithPurposesBasedOnVariableValues(vs.selectedVariables.map(v => v.name), project).availableGraphesWithPurpose
      } as any;
      if(data.chartSelfDataControl) {
        data.chartSelectedSamples = data.chartData.map((d: Data) => d.sampleName)
      }
      data['sliderStates'] = getOriginalSliderStates(data.chartData as Data[]);
      data['optionStates'] = getOriginalSelectedOptions(data.chartData as Data[]);
      return data as State;
    }
    return null;
  }

  private chartRef: React.RefObject<any>;
  constructor(props: Props) {
    super(props);
    this.chartRef = React.createRef();
    this.state = {
      visualScenario: undefined,
      sliderStates: [],
      optionStates: [],
      highlightedSamples: [],
      graph: undefined,
      objSrc: '',
      mtlSrc: '',
      isDataReady: false,
      isChartDomReady: false,

      chartTabActiveKey: '0',

      availableGraphes: [],
      selectedGraph: undefined,
      selectedVariables: [],
      availableGraphesWithPurpose: [],
      chartData: [],
      temporaryChartData: []
    }
  }

  shouldComponentUpdate(_p: Props, nextState: State) {
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if(!this.state.isChartDomReady) {
      this.setState({ isChartDomReady: true, graph: this.props.visualScenario.selectedGraph })
    }
  }

  componentDidMount() {
    this.setState({isChartDomReady: true, graph: this.props.visualScenario.selectedGraph})
  }

  render() {
    const { sliderStates, optionStates, highlightedSamples, isChartDomReady, graph, chartSelfDataControl, chartSelectedSamples, chartData} = this.state;
    const sampleList = !chartSelfDataControl ? getCurrentSampleList(chartData, highlightedSamples, sliderStates, optionStates) : this.getFilteredSampleListFromChart(chartData, chartSelectedSamples as string[], highlightedSamples);
    const allChecked = sliderStates.every(s => s.checked) && optionStates.every(s => s.checked);
    const allUnchecked = sliderStates.every(s => !s.checked) && optionStates.every(s => !s.checked);

    const {availableGraphes, selectedGraph, selectedVariables, temporaryChartData, chartTabActiveKey} = this.state;

    const {project} = this.props;
    const vs = this.props.visualScenario;
    const projectPath = `/project/${project.name}/${project.id}`;
    const vsPath = `/project/${project.name}/${project.id}/${vs.name}/${vs.id}`;
    return (
      <div>
        <HeaderGroup header={[
          { name: project.name, path: projectPath},
          { name: vs.name, path: vsPath}
        ]} backPath={projectPath}/>
        <main className={styles['container']}>
          <div className={`${styles['left-panel']} ${chartSelfDataControl || chartTabActiveKey === '2' ? styles['left-panel--without-right-panel'] : ''}`}>
            <div className={styles['chart']} ref={this.chartRef}>
              <Button className={styles['chart__edit-btn']} onClick={this.navigateToEditPage}>Edit<Icon type="tool" /></Button>
              <Tabs tabBarStyle={{ height: 45, marginBottom: 5 }} activeKey={chartTabActiveKey} onChange={this.changeChartTabActiveKey}>
                <TabPane style={{overflowX: 'auto'}} tab={<span><Icon type="area-chart" />Chart</span>} key="0">
                  {isChartDomReady ?
                    this.getChart(graph as Graph, chartData, sampleList, sliderStates, optionStates, highlightedSamples, this.chartRef.current.clientHeight - 5 - 50, this.chartRef.current.clientWidth) : null}
                </TabPane>
                <TabPane tab={<span><Icon type="bank" />3D Model of project</span>} key="1">
                  <ObjLoader objSrc={`${enviroment.endPoint}/files/${project.files[0].objFileName}`} mtlSrc={`${enviroment.endPoint}/files/${project.files[0].mtlFileName}`} />
                </TabPane>
                <TabPane tab={<span><Icon type="ellipsis" />Available Charts</span>} key="2">
                  <div className={styles['chart__more-charts']}>
                    <Button onClick={this.handleVisualScenarioChangeConfirm} type="primary" disabled={!selectedGraph || selectedVariables.length === 0} className={styles['more-charts__confirm']}>Confirm changes</Button>

                    <div className={styles['more-charts__title']}>- Change selected variables</div>
                    <div className={styles['more-charts__variables']}>
                      <Select
                        key={1}
                        maxTagCount={3}
                        maxTagPlaceholder={(omittedValues: string[]) => {
                          return `...${omittedValues.length} variables more`;
                        }}
                        className={styles['more-charts__select']}
                        mode="multiple"
                        value={selectedVariables.map(s => s.name)}
                        placeholder="Please select variables"
                        onChange={this.changeSelectedVariables}>
                        <Option value="all"> - Select all </Option>
                        <Option value="none"> - Deselect all </Option>
                        {getSelectOptions(project.variables)}
                      </Select>
                    </div>

                    <div className={styles['more-charts__title']}>- Click the card to select a graph</div>

                    <div className={styles['more-charts__chart-cards']}>
                      {allCharts.map(chartName => {
                        return (
                          <ChartCard
                            style={{ marginBottom: 20 }}
                            graph={chartName}
                            key={chartName}
                            data={temporaryChartData}
                            chartClick={this.changeSelectedGraph}
                            isActive={chartName === selectedGraph}
                            isDisabled={!availableGraphes.find(name => name === chartName)} />
                        )
                      })}
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            <div className={styles['sample-list-header']}>Building Variants List:</div>
            <div className={styles['sample-list']}>
              {
                sampleList.map(s => <SampleTag key={s.data.sampleName} data={s.data}
                  image={this.getSampleFile(project, s.data.sampleName, 'image')}
                  obj={this.getSampleFile(project, s.data.sampleName, 'obj')}
                  mtl={this.getSampleFile(project, s.data.sampleName, 'mtl')}
                  isHighlighted={s.isHighlighted}
                  toggleHighlight={this.handleSampleHighlight} />)
              }
            </div>
          </div>
          {!chartSelfDataControl && chartTabActiveKey!== '2' ? (
            <div className={styles['right-panel']}>
              <div className={styles['right-panel__header-group']}>
                <div className={styles['panel__header']}>Operation panel</div>
                <Button onClick={this.resetAllStates} className={styles['panel__reset-btn']}>Reset all values</Button>
                <Checkbox
                  indeterminate={!allChecked && !allUnchecked}
                  checked={allChecked}
                  onChange={this.handleAllCheckUncheck}>Enable/Disable all</Checkbox>
              </div>
              <div className={styles['right-panel__slider-list']}>
                {sliderStates.map(s => <VariableSlider
                  key={s.name}
                  name={s.name}
                  min={s.min}
                  max={s.max}
                  from={s.from}
                  to={s.to}
                  checked={s.checked}
                  rangeChange={this.handleSliderChange}
                  checkStateChange={this.handleCheckStateChange('Slider')} />)}
                {optionStates.map(s => <VariableSelect
                  key={s.name}
                  name={s.name}
                  checked={s.checked}
                  allOptions={s.allOptions}
                  selected={s.selected}
                  checkStateChange={this.handleCheckStateChange('Select')}
                  selectedOptionsChange={this.handleSelectedOptionsChange} />)}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    );
  }

  private getChart = (
    graph: Graph,
    originalData: Data[],
    currentSampleData: StatefulData[],
    sliderStates: SliderState[],
    optionStates: OptionState[],
    highlightedSamples: string[],
    height: number,
    width: number) => {
    switch (graph) {
      case 'BarChart':
        return <BarChart data={currentSampleData} height={height} toggleGraphElementHighlight={this.handleGraphElementHighlightToggle}/>;
      case 'LineChart':
        return <LineChart data={currentSampleData} height={height} toggleGraphElementHighlight={this.handleGraphElementHighlightToggle}/>;
      case 'ScatterChart':
        return <ScatterChart
          originalData={originalData}
          height={height}
          width={width}
          sliderStates={sliderStates}
          optionStates={optionStates}
          selectedSamplesChange={this.handleChartSelectedSamplesChange} />;
      case 'StackedBarChart':
        return <StackedBarChart data={currentSampleData} height={height} toggleGraphElementHighlight={this.handleGraphElementHighlightToggle}/>;
      case 'SpiderChart':
        return <SpiderChart data={currentSampleData}/>;
      case 'ScatterPlotMatrix':
        return (<ScatterPlotMatrix
          originalData={originalData}
          sliderStates={sliderStates}
          highlightedSamples={highlightedSamples}
          sliderRangeChange={this.handleSliderChange}/>);
      case 'ParallelCoordinates':
        return (
          <ParCoords
            originalData={originalData}
            sliderStates={sliderStates}
            optionsStates={optionStates}
            highlightSamples={highlightedSamples}
            sliderRangeChange={this.handleSliderChange}
            selectedOptionsChange={this.handleSelectedOptionsChange}
            height={height} />
        )
      default:
        return null;
    }
  }

  private getFilteredSampleListFromChart(vsData: Data[], selectedSamples: string[], highlightSamples: string[]): StatefulData[] {
    return selectedSamples.map(sampleName => {
      return {
        data: vsData.find(data => data.sampleName === sampleName) as Data,
        isHighlighted: !!highlightSamples.find(name => name === sampleName)
      }
    })
  }

  // chart tabs
  private changeChartTabActiveKey = (key: string) => {
    this.setState({
      chartTabActiveKey: key
    })
  }

  private handleVisualScenarioChangeConfirm = () => {
    const {
      selectedVariables,
      availableGraphes,
      availableGraphesWithPurpose,
      selectedGraph
    } = this.state;
    const selectedPurpose = (availableGraphesWithPurpose.find(d => !!d.graphes.find(graph => graph === selectedGraph)) as any).purpose;
    const id = this.props.visualScenario.id;

    this.props.changeVisualScenario(id, {
      selectedVariables,
      selectedGraph,
      availableGraphes,
      selectedPurpose,
    }).then(vs => {
      this.setState({
        chartTabActiveKey: '0'
      })
    });
  }

  private changeSelectedGraph = (graph: Graph) => {
    this.setState({
      selectedGraph: graph
    })
  }

  private changeSelectedVariables = (values: string[]) => {
    const {
      selectedVariables,
      availableGraphes,
      availableGraphesWithPurpose
    } = getGraphesWithPurposesBasedOnVariableValues(values, this.props.project);
    this.setState({
      selectedVariables,
      availableGraphes,
      availableGraphesWithPurpose,
      temporaryChartData: getTemporaryChartDataBasedOnSelectedVariables(selectedVariables, this.props.project.data),
      selectedGraph: undefined
    });
  }

  // chart self filtering
  private handleChartSelectedSamplesChange = (selectedSamples: string[]) => {
    this.setState({
      chartSelectedSamples: selectedSamples
    })
  }
  // operation panel
  private resetAllStates = () => {
    const allSliderStates = getOriginalSliderStates(this.state.chartData);
    const newSliderStates = this.state.sliderStates.map(s => {
      const originalState = allSliderStates.find(state => state.name === s.name) as SliderState
      if (s.checked) {
        return {
          ...s,
          from: originalState.from,
          to: originalState.to
        }
      }
      return {
        ...s
      }
    });
    const allOptionsStates = this.state.optionStates.map(state => {
      if(state.checked) {
        return {
          ...state,
          selected: state.allOptions
        }
      }
      return state;
    })
    this.setState({
      sliderStates: newSliderStates,
      optionStates: allOptionsStates
    });
  }

  private handleAllCheckUncheck = () => {
    const { sliderStates, optionStates } = this.state;
    const isAllChecked = sliderStates.every(s => s.checked);
    if (isAllChecked) {
      this.setState({
        sliderStates: sliderStates.map(s => ({ ...s, checked: false })),
        optionStates: optionStates.map(s => ({ ...s, checked: false }))
      });
      return;
    }
    this.setState({
      sliderStates: sliderStates.map(s => ({ ...s, checked: true })),
      optionStates: optionStates.map(s => ({ ...s, checked: true }))
    });
  }

  private handleCheckStateChange = (type: 'Slider' | 'Select') => {
    return (checked: boolean, name: string) => {
      if (type === 'Slider') {
        const newStates = [...this.state.sliderStates];
        const index = newStates.findIndex(s => s.name === name);
        newStates[index].checked = checked;
        this.setState({
          sliderStates: newStates
        });
      } else if (type === 'Select') {
        const newStates = [...this.state.optionStates];
        const index = newStates.findIndex(s => s.name === name);
        newStates[index].checked = checked;
        this.setState({
          optionStates: newStates
        });
      }
    }
  }

  private handleSliderChange = (changes: SliderChange[]) => {
    const newSliderState = [...this.state.sliderStates];
    changes.forEach(change => {
      const sliderState = this.state.sliderStates.find(s => s.name === change.name) as SliderState;
      const index = this.state.sliderStates.findIndex(s => s.name === change.name);

      sliderState.from = change.from;
      sliderState.to = change.to;
      newSliderState.splice(index, 1, sliderState);
    })
    this.setState({
      sliderStates: newSliderState
    });
  }

  private handleSelectedOptionsChange = (changes: SelectedOptionChange[]) => {
    const newStates = [...this.state.optionStates];
    changes.forEach(change => {
      const optionState = this.state.optionStates.find(s => s.name === change.name) as OptionState;
      const index = this.state.optionStates.findIndex(s => s.name === change.name);
      optionState.selected = change.selected;
      newStates.splice(index, 1, optionState);
    })
    this.setState({
      optionStates: newStates
    })
  }

  // sample panel

  private handleGraphElementHighlightToggle = (els: Array<{ sampleName: string, isHighlight: boolean }>) => {
    let { highlightedSamples } = this.state;
    els.forEach(el => {
      if (highlightedSamples.find(s => s === el.sampleName) && !el.isHighlight) {
        const index = highlightedSamples.findIndex(s => s === el.sampleName);
        highlightedSamples.splice(index, 1);
      }
      if (!highlightedSamples.find(s => s === el.sampleName) && el.isHighlight) {
        highlightedSamples = [...highlightedSamples, el.sampleName];
      }
    });
    this.setState({ highlightedSamples, chartTabActiveKey: '0' });
  }
  private handleSampleHighlight = (name: string, isHighlighted: boolean) => {
    const newHighlightedSamples = [...this.state.highlightedSamples];
    if (isHighlighted) {
      const index = this.state.highlightedSamples.findIndex(s => s === name);
      newHighlightedSamples.splice(index, 1);
      this.setState({
        highlightedSamples: newHighlightedSamples
      });
    } else {
      this.setState({
        highlightedSamples: [...newHighlightedSamples, name],
        chartTabActiveKey: '0'
      })
    }
  }

  private getSampleFile = (project: Project, sampleName: string, fileName: 'image' | 'obj' | 'mtl') => {
    const findedSampleFile = project.sampleFiles.find(file => file.sampleName === sampleName);
    if(!findedSampleFile) {
      // @Mark, special rule here
      return 'undefined';
    }
    return findedSampleFile[fileName];
  }

  private navigateToEditPage = () => {
    const {visualScenario, project} = this.props;
    this.props.history.push(`/project/${project.name}/${project.id}/${visualScenario.name}/${visualScenario.id}/edit`);
  }
}

export default withRouter(VisualScenarioBoard);