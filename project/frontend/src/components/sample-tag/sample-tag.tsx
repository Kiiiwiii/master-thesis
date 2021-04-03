import React from "react";
import { Popover, Button, Tabs } from "antd";
import styles from "./sample-tag.module.less";
import ObjLoader from "../obj-loader/obj-loader";

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

interface Props {
  data: Data;
  image: string;
  obj: string;
  mtl: string;
  isHighlighted: boolean;
  toggleHighlight: (name: string, isHighlighted: boolean) => void;
}

interface State {
  panelVisible: boolean
}

class SampleTag extends React.Component<Props, State> {

  private get panelContent(): JSX.Element {
    const variables = Object.keys(this.props.data).filter(key => key !== 'sampleName').map(key => ({key, value: this.props.data[key]}))
    const variableLength = variables.length === 0;
    const {image, obj, mtl} = this.props;
    return (
      <div className={styles['panel']}>
        <div className={styles['panel__visual']}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Image" key="1">
              {image === 'undefined' ? 'Image is not available' : (
                <img className={styles['panel__image']} src={image}/>
              )}
            </TabPane>
            <TabPane tab="3D Model" key="2">
              {obj === 'undefined' || mtl === 'undefined' ? '3D Model is not available' : (
                <ObjLoader objSrc={obj} mtlSrc={mtl} width={400} height={350}/>
              )}
            </TabPane>
          </Tabs>
        </div>
        <div className={styles['panel__info']}>
          {variableLength ? 'Please select a variable.' : variables.map(v => (
            <div className={styles['panel-item']} key={v.key}>- {v.key}: {v.value}</div>
          ))}
        </div>
      </div>
    )
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      panelVisible: false
    }
  }
  render() {
    const {data, isHighlighted} = this.props;
    return (
      <ButtonGroup className={`${styles['btn-group']}`}>
        <Button type={isHighlighted ? "primary" : "default"} onClick={this.toggleHighlight}>{data.sampleName}</Button>
        <Popover
          content={this.panelContent}
          title={data.sampleName}
          trigger="click"
          visible={this.state.panelVisible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button type="default" icon="info"/>
        </Popover>
      </ButtonGroup>

    )
  }

  private toggleHighlight = () => {
    this.props.toggleHighlight(this.props.data.sampleName, this.props.isHighlighted);
  }

  private handleVisibleChange = (visible: boolean) => {
    this.setState({
      panelVisible: visible
    })
  }

}

export default SampleTag;