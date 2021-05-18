import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from './slices/transactionsSlice'
import modalReducer from './slices/modalSlice'
import budgetReducer from './slices/budgetSlice'

const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        modal: modalReducer,
        budget: budgetReducer
    }

})
export default store