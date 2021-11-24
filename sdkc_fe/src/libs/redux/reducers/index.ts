import { combineReducers } from 'redux';
import gallery from './gallery.reducer';
import app from './app.reducer';
import test from './test-gallery.reducer';

export default combineReducers({ gallery, app, test });
