import { combineReducers } from "redux";
import projectReducer from "./project.reducer";
import visualScenarioReducer from "./visual.scenario.reducer";

const app = combineReducers<AppStore.Store>({
  projects: projectReducer,
  visualScenarios: visualScenarioReducer
});
export default app;