import { createSlice } from '@reduxjs/toolkit'

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: {
    items: [],
    loaded: false,
  },
  reducers: {
    setConnections: (state, action) => {
      state.items = action.payload
      state.loaded = true
    },
    invalidateConnections: (state) => {
      state.loaded = false
    },
  },
})

export const { setConnections, invalidateConnections } = connectionsSlice.actions
export default connectionsSlice.reducer
