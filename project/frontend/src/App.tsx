import React, { Component } from 'react';
import { Drawer } from 'antd';
import styles from './App.module.less';
import ProjectList from './containers/project-list/project-list';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { fetchProjects } from './store/actions/project.action';
import AppHeader from './containers/app-header/app-header';
import { Switch, Route } from 'react-router-dom';
import ProjectPage from './containers/project-page/project-page';
import AppHomePage from './containers/app-home-page/app-home-page';
import ProjectEditPage from './containers/project-edit-page/project-edit-page';
import PageNotFound from './components/page-not-found/page-not-found';

interface Props {
  dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.Action>;
}

interface State {
  isDrawerOpen: boolean;
}

class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {isDrawerOpen: false}
  }
  componentWillMount() {
    this.props.dispatch(fetchProjects());
  }

  render() {
    const {isDrawerOpen} = this.state;
    return (
      <div className={styles['main']}>
        <div className={styles['header']}>
          <AppHeader openDrawer={this.onDrawerOpen}/>
        </div>

        <Drawer
          title="PROJECTS"
          placement="left"
          onClose={this.onDrawerClose}
          visible={isDrawerOpen}
        >
          <Switch>
            <Route path="/project/:name/:id" render={(props) => <ProjectList {...props} changeDrawerOpenState={this.changeDrawerOpenState}/>} />
            <Route render={(props) => <ProjectList {...props} changeDrawerOpenState={this.changeDrawerOpenState} />} />
          </Switch>
        </Drawer>
        <div className={styles['content']}>
          <Switch>
            <Route exact={true} path="/" render={(props) => <AppHomePage {...props} openDrawer={this.onDrawerOpen}/>} />
            <Route path="/project/new-project" component={ProjectEditPage} />
            <Route path="/project/:name/:id" component={ProjectPage}/>
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </div>
    );
  }

  changeDrawerOpenState = (isOpen: boolean) => {
    this.setState({isDrawerOpen: isOpen});
  }
  onDrawerClose = () => {
    this.changeDrawerOpenState(false);
  };
  onDrawerOpen  = () => {
    this.changeDrawerOpenState(true);
  }
}


const extractNecessaryProps = (store: AppStore.Store) => ({});
export default connect(extractNecessaryProps)(App);