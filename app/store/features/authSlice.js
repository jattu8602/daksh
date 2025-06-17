import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user || action.payload
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  authSlice.actions

export default authSlice.reducer
