import { configureStore } from '@reduxjs/toolkit';
import dummyReducer from './reducers/dummyReducer';
import musicReducer from './slices/musicSlice';


const store = configureStore({
  reducer: { music: musicReducer },
});

export default store;