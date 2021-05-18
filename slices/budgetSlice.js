import {createSlice} from '@reduxjs/toolkit';

export const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budgetSubmitByUser: false,
    amount: 0,
  },
  reducers: {
    budgetSubmitted: (state, action) => {
      state.budgetSubmitByUser = true;
      state.amount = action.payload.budgetAmount;

      return state;
    },
  },
});

export const {budgetSubmitted} = budgetSlice.actions;

export default budgetSlice.reducer;
