import React, { Component } from "react";
import styles from './text-list-item.module.less';
import DatePipe from "../../global/date.pipe";

interface Props {
  title?: string;
  content?: string;
  date?: number;
}
class TextListItem extends Component<Props> {
  render() {
    return (
      <div className={styles['container']}>
        <div className={styles['header-group']}>
          <div className={styles['header-group__header']}>{this.props.title}</div>
          {this.props.date ? (
            <div className={styles['header-group__date']}>{DatePipe(this.props.date)}</div>
          ) : null}
        </div>
        <div className={styles['content']}>
          {this.props.content}
        </div>
      </div>
    )
  }
}

export default TextListItem;