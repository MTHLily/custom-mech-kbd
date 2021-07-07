import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'
import cookieparser from 'cookieparser'

export default {
  async nuxtServerInit({ commit, dispatch }, ctx) {
    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'

    /** Get the VERIFIED authUser on the server */

    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user

      // console.info(
      //   'Auth User verified on server-side. User: ',
      //   authUser,
      //   'Claims:',
      //   claims
      // )

      // if (authUser.idToken) {
      //   const decoded = jwtDecode(authUser.idToken)
      //   console.info('Decoded', decoded)
      //   commit('SET_USER', decoded)
      // }

      await dispatch('onAuthStateChanged', {
        authUser,
        claims,
      })
    }
  },

  async onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    commit('SET_AUTH_USER', { authUser })
  },

  checkVuexStore(ctx) {
    if (this.$fire.auth === null) {
      throw 'Vuex Store example not working - this.$fire.auth cannot be accessed.'
    }

    alert(
      'Success. Nuxt-fire Objects can be accessed in store actions via this.$fire___'
    )
  },
}
