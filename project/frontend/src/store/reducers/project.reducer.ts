import { FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS} from '../actions/project.action';
import { Reducer } from 'redux';

const initialState: AppStore.ProjectStore = {
  list: {
    data: [],
    isFetching: false
  },
  currentProject: {
    data: null,
    isFetching: false
  }
};

const projectReducer: Reducer<AppStore.ProjectStore, AppStore.ProjectAction> =
  (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PROJECTS_REQUEST:
        return Object.assign({}, state, {
          list: action.payload
        });
      case FETCH_PROJECTS_SUCCESS:
        return Object.assign({}, state, {
          list: action.payload
        });
      case FETCH_PROJECT_REQUEST:
        return Object.assign({}, state, {
          currentProject: action.payload
        })
      case FETCH_PROJECT_SUCCESS:
        return Object.assign({}, state, {
          currentProject: action.payload
        })
      default:
        return Object.assign({}, state);
    }
  }

export default projectReducer;