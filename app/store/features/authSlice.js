'use client'
import { createSlice } from '@reduxjs/toolkit'

// Function to get item from localStorage safely
const getItemFromLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
  return null
}

const initialState = {
  user: getItemFromLocalStorage('user'),
  isAuthenticated: !!getItemFromLocalStorage('user'),
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  authSlice.actions

export default authSlice.reducer
