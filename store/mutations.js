export default {
  RESET_STORE: (state) => {
    Object.assign(state, {
      authUser: null,
    })
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
    }
  },
}
