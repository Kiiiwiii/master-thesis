import { ThunkDispatch, ThunkAction } from 'redux-thunk'
import axios from 'axios';
import enviroment from '../../environments/environment';
import store from '../store';

const url = enviroment.endPoint + '/api';
type ThunkResult<R> = ThunkAction<R, AppStore.Store, {}, AppStore.ProjectAction>;

export const FETCH_PROJECTS_REQUEST = 'FETCH_PROJECTS_REQUEST';
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECT_REQUEST = 'FETCH_PROJECT_REQUEST';
export const FETCH_PROJECT_SUCCESS = 'FETCH_PROJECT_SUCCESS';

function requestProjects(): AppStore.ProjectAction {
  return {
    type: FETCH_PROJECTS_REQUEST,
    payload: {
      isFetching: true,
      data: []
    }
  }
}

function receiveProjects(projects: Project[]): AppStore.ProjectAction {
  return {
    type: FETCH_PROJECTS_SUCCESS,
    payload: {
      data: projects,
      isFetching: false
    }
  }
}

function requestProject(): AppStore.ProjectAction {
  return {
    type: FETCH_PROJECT_REQUEST,
    payload: {
      data: null,
      isFetching: true
    }
  }
}

function receiveProject(project: Project): AppStore.ProjectAction {
  return {
    type: FETCH_PROJECT_SUCCESS,
    payload: {
      data: project,
      isFetching: false
    }
  }
}

export function emptyCurrentProject(): AppStore.ProjectAction {
  return {
    type: FETCH_PROJECT_SUCCESS,
    payload: {
      data: null,
      isFetching: false
    }
  }
}

export function fetchProject(id: string): ThunkResult<Promise<Project>> {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.ProjectAction>) => {
    dispatch(requestProject());
    return axios.get(`${url}/project/project-item`, {
      params: {id}
    }).then(response => response.data.data).then(p => ({...p, id: p._id})).then(project => {
      dispatch(receiveProject(project));
      return project;
    })
  }
}

// @TODO, we can add more params here in the future
export function fetchProjects(): ThunkResult<void> {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.ProjectAction>) => {
    dispatch(requestProjects());
    axios.get(`${url}/project/projects`).then(result => {
      return result.data.data;
    }).then(projects => projects.map((project: any) => ({...project, id: project._id}))).then(projects => {
      dispatch(receiveProjects(projects))
    })
  }
}

export function createNewProject(newProjectInformation: any) {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.ProjectAction>) => {
    return axios.post(`${url}/project/add`, newProjectInformation).then(response => response.data.data).then(project => {
      return { ...project, id: project._id }
    }).then(project => {
      // update project list
      const currentProjects = store.getState().projects.list.data;
      dispatch(receiveProjects([project, ...currentProjects]));
      // update current project
      dispatch(receiveProject(project));
      return project;
    })
  }
}

export function updateProject(id: string, update: Partial<Project>) {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.ProjectAction>) => {
    return axios.patch(`${url}/project/update`, {
      id,
      update
    }).then(response => response.data.data).then(p => ({...p, id: p._id})).then(project => {
      // update project list
      const currentProjects = store.getState().projects.list.data;
      const index = currentProjects.findIndex(p => p.id === id);
      const newProjects = [...currentProjects];
      newProjects.splice(index, 1, project);
      dispatch(receiveProjects(newProjects));
      // update current project
      dispatch(receiveProject(project));
      return project;
    });
  }
}

export function deleteProject(id: string) {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.ProjectAction>) => {
    return axios.delete(`${url}/project/delete`, {
      data: {id}
    }).then(response => response.data.data).then(p => ({ ...p, id: p._id })).then(deletedProject => {
      const currentProjects = store.getState().projects.list.data;
      const newProjects = [...currentProjects];
      const index = newProjects.findIndex(p => p.id === id);
      newProjects.splice(index, 1);
      dispatch(receiveProjects(newProjects));
    });
  }
}