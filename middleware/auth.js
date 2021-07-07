export default ({ app, store, redirect, route }) => {
  // console.info('Check auth: ', app.$fire.auth)
  // console.info('Query: ', route)
  if (app.$fire.auth) {
    if (!store.state.authUser) redirect('/login')
    else if (route.path == '/login') redirect('/dashboard')
    else;
  }
}
