import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/taskSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const middleware = [...getDefaultMiddleware({ serializableCheck: false })];

const rootReducer = combineReducers({
  task: taskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
