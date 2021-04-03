import React from "react";
import { OptionState, SelectedOptionChange } from "../visual-scenario-board/visual-scenario-board";
import { Checkbox, Select } from "antd";
import styles from './variable-select.module.less';
const Option = Select.Option;

interface Props extends OptionState {
  selectedOptionsChange: (changes: SelectedOptionChange[]) => void;
  checkStateChange: (checked: boolean, name: string) => void;
}

class VariableSelect extends React.Component<Props> {
  render() {
    const {checked, name, allOptions, selected} = this.props;
    return (
      <div className={styles['wrapper']}>
        <div className={styles['header-wrapper']}>
          <div style={{opacity: checked ? 1 : 0.3}}>-  {name}</div>
          <Checkbox className={styles['checkbox']} checked={checked} onChange={this.hanldeCheckStateChange} />
        </div>
        <Select mode="tags" disabled={!checked} value={selected} style={{ width: '100%', opacity: checked ? 1 : 0.3 }} onChange={this.handleSelectedOptionsChange}>
          <Option value="all"> Select all </Option>
          {allOptions.map(o => <Option key={o} value={o}>{o}</Option>)}
        </Select>
      </div>
    );
  }

  private hanldeCheckStateChange = (e: any) => {
    this.props.checkStateChange(e.target.checked, this.props.name);
  }
  private handleSelectedOptionsChange = (values: string[]) => {
    const selected = values.includes('all') ? this.props.allOptions : values;
    this.props.selectedOptionsChange([{selected, name: this.props.name}]);
  }
}

export default VariableSelect;