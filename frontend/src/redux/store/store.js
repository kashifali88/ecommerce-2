import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage  from 'redux-persist/es/storage'
import authReducer from '../slice/authSlice'
import productReducer from '../slice/productSlice'
import cartReducer from '../slice/cartSlice'


const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducer,
    cart: cartReducer
    
})


const persistConfig = {
    key: "root",
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig, rootReducer, )

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck:false
        })
    
})
export const persistor = persistStore(store)