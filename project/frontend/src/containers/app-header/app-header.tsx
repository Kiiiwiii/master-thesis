import React, { Component } from 'react';
import styles from './app-header.module.less';
import { Icon } from 'antd';

interface Props {
  openDrawer: () => void;
}

class AppHeader extends Component<Props>{

  render() {
    return (
      <div className={styles['wrapper']}>
        <div className={styles['header']}>
          <Icon className={styles['header__drawer']} type="bars" onClick={this.showDrawer} />
          <div className={styles['header__title']}>
            <div className={styles['title']}>VEAV</div>
            <div className={styles['title__sub']}>| Visual exploration for assessing design variants</div>
          </div>
          <Icon type="crown" />
        </div>
      </div>
    )
  }

  private showDrawer = () => {
    this.props.openDrawer();
  }
}

export default AppHeader;