import React from "react";
import { Divider, Icon } from "antd";
import styles from './header-group.module.less';
import { withRouter, RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps {
  header: Array<{name: string, path?: string}>;
  backPath?: string;
}

class HeaderGroup extends React.Component<Props> {
  render() {
    const {header, backPath} = this.props;
    return (
      <div className={styles['wrapper']}>
        {backPath ? <div className={styles['close']} onClick={this.goBack}><Icon type="close" /></div> : null}
        <div className={styles['headers']}>
          {header.map((item, index) => {
            if (index !== header.length - 1) {
              return (
                <div key={index} className={styles['header']}>
                  <div onClick={this.navigate(item.path)} className={`${styles['header__text']} ${item.path ? styles['header__text--with-path'] : ''}`}>{item.name}</div>
                  <div className={styles['header__slash']}>/</div>
                </div>
              )
            }
            return (
              <div key={index} className={styles['header']}>
                <div onClick={this.navigate(item.path)} className={`${styles['header__text']} ${item.path ? styles['header__text--with-path'] : ''}`}>{item.name}</div>
              </div>
            )
          })}
        </div>

        <Divider className={styles['divider']} />
      </div>
    );
  }

  private goBack = () => {
    const {backPath} = this.props;
    if (backPath) {
      this.props.history.push(backPath);
    }
  }
  private navigate = (path: string | undefined) => {
    return () => {
      if(path) {
        this.props.history.push(path);
      }
    }
  }
}

export default withRouter(HeaderGroup);