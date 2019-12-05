import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { Persistor } from "redux-persist/es/types";
import { Store } from 'redux';
import thunk from "redux-thunk";
import normalStorage from "./normalStorage";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import AuthReducer from "../../reducers/authReducer";
import sensitiveStorage from "./sensitiveStorage";
import ConnectReducer from "../../reducers/connectReducer";
import InterfaceReducer from "../../reducers/interfaceReducer";

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function }
}

const rootPersistConfig = {
    key: "root",
    storage: normalStorage
};

const authPersistConfig = {
    key: "authCredentials",
    storage: sensitiveStorage,
    stateReconciler: hardSet,
    blacklist: ["loginStatus"]
};

const connectPersistConfig = {
    key: "connectionStatus",
    storage: sensitiveStorage,
    stateReconciler: hardSet,
    blacklist: ["connectStatus"]
};

const interfacePersistConfig = {
    key: "jellyfinInterface",
    storage: sensitiveStorage,
    stateReconciler: hardSet,
    blacklist: ["apiClient"]
};

const rootReducer = combineReducers({
    authCredentials: persistReducer(authPersistConfig, AuthReducer),
    connectionStatus: persistReducer(connectPersistConfig, ConnectReducer),
    jellyfinInterface: persistReducer(interfacePersistConfig, InterfaceReducer)
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  || compose;

const createJellyfinStore = (): { store: Store; persistor: Persistor } => {
    const store = createStore(persistedReducer, {}, composeEnhancers(applyMiddleware(thunk)));
    const persistor = persistStore(store);
    return { store, persistor };
};

const jellyfinStore = createJellyfinStore();

export default jellyfinStore;
