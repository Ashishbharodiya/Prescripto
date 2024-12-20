import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "../Reducer/RootReducers";
import { thunk } from "redux-thunk";

export const store = createStore(rootReducer,applyMiddleware(thunk))