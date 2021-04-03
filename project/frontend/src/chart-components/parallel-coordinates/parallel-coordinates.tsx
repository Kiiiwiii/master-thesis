import React from 'react';
import Plot from '../Plotly';
import { SliderState, SliderChange, OptionState, SelectedOptionChange } from '../../components/visual-scenario-board/visual-scenario-board';
import styles from './parallel-coordinates.module.less';
import { getNumberDecimalPartLength } from '../../components/variable-slider/variable-slider';

// normal | highlight
export type ColorType = 0 | 1

interface Props {
  originalData: Data[];
  highlightSamples: string[];
  sliderStates: SliderState[];
  optionsStates: OptionState[];

  height: number;
  width?: number;
  sliderRangeChange?: (changes: SliderChange[]) => void;
  selectedOptionsChange?: (changes: SelectedOptionChange[]) => void
}

// https://plot.ly/javascript/reference/#parcoords
class ParCoords extends React.Component<Props> {

  private columns = [] as Array<SliderState | OptionState>;
  private columnsOrder = [] as string[];
  private mapTickText2Value: {
    [key in string]: {
      [text in string]: number
    }
  } = {};
  private colorScales: Array<[number, string]> = [];
  private parcoordsRef: React.RefObject<any>;
  constructor(props: Props) {
    super(props);
    this.parcoordsRef = React.createRef();
  }

  render() {
    const {originalData, sliderStates, optionsStates, highlightSamples, height, width} = this.props;
    const colors = this.getColors(originalData, highlightSamples);
    if (colors.every(c => c === 0)) {
      this.colorScales = [[0, '#00C6A0'], [1, '#00C6A0']]
    } else {
      this.colorScales = [[0, '#00C6A0'], [0.5, '#00C6A0'], [0.5, '#3C31B3'], [1, '#3C31B3']];
    }
    const data = [{
      type: 'parcoords',
      line: {
        color: colors,
        colorscale: this.colorScales
      },
      // @MARK: The getDimensions function will also update the columns
      dimensions: this.getDimensions(originalData, sliderStates, optionsStates)
    }] as any;
    return (
      this.isDataValid() ? (
        <div className={styles['wrapper']}>
          <div className={styles['chart']}>
            <Plot
              ref={this.parcoordsRef}
              onRestyle={this.handleBrush}
              data={data}
              layout={{ width: width || this.columns.length * 150, height }}
            />
          </div>
        </div>
      ) : <div> Please enable at least two attributes</div>
    );
  }

  private getDimensions(originalData: Data[], sliderStates: SliderState[], optionStates: OptionState[]) {
    // should follow the cached order
    const states = [] as Array<SliderState | OptionState>;
    const temporaryStates = [...sliderStates, ...optionStates]
    this.columnsOrder.forEach(name => {
      const foundIndex = temporaryStates.findIndex(state => state.name === name);
      if(foundIndex > -1) {
        states.push(...temporaryStates.splice(foundIndex, 1))
      }
    });
    this.columns = [...states, ...temporaryStates].filter(s => s.checked);
    return this.columns.map(state => {
      const result = {
        label: state.name
      } as any;
      // if it is a slider state column
      if((state as SliderState).min !== undefined && (state as SliderState).max !== undefined) {
        const _state = state as SliderState;
        result.range = [_state.min, _state.max];
        result.multiselect = false;
        if (!(_state.min === _state.from && _state.max === _state.to)) {
          result.constraintrange = [_state.from, _state.to]
        }
        result.values = originalData.map(data => data[_state.name]);
      }
      // if it is a optional state column
      else if ((state as OptionState).allOptions) {
        const _state = state as OptionState;
        const mapTickText2Value = {} as any;
        _state.allOptions.forEach((data, index) => {
          mapTickText2Value[`${data}`] = index + 1;
        });

        this.mapTickText2Value[_state.name] = mapTickText2Value;

        result.tickvals = Object.values(mapTickText2Value);
        result.ticktext = Object.keys(mapTickText2Value);
        const len = result.tickvals.length;
        // sometimes there can be only one type of the nominal data
        result.range = [result.tickvals[0], result.tickvals[len - 1]];
        result.values = originalData.map(d => d[_state.name]).map(d => mapTickText2Value[d]);
        result.multiselect = true;
        if(_state.allOptions.length !== _state.selected.length) {
          result.constraintrange = _state.selected.map(option => [mapTickText2Value[option] - 0.5, mapTickText2Value[option] + 0.5])
        }
      }
      return result;
    });
  }

