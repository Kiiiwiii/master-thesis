import React, { Component } from "react";
import styles from './app-home-page.module.less';
import { Tooltip } from "antd";
import homeLogo from '../../assets/images/home-logo.svg';
import { RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps {
  openDrawer: () => void;
}

class AppHomePage extends Component<Props> {

  render() {
    return (
      <div className={styles['home']}>
        <Tooltip placement="top" title="Click me to discover more">
          <img className={styles['home-logo']} src={homeLogo} onClick={this.showDrawer} />
        </Tooltip>
      </div>
    )
  }

  private showDrawer = () => {
    this.props.openDrawer();
  };
}

export default AppHomePage;