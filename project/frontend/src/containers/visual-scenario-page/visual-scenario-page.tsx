import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, Switch, Route } from "react-router-dom";
import visualisationScenarioEditPage, { VisualisationScenarioRouterParams } from "../visualisation-scenario-edit-page/visualisation-scenario-edit-page";
import { ThunkDispatch } from "redux-thunk";
import { fetchVisualScenario, updateVisualScenario } from "../../store/actions/visual.scenario.action";
import LoadingSkeleton from "../../components/loading-skeleton/loading-skeleton";
import VisualScenarioBoard from "../../components/visual-scenario-board/visual-scenario-board";

interface Props extends RouteComponentProps<VisualisationScenarioRouterParams> {
  projects: AppStore.ProjectStore;
  visualScenarios: AppStore.VisualScenarioStore;
  dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.Action>;
}

interface State {
  isLoading: boolean;
}

class VisualScenarioPage extends React.Component<Props, State> {
  // project should be there before intialization of the component
  currentProject = this.props.projects.currentProject.data as Project;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }
  // handle outside route change
  componentDidMount() {
    const vsId = this.props.match.params.vsId;
    this.setCurrentVisualScenario(vsId);
  }
  // handle inside route change
  shouldComponentUpdate(nextProps: Props, nextState: State) {

    if (nextProps.match.params.vsId !== this.props.match.params.vsId) {
      this.setCurrentVisualScenario(nextProps.match.params.vsId);
    }
    if (nextProps.visualScenarios.currentScenario !== this.props.visualScenarios.currentScenario) {
      return true;
    }
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  render() {
    const {isLoading} = this.state;
    const visualScenario = this.props.visualScenarios.currentScenario.data as VisualisationScenario;
    return (
      <div>
        {isLoading ? (
          <LoadingSkeleton/>
        ) :(
        <Switch>
          <Route path={'/project/:name/:id/:vsName/:vsId/edit'} component={visualisationScenarioEditPage} />
          <Route path={this.props.match.path} render={() => <VisualScenarioBoard visualScenario={visualScenario} project={this.currentProject} changeVisualScenario={this.changeVisualScenario} />} />
        </Switch>
        )}
      </div>
    )
  }

  private changeVisualScenario = (id: string, change: Partial<VisualisationScenario>) => {
    return this.props.dispatch(updateVisualScenario(id, change));
  }

  private setCurrentVisualScenario(id: string) {
    this.props.dispatch(fetchVisualScenario(id)).then(() => {
      this.setState({
        isLoading: false
      })
    }).catch(() => {
      this.props.history.replace('/page-not-found');
    })
  }
}

const extractNecessaryProps = (store: AppStore.Store) => ({
  projects: store.projects,
  visualScenarios: store.visualScenarios
});

export default connect(extractNecessaryProps)(VisualScenarioPage);