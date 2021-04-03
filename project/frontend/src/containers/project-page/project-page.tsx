import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { RouteComponentProps, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { fetchProject } from "../../store/actions/project.action";
import VisualScenarioList from "../visual-scenario-list/visual-scenario-list";
import ProjectEditPage from "../project-edit-page/project-edit-page";
import VisualScenarioPage from '../visual-scenario-page/visual-scenario-page';
import VisualisationScenarioEditPage from '../visualisation-scenario-edit-page/visualisation-scenario-edit-page';
import LoadingSkeleton from "../../components/loading-skeleton/loading-skeleton";

type dispatchAction = AppStore.ProjectAction;
export interface ProjectRouterParams {
  name: string,
  id: string
}
interface Props extends RouteComponentProps<ProjectRouterParams> {
  projects: AppStore.ProjectStore
  dispatch: ThunkDispatch<AppStore.Store, {}, dispatchAction>
}

class ProjectPage extends Component<Props> {
  // handle outside route change
  componentDidMount() {
    const id = this.props.match.params.id;
    const currentProject = this.props.projects.currentProject.data
    if (currentProject && currentProject.id === id) {
      return;
    }
    this.getProject(id);
  }

  shouldComponentUpdate(nextProps: Props) {
    // handle inside route update
    if (this.props.match.params.id !== nextProps.match.params.id || this.props.match.params.name !== nextProps.match.params.name) {
      const id = nextProps.match.params.id;
      this.getProject(id);
      return false;
    }
    if (nextProps.projects.currentProject !== this.props.projects.currentProject) {
      return true;
    }
    return false;
  }

  render() {
    const {data: currentProject} = this.props.projects.currentProject;
    const {isFetching: isFetchCurrentProject} = this.props.projects.currentProject;
    return (
      <div>
        {isFetchCurrentProject || !currentProject ? (
          <LoadingSkeleton />
        ) : (
        <Switch>
          <Route exact={true} path={this.props.match.url} component={VisualScenarioList} />
          <Route path={'/project/:name/:id/:vsName/:vsId'} component={VisualScenarioPage} />
          <Route path={'/project/:name/:id/edit'} component={ProjectEditPage} />
          <Route path={'/project/:name/:id/new-visualisation-scenario'} component={VisualisationScenarioEditPage} />
        </Switch>
        )}
      </div>
    )
  }

  private getProject = (id: string) => {
    return this.props.dispatch(fetchProject(id)).then().catch(() => {
      this.props.history.replace('/page-not-found');
    });
  }
}

const extractNecessaryProps = (store: AppStore.Store) => ({
  projects: store.projects,
});

export default connect(extractNecessaryProps)(ProjectPage);