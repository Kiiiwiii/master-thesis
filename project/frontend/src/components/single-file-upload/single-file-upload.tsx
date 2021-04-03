import React from "react";
import { Upload, Icon } from 'antd';

interface Props {
  name: string;
  accept: string;
  onChange?: (file: any[]) => any;
  value?: any[]
}
interface State {
  fileList: any[];
}

// https://ant.design/components/form/#components-form-demo-customized-form-controls
// in the example, there is a drawback that the customized component can not be validated when initialization
// thus validation check in the submit event of the form is necessary
class SingleFileUpload extends React.Component<Props, State> {

  static getDerivedStateFromProps(nextProps: Props) {
    if ('value' in nextProps) {
      return {
        fileList: nextProps.value || []
      };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      fileList: (props as any).value || []
    }
  }

  render() {
    const {name, accept} = this.props;
    const { fileList } = this.state;
    return (
      <Upload.Dragger
        name={name}
        accept={accept}
        fileList={fileList}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        onRemove={this.handleRemove}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">{`Click or drag a ${name} file to upload`}</p>
      </Upload.Dragger>
    );
  }

  private beforeUpload = (file: any) => {
    this.setState(state => ({
      fileList: [...state.fileList, file],
    }));
    return false;
  }
  private handleChange = (info: any) => {
    if (!('value' in this.props)) {
      this.setState({ fileList: info.fileList });
    }
    this.triggerChange([info.file]);
  }
  private handleRemove = () => {
    if (!('value' in this.props)) {
      this.setState({ fileList: [] });
    }
    this.triggerChange([]);
  }
  private triggerChange = (value: any[]) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  }
}

export default SingleFileUpload;