import React, { Component } from "react";
import styles from './project-list.module.less';
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Button, Icon } from "antd";
import DatePipe from '../../global/date.pipe';
import { RouteComponentProps, withRouter } from "react-router";
import { ProjectRouterParams } from "../project-page/project-page";

interface Props extends RouteComponentProps<ProjectRouterParams> {
  dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.Action>;
  projects: AppStore.ProjectStore;
  changeDrawerOpenState: (isOpen: boolean) => void;
}

class ProjectList extends Component<Props>{

  shouldComponentUpdate(nextProps: Props) {
    if(this.props.projects !== nextProps.projects) {
      return true;
    }
    if(this.props.match.params !== nextProps.match.params) {
      return true;
    }
    return false;
  }

  render() {
    const {data: items } = this.props.projects.list;
    const {isFetching: isProjectListFetching} = this.props.projects.list;

    const currentProjectId = this.props.match.params.id;
    return (
      <div className={styles['container']}>
        {items.length > 0 ? <div className={`${styles['project-list']}
              ${isProjectListFetching ? styles['project-list--fetching'] : ''}`}>
          {
            isProjectListFetching
              ? <Icon type="loading" className={styles['project-list--loading-spinner']} /> :
              items.map(project => (
                <div key={project.id}
                  onClick={this.selectProject(project)}
                  className={`${styles['project-item']}
                    ${currentProjectId && currentProjectId === project.id ?
                      styles['project-item--active'] : ''}`}>
                  <div className={styles['project-item__name']}>{project.name}</div>
                  <div className={styles['project-item__timestamp']}>{DatePipe(project.updatedAt)}</div>
                </div>
              ))
          }
        </div> : null}
        <div className={styles['new-project-btn']}>
          <Button onClick={this.navigateToCreateProjectPage} icon="plus">Create New Project</Button>
        </div>
      </div>
    )
  }

  private selectProject = (project: Project) => {
    return () => {
      this.props.changeDrawerOpenState(false);
      this.props.history.push(`/project/${project.name}/${project.id}`)
    }
  }

  private navigateToCreateProjectPage = () => {
    this.props.changeDrawerOpenState(false);
    this.props.history.push('/project/new-project');
  }
}

const extractNecessaryProps = (store: AppStore.Store) => ({
  // this.props.projects
  projects: store.projects,
});
export default withRouter(connect(extractNecessaryProps)(ProjectList));