import React from "react";
import styles from './loading-skeleton.module.less';
import { Spin } from "antd";

class LoadingSkeleton extends React.Component {
  render() {
    return (
      <div className={styles['wrapper']}>
        <Spin />
      </div>
    )
  }
}

export default LoadingSkeleton;