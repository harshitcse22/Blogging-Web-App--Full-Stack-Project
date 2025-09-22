import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  currentPost: null,
  userPosts: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },
  filters: {
    search: '',
    category: ''
  }
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setPosts: (state, action) => {
      const { posts, total, pages, currentPage } = action.payload
      state.posts = posts || action.payload.posts || action.payload
      state.pagination = { 
        currentPage: currentPage || 1, 
        totalPages: pages || action.payload.pages || 1, 
        total: total || posts?.length || 0 
      }
      state.isLoading = false
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload.posts || action.payload
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload)
      state.userPosts.unshift(action.payload)
    },
    updatePost: (state, action) => {
      const updateInArray = (array) => {
        const index = array.findIndex(post => post._id === action.payload._id)
        if (index !== -1) array[index] = action.payload
      }
      updateInArray(state.posts)
      updateInArray(state.userPosts)
      if (state.currentPost?._id === action.payload._id) {
        state.currentPost = action.payload
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload)
      state.userPosts = state.userPosts.filter(post => post._id !== action.payload)
      if (state.currentPost?._id === action.payload) {
        state.currentPost = null
      }
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearPosts: (state) => {
      state.posts = []
      state.pagination = initialState.pagination
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

// Selectors
export const selectPosts = (state) => state.posts.posts
export const selectCurrentPost = (state) => state.posts.currentPost
export const selectUserPosts = (state) => state.posts.userPosts
export const selectIsLoading = (state) => state.posts.isLoading
export const selectPagination = (state) => state.posts.pagination

export const selectFilteredPosts = createSelector(
  [selectPosts, (state) => state.posts.filters],
  (posts, filters) => {
    let filtered = posts
    
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(search) ||
        post.excerpt?.toLowerCase().includes(search)
      )
    }
    
    if (filters.category) {
      filtered = filtered.filter(post => 
        post.categories?.includes(filters.category)
      )
    }
    
    return filtered
  }
)

export const { 
  setLoading, 
  setPosts, 
  setUserPosts, 
  addPost, 
  updatePost, 
  removePost, 
  setCurrentPost, 
  setFilters, 
  clearPosts, 
  setError 
} = postsSlice.actions

export default postsSlice.reducer