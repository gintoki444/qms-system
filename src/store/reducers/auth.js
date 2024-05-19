import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  user_id: null,
  roles: null,
  user_permissions: {}
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.email = action.payload.email;
      state.user_id = action.payload.user_id;
      state.roles = action.payload.roles;
    },

    setPermission: (state, action) => {
      const { key, value } = action.payload;
      state.user_permissions[key] = value;
    }
  }
});

export default auth.reducer;

export const { setProfile, setPermission } = auth.actions;
