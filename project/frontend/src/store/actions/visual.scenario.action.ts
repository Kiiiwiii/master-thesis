import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { scenarios as _scenarios } from "../../dummy.data";
import axios from 'axios';
import store from '../store';
import enviroment from "../../environments/environment";

const url = enviroment.endPoint + '/api' + '/visualScenario';
type ThunkResult<R> = ThunkAction<R, AppStore.Store, {}, AppStore.VisualScenarioAction>;


export const FETCH_V_SCENARIOS_LIST_REQUEST = 'FETCH_V_SCENARIOS_LIST_REQUEST';
export const FETCH_V_SCENARIOS_LIST_SUCCESS = 'FETCH_V_SCENARIOS_LIST_SUCCESS';
export const FETCH_V_SCENARIO_REQUEST = 'FETCH_V_SCENARIO_REQUEST';
export const FETCH_V_SCENARIO_SUCCESS = 'FETCH_V_SCENARIO_SUCCESS'
export const SET_CURRENT_V_SCENARIO = 'SET_CURRENT_V_SCENARIO';

function requestScenario(): AppStore.VisualScenarioAction {
  return {
    type: FETCH_V_SCENARIO_REQUEST,
    payload: {
      data: null,
      isFetching: true
    }
  }
}

function receiveScenario(scenario: VisualisationScenario): AppStore.VisualScenarioAction {
  return {
    type: FETCH_V_SCENARIO_SUCCESS,
    payload: {
      data: scenario,
      isFetching: false
    }
  }
}

// list
function requestScenarios(): AppStore.VisualScenarioAction {
  return {
    type: FETCH_V_SCENARIOS_LIST_REQUEST,
    payload: {
      isFetching: true,
      data: []
    }
  }
}

function receiveScenarios(scenarios: VisualisationScenario[]): AppStore.VisualScenarioAction {
  return {
    type: FETCH_V_SCENARIOS_LIST_SUCCESS,
    payload: {
      isFetching: false,
      data: scenarios
    }
  }
}

export function emptyCurrentVisualScenario(): AppStore.VisualScenarioAction {
  return {
    type: FETCH_V_SCENARIO_SUCCESS,
    payload: {
      data: null,
      isFetching: false
    }
  }
}

export function createNewVisualScenario(visualScenario: Partial<VisualisationScenario>) {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.VisualScenarioAction>) => {
    return axios.post(`${url}/add`, {visualScenario})
      .then(response => response.data.data)
      .then(vs => ({...vs, id: vs._id}))
      .then(vs => {
        // update list
        const currentVisualScenarios = store.getState().visualScenarios.list.data;
        dispatch(receiveScenarios([...currentVisualScenarios, vs]));
        dispatch(receiveScenario(vs));
        return vs as VisualisationScenario;
      })
  }
}
export function updateVisualScenario(id: string, update: Partial<VisualisationScenario>): ThunkResult<Promise<VisualisationScenario>> {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.VisualScenarioAction>) => {
    return axios.patch(`${url}/update`, {
      id, update
    }).then(response => response.data.data)
    .then(vs => ({...vs, id: vs._id}))
    .then(vs => {
      const currentVisualScenarios = store.getState().visualScenarios.list.data;
      const index = currentVisualScenarios.findIndex(_vs => _vs.id === id);
      const newVisualScenarios = [...currentVisualScenarios];
      newVisualScenarios.splice(index, 1, vs);
      dispatch(receiveScenarios(newVisualScenarios));
      dispatch(receiveScenario(vs));
      return vs;
    })
  }
}

export function deleteVisualScenario(id: string) {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.VisualScenarioAction>) => {
    return axios.delete(`${url}/delete`, {
      data: { id }
    }).then(response => response.data.data).then(p => ({ ...p, id: p._id })).then(deletedVs => {
      const currentVisualScenarios = store.getState().visualScenarios.list.data;
      const index = currentVisualScenarios.findIndex(_vs => _vs.id === id);
      const newVisualScenarios = [...currentVisualScenarios];
      newVisualScenarios.splice(index, 1);
      dispatch(receiveScenarios(newVisualScenarios));
    });
  }
}

export function fetchVisualScenario(id: string): ThunkResult<Promise<VisualisationScenario>> {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.VisualScenarioAction>) => {
    dispatch(requestScenario());
    return axios.get(`${url}/visualScenario`, {
      params: {id}
    })
    .then(result => result.data.data)
    .then(vs => ({...vs, id: vs._id}))
    .then(vs => {
      dispatch(receiveScenario(vs));
      return vs;
    })
  }
}

export function fetchVisualScenarios(projectId: string): ThunkResult<Promise<void>> {
  return (dispatch: ThunkDispatch<AppStore.Store, {}, AppStore.VisualScenarioAction>) => {
    dispatch(requestScenarios());
    return axios.get(`${url}/visualScenarios`, {
      params: { projectId }
    })
    .then(result => result.data.data)
    .then(vs => vs.map((v: any) => ({...v, id: v._id})))
    .then(vs => {
      dispatch(receiveScenarios(vs));
    })
  }
}