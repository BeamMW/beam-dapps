import { combineReducers } from 'redux';
import gallery from './gallery.reducer';
import app from './app.reducer';

export default combineReducers({ gallery, app });
