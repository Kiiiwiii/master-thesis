import { Reducer } from "redux";
import { FETCH_V_SCENARIOS_LIST_REQUEST, FETCH_V_SCENARIOS_LIST_SUCCESS, FETCH_V_SCENARIO_REQUEST, FETCH_V_SCENARIO_SUCCESS } from "../actions/visual.scenario.action";

const initialState: AppStore.VisualScenarioStore = {
  list: {
    data: [],
    isFetching: false,
  },
  currentScenario: {
    data: null,
    isFetching: false,
  }
};

const visualScenarioReducer: Reducer<AppStore.VisualScenarioStore, AppStore.VisualScenarioAction> =
  (state = initialState, action) => {
    switch (action.type) {
      case FETCH_V_SCENARIOS_LIST_REQUEST:
        return Object.assign({}, state, {
          list: action.payload
        })
      case FETCH_V_SCENARIOS_LIST_SUCCESS:
        return Object.assign({}, state, {
          list: action.payload
        })
      case FETCH_V_SCENARIO_REQUEST:
        return Object.assign({}, state, {
          currentScenario: action.payload
        })
      case FETCH_V_SCENARIO_SUCCESS:
        return Object.assign({}, state, {
          currentScenario: action.payload
        })
      default:
        return Object.assign({}, state);
    };
  }

export default visualScenarioReducer;