  private handleBrush = (e: any) => {
    // @TODO cache the reordering events

    // https://codepen.io/monfera/pen/dNBwOv?editors=0010
    // irrelevant events
    if(!e) {
      return;
    }
    const states = this.columns;
    const rawKey = Object.keys(e[0])[0];
    const rawData = e[0][Object.keys(e[0])[0]] as Array<[number, number]> | null;
    const findedIndex = (rawKey.match(/(\d+)/) as RegExpMatchArray);
    if(!findedIndex) {
      // reordering events
      if(e[0].dimensions && e[0].dimensions[0]) {
        this.columnsOrder = Object.values(e[0].dimensions[0]).map((d: any) => d.label) as string[];
      }
      return;
    }
    const index = +findedIndex[1];
    const state = states[index];
    // if it is a slider state column
    if ((state as SliderState).min !== undefined && (state as SliderState).max !== undefined) {
      const _state = state as SliderState;
      const from = rawData ? +(rawData[0])[0].toFixed(getNumberDecimalPartLength([_state.min])) : _state.min;
      const to = rawData ? +(rawData[0])[1].toFixed(getNumberDecimalPartLength([_state.max])) : _state.max;
      if(this.props.sliderRangeChange) {
        this.props.sliderRangeChange([{ name: _state.name, from, to }]);
      }
    }
    // if it is a optional state column
    else if ((state as OptionState).allOptions) {
      const _state = state as OptionState;
      let selectedOptions = [] as any;
      // select all options
      if(!rawData) {
        selectedOptions = _state.allOptions
        // special case, only one select
      } else if (typeof rawData[0][0] === 'number') {
        selectedOptions = this.getSelectedOptions(rawData[0][0], rawData[0][1], _state);
      } else {
        selectedOptions = ((rawData as any)[0] as Array<[number, number]>).map(d => {
          return this.getSelectedOptions(d[0], d[1], _state);
        });
        selectedOptions = selectedOptions.flat();
      }
      if(this.props.selectedOptionsChange) {
        this.props.selectedOptionsChange([{ selected: selectedOptions, name: _state.name }]);
      }
    }
  }

  private getColors(originalData: Data[], highlightSamples: string[]): ColorType[] {
    return originalData.map(d => {
      if(highlightSamples.find(name => name === d.sampleName)) {
        return 1;
      }
      return 0;
    });
  }

  private getSelectedOptions(start: number, end: number, state: OptionState) {
    // end value should be compensated if it is the max value (because the end value is ceiled)
    const maxValue = Object.values(this.mapTickText2Value[state.name]).pop();
    const min = Math.ceil(start);
    let max: number;
    if(end === maxValue) {
      max = Math.ceil(end);
    } else {
      max = Math.ceil(end) - 1;
    }

    return this.generateArr(min, max).map(num => {
      const option = Object.keys(this.mapTickText2Value[state.name]).find(key => {
        return this.mapTickText2Value[state.name][key] === num;
      });
      return option as string;
    });
  }
  private generateArr(min: number, max: number) {
    const arr = [];
    for(let i = 0; i < max - min + 1; i++) {
      arr.push(min + i);
    }
    return arr;
  }
  private isDataValid() {
    return this.columns.length > 1;
  }
}

export default ParCoords;