import { createSlice } from '@reduxjs/toolkit'

import transactions from '../transactions'

export const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: transactions,
    reducers: {
        addTransaction: (state,action) => {
            state.push(action.payload)
            
            //console.log(state)
        },
        updateTransaction: (state,action) => {
            state=action.payload
            return state
            //console.log(state)
        }
    }
}) 

export const {addTransaction, updateTransaction} = transactionsSlice.actions

export default transactionsSlice.reducer