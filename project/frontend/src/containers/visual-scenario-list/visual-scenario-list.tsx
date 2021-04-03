import React, { Component } from "react";
import { Button, List, Card, Icon } from "antd";
import styles from './visual-scenario-list.module.less';
import Meta from "antd/lib/card/Meta";
import DatePipe from "../../global/date.pipe";
import { ThunkDispatch } from "redux-thunk";
import { fetchVisualScenarios } from "../../store/actions/visual.scenario.action";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ProjectRouterParams } from "../project-page/project-page";
import LoadingSkeleton from "../../components/loading-skeleton/loading-skeleton";
import HeaderGroup from "../../components/header-group/header-group";
import { mapGraph2NameAndGraphSrc } from "../../components/chart-card/chart-card";
import './visual-scenario-list.less';

type dispatchAction = AppStore.VisualScenarioAction
interface Props extends RouteComponentProps<ProjectRouterParams> {
  projects: AppStore.ProjectStore;
  visualScenarios: AppStore.VisualScenarioStore
  dispatch: ThunkDispatch<AppStore.Store, { }, dispatchAction>;
}
class VisualScenarioList extends Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.visualScenarios.list !== this.props.visualScenarios.list) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    const currentProject = this.props.projects.currentProject.data as Project;
    this.props.dispatch(fetchVisualScenarios(currentProject.id));
  }

  render() {
    const {isFetching: isLoading} = this.props.visualScenarios.list;
    const {data: visualScenarios} = this.props.visualScenarios.list;
    const project = this.props.projects.currentProject.data as Project;
    const headerPath = `/project/${project.name}/${project.id}`;
    return (
      isLoading ? <LoadingSkeleton /> : (
        <div className="visual-scenario-list">
          <HeaderGroup header={[{name: project.name, path: headerPath}]}/>
          <div className={styles['container']}>
            <div className={styles['visual-scenario-btn-group']}>
              <Button icon="plus" onClick={this.navigateToVisualisationScenarioCreatePage(project)}>Create New Visual Scenario</Button>
              <Button onClick={this.navigateToProjectEditPage(project)}>Edit project<Icon type="tool" /></Button>
            </div>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={visualScenarios}
              renderItem={item => (
                <List.Item>
                  <Card
                    onClick={this.navigateToVisualisationScenarioPage(project, item)}
                    hoverable={true}
                    style={{ width: 200 }}
                    cover={<img alt="example" src={this.getCardImgSrc(item.selectedGraph)} />}
                  >
                    <Meta
                      title={
                        <div className={styles['visual-scenario-header']}>
                          <div>{item.name}</div>
                          <div className={styles['visual-scenario-header__date']}>{DatePipe(item.updatedAt)}</div>
                        </div>
                      }
                      description={item.description}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </div>
      )
    )
  }

  private getCardImgSrc = (graph: Graph) => {
    return mapGraph2NameAndGraphSrc[graph].src
  }
  private navigateToVisualisationScenarioPage = (project: Project, visualScenario: VisualisationScenario) => {
    return () => {
      this.props.history.push(`/project/${project.name}/${project.id}/${visualScenario.name}/${visualScenario.id}`);
    }
  }
  private navigateToVisualisationScenarioCreatePage(project: Project) {
    return () => {
      this.props.history.push(`/project/${project.name}/${project.id}/new-visualisation-scenario`);
    }
  }
  private navigateToProjectEditPage = (project: Project) => {
    return () => {
      this.props.history.push(`/project/${project.name}/${project.id}/edit`);
    }
  }
}

const extractNecessaryProps = (store: AppStore.Store) => ({
  projects: store.projects,
  visualScenarios: store.visualScenarios,
});

export default connect(extractNecessaryProps)(VisualScenarioList);