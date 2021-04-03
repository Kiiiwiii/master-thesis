import React from "react";
import { Button } from "antd";
import style from './page-not-found.module.less';
import { withRouter, RouteComponentProps } from "react-router";


class PageNotFound extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div className={style['wrapper']}>
        <div className={style['header']}>Page Not Found 404</div>
        <Button type="primary" icon="home" onClick={this.goBackHome}>Go Back Home!</Button>
      </div>
    );
  }

  private goBackHome = () => {
    this.props.history.replace('/');
  }
}

export default PageNotFound;