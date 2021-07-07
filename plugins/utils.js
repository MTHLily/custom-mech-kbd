export default (context, inject) => {
  /**
   * Uploads an image to the Firebase storage
   * @param file The uploaded file
   * @param path Path in the Firebase Storage
   * @returns Promise { doc: docRef, url: Firebase storage URL }
   */
  const uploadImageToFirebase = async (file, path) => {
    return new Promise((resolve, reject) => {
      const storageRef = context.$fire.storage.ref()
      const docRef = storageRef.child(path)

      if (/^image\//.test(file.type)) {
        docRef.put(file).on(
          'stage_change',
          (snapshot) => {},
          (error) => {
            //   context.$message({
            //     message: error.message,
            //     type: 'error',
            //   })
            return reject(error.message)
          },
          async () => {
            docRef.getDownloadURL().then((downloadURL) => {
              resolve({
                doc: docRef,
                url: downloadURL,
              })
            })
          }
        )
      }
    })
  }

  const newPost = async (postDetails) => {}

  inject('customUtils', {
    uploadImageToFirebase,
  })
}
