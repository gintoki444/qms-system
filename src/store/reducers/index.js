// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import auth from './auth';
import station from './station';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, auth, station });

export default reducers;
