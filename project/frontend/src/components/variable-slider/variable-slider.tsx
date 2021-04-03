import React from "react";
import { Slider, Checkbox } from "antd";
import styles from "./variable-slider.module.less";
import "./variable-slider.less";
import { SliderValue } from "antd/lib/slider";
import { SliderChange } from "../visual-scenario-board/visual-scenario-board";

interface Props {
  name: string;
  from: number;
  to: number;
  min: number;
  max: number;
  checked: boolean;
  rangeChange: (changes: SliderChange[]) => void;
  checkStateChange: (checked: boolean, name: string) => void;
}

interface State {
  from: number;
  to: number;
}


class VariableSlider extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      from: 0,
      to: 0
    }
  }

  componentWillMount() {
    this.setState({
      from: this.props.from,
      to: this.props.to
    })
  }
  componentWillReceiveProps(nextProps: Props) {
    if(nextProps.from !== this.state.from || nextProps.to !== this.state.to) {
      this.setState({
        from: nextProps.from,
        to: nextProps.to,
      })
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if(nextProps.from !== this.props.from || nextProps.to !== this.props.to || nextProps.checked !== this.props.checked) {
      return true;
    }
    if (nextState !== this.state) {
      return true;
    }
    return false;
  }

  render() {
    const {min, max, name, checked, from, to} = this.props;
    const step = (max - min) / 50;
    const fixedPrecision = getNumberDecimalPartLength([max, min]);
    return (
      <div className={styles['wrapper']}>
        <div className={`${styles['slider-group']} ${checked ? '' : styles['slider-group__unchecked']}`}>
          <div className={styles['slider-group__header']}>
            <div className={styles['header__name']}>-  {name}</div>
          </div>
          <div className={styles['slider-group__info']}>
            {from.toFixed(fixedPrecision)} - {to.toFixed(fixedPrecision)}
          </div>
          <Slider className={`${styles['slider-group__slider']} slider-item`}
            disabled={!checked}
            range={true}
            max={max}
            min={min}
            value={[this.state.from, this.state.to]}
            step={step}
            defaultValue={[min, max]}
            onChange={this.changeLocalState}
            onAfterChange={this.handleAfterChange} />
        </div>
        <Checkbox className={styles['checkbox']} checked={checked} onChange={this.onCheckStateChange} />
      </div>
    )
  }

  private onCheckStateChange = (e: any) => {
    this.props.checkStateChange(e.target.checked, this.props.name);
  }

  private changeLocalState = (value: SliderValue) => {
    this.setState({
      from: (value as any)[0],
      to: (value as any)[1]
    })
  }

  private handleAfterChange = (value: SliderValue) => {
    this.props.rangeChange([{
      from: (value as any)[0] as number,
      to: (value as any)[1] as number,
      name: this.props.name
    }]);
  }
}

export default VariableSlider;
export function getNumberDecimalPartLength(refs: number[]): number {
  const regex = /\d+\.(\d+)/;
  let length = 0;
  refs.forEach(n => {
    const result = (n.toString()).match(regex);
    let len = 0;
    if (result) {
      len = result[1].length;
    }
    length = Math.max(length, len);
  });
  return length;
}