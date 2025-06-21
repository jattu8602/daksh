'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  posts: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
}

export const fetchPosts = createAsyncThunk(
  'feed/fetchPosts',
  async (_, { getState }) => {
    const { feed } = getState()
    const response = await axios.get(`/api/posts?page=${feed.page}&limit=4`)
    return response.data
  },
  {
    condition: (_, { getState }) => {
      const { feed } = getState()
      if (feed.isLoading || !feed.hasMore) {
        return false
      }
    },
  }
)

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data.length > 0) {
          const newPosts = action.payload.data
          const existingIds = new Set(state.posts.map((p) => p.id))
          const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id))
          state.posts = [...state.posts, ...uniqueNewPosts]
          state.page = action.payload.currentPage + 1
          state.hasMore = action.payload.currentPage < action.payload.totalPages
        } else {
          state.hasMore = false
        }
        state.isLoading = false
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
        state.hasMore = false // Stop trying on error
      })
  },
})

export default feedSlice.reducer
