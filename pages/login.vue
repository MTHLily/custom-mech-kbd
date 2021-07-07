<template>
  <el-main style="height: 100%; margin-top: 10%">
    <el-row justify="end" align="center">
      <el-col :span="8" :offset="8" :md="{ span: 4, offset: 10 }">
        <el-form @submit.prevent="submit">
          <el-form-item>
            <el-input
              v-model="form.email"
              placeholder="Email"
              suffix-icon="el-icon-user"
              required
              name="email"
              autofocus
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.password"
              placeholder="Password"
              suffix-icon="el-icon-lock"
              required
              name="password"
              type="password"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-row justify="center">
              <el-col :span="8" :offset="8">
                <el-button
                  type="primary"
                  :disabled="form.processing"
                  @click="signIn"
                  >Log in</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  layout: 'blank',
  computed: {
    ...mapState({
      authUser: (state) => state.authUser,
    }),
    ...mapGetters(['isLoggedIn']),
  },
  data: () => ({
    form: {
      email: '',
      password: '',
      processing: false,
    },
  }),
  methods: {
    signIn() {
      this.processing = true
      this.$fire.auth
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => {
          this.$router.push('/dashboard/')
        })
        .catch((error) => {
          this.$message({
            message: error.message,
            type: 'error',
          })
          this.processing = false
        })
    },
  },
  mounted() {},
}
</script>

<style></style>
