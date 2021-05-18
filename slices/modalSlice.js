import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
    name: 'modal',
    initialState: false,
    reducers: {
        showModal : state => {
            return true;
        },
        hideModal : state => {
            return false;
        }
    }
})

export const  {showModal , hideModal} = modalSlice.actions

export default modalSlice.reducer