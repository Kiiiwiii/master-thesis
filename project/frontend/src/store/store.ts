import { createStore, applyMiddleware, Store } from "redux";
import app from "./reducers/reducer";
import thunk from "redux-thunk";

const middleware = applyMiddleware(thunk)
const store: Store<AppStore.Store> = createStore(app, middleware);
export default store;