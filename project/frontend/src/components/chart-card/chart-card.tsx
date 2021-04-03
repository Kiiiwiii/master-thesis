import React from "react";
import { Card, Modal, Icon } from "antd";
import './chart-card.less';
import styles from './chart-card.module.less';

import Meta from "antd/lib/card/Meta";
import barChartLogo from '../../assets/images/bar-chart-overview.svg';
import stackedBarChartLogo from '../../assets/images/stacked-bar-chart-overview.svg';
import lineChartLogo from '../../assets/images/line-chart-overview.svg';
import spiderChartLogo from '../../assets/images/spider-chart-overview.svg';
import scatterChartLogo from '../../assets/images/scatter-chart-overview.svg';
import scatterPlotMatrixLogo from '../../assets/images/scatter-plot-matrix-overview.svg';
import parallelCoordinatesLogo from '../../assets/images/parallel-coordinates-overview.svg';
import BarChart from "../../chart-components/bar-chart/bar-chart";
import { getCurrentSampleList, StatefulData, getOriginalSliderStates, getOriginalSelectedOptions, SliderState, OptionState } from "../visual-scenario-board/visual-scenario-board";
import LineChart from "../../chart-components/line-chart/line-chart";
import ScatterChart from "../../chart-components/scatter-chart/scatter-chart";
import StackedBarChart from "../../chart-components/stacked-bar-chart/stacked-bar-chart";
import SpiderChart from "../../chart-components/spider-chart/spider-chart";
import ScatterPlotMatrix from "../../chart-components/scatter-plot-matrix/scatter-plot-matrix";
import ParCoords from "../../chart-components/parallel-coordinates/parallel-coordinates";

export const mapGraph2NameAndGraphSrc: {
  [key in Graph]: {
    name: string,
    src: string
  }
} = {
  'BarChart': { name: 'Bar Chart', src: barChartLogo },
  'StackedBarChart': { name: 'Stacked Bar Chart', src: stackedBarChartLogo },
  'LineChart': { name: 'Line Chart', src: lineChartLogo },
  'SpiderChart': { name: 'Spider Chart', src: spiderChartLogo },
  'ScatterChart': { name: 'Scatter Chart', src: scatterChartLogo },
  'ScatterPlotMatrix': { name: 'Scatter Plot Matrix', src: scatterPlotMatrixLogo },
  'ParallelCoordinates': { name: 'Parallel Coordinates', src: parallelCoordinatesLogo },
}

interface Props {
  graph: Graph;
  data: Data[];

  style?: any;
  chartClick?: (graph: Graph) => void;
  disablePreview?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
}

interface State {
  previewVisible: boolean;
}

class ChartCard extends React.Component<Props, State> {

  private modalWindowWidth = 500;
  private modalWindowHeight = 300;
  private get graphName() {
    return mapGraph2NameAndGraphSrc[this.props.graph].name;
  }
  private get graphSrc() {
    return mapGraph2NameAndGraphSrc[this.props.graph].src;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      previewVisible: false
    }
  }

  render() {
    const { graph, data, isActive, isDisabled, disablePreview, style} = this.props;
    const {previewVisible} = this.state;
    const sliderStates = getOriginalSliderStates(data);
    const optionStates = getOriginalSelectedOptions(data);
    const currentSampleData = getCurrentSampleList(data, [], sliderStates, optionStates);
    return (
      <div className={`chart-card ${styles['card-container']}`} style={style || {}}>
        {isDisabled ? <div className={styles['card-container--disable-mask']} /> : null}
        <Card
          hoverable={true}
          className={`card-item ${isActive ? 'card-item--selected' : ''}`}
          style={{ width: 160, opacity: isDisabled ? 0.5 : 1 }}
          key={this.graphName}
          onClick={this.handleGraphSelect}
          cover={<img alt="graph-logo" src={this.graphSrc} />}>
          <Meta description={this.graphName} />
        </Card>
        {disablePreview || isDisabled ? null : <Icon className={styles['card-container__info']} type="zoom-in" onClick={this.openPreviewModal} />}
        <Modal
          title={`Preview for ${this.graphName}`}
          width={this.modalWindowWidth + 200}
          centered={true}
          footer={null}
          visible={previewVisible}
          onCancel={this.closePreviewModal}
        >
          <div className={`preview-container`}>
            <div className={`preview-container__mask`}/>
            {this.getGraphPreview(graph, data, currentSampleData, sliderStates, optionStates)}
          </div>
        </Modal>
      </div>
    )
  }

  private getGraphPreview = (graph: Graph, originalData: Data[], currentSampleData: StatefulData[], sliderStates: SliderState[], optionStates: OptionState[]) => {
    switch (graph) {
      case 'BarChart':
        return <BarChart data={currentSampleData} width={this.modalWindowWidth} height={this.modalWindowHeight} />;
      case 'LineChart':
        return <LineChart data={currentSampleData} width={this.modalWindowWidth} height={this.modalWindowHeight} />;
      case 'ScatterChart':
        return <ScatterChart
          originalData={originalData}
          height={this.modalWindowHeight}
          width={this.modalWindowWidth}
          sliderStates={sliderStates}
          optionStates={optionStates}/>;
      case 'StackedBarChart':
        return <StackedBarChart data={currentSampleData} width={this.modalWindowWidth} height={this.modalWindowHeight}/>;
      case 'SpiderChart':
        return <SpiderChart data={currentSampleData} width={this.modalWindowWidth} height={this.modalWindowHeight}/>;
      case 'ScatterPlotMatrix':
        return (<ScatterPlotMatrix
          originalData={originalData}
          sliderStates={sliderStates}
          dimensionSize={this.modalWindowWidth}
          highlightedSamples={[]}/>);
      case 'ParallelCoordinates':
        return (
          <ParCoords
            originalData={originalData}
            sliderStates={sliderStates}
            optionsStates={optionStates}
            highlightSamples={[]}
            width={this.modalWindowWidth} height={this.modalWindowHeight} />
        )
      default:
        return null;
    }
  }

  private handleGraphSelect = () => {
    if (this.props.chartClick) {
      this.props.chartClick(this.props.graph);
    }
  }

  private openPreviewModal = () => {
    this.setState({
      previewVisible: true
    });
  }

  private closePreviewModal = () => {
    this.setState({
      previewVisible: false
    });
  }
}

export default ChartCard;