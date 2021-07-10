import moment from 'moment'

export default async (context, inject) => {
  const db = context.$fire.firestore
  const pagesCollection = db.collection('pages')
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

  const latestPages = await pagesCollection
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then((data) => {
      return data.docs.map((doc) => {
        return {
          slug: doc.id,
          title: doc.data().pageTitle,
        }
      })
    })

  const newPageToFirebase = (pageDetails) => {
    return new Promise((resolve, reject) => {
      const { pageTitle, pageCoverImageUrl, pageContent } = pageDetails
      const newPage = {
        pageTitle,
        pageCoverImageUrl,
        pageContent,
        createdAt: moment().format(),
      }

      const docRef = pagesCollection.doc(pageDetails.slug)

      docRef
        .get()
        .then((snapshot) => {
          if (!snapshot.exists) {
            docRef
              .set(newPage)
              .then(() => resolve('The page has been created!'))
          } else reject('A page with the same slug already exists.')
        })
        .catch((err) => {
          reject(err.message)
        })
    })
  }

  const getPagesFromFirebase = () => {
    return new Promise((resolve, reject) => {
      pagesCollection
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          resolve(
            snapshot.docs.map((doc) => ({
              slug: doc.id,
              ...doc.data(),
            }))
          )
        })
        .catch((err) => reject(err))
    })
  }

  const getPageFromFirebase = (slug) => {
    return new Promise((resolve, reject) => {
      const docRef = pagesCollection.doc(slug)

      docRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            resolve(snapshot.data())
          } else reject('This page does not exist.')
        })
        .catch((err) => reject(err))
    })
  }

  const deletePageFromFirebase = (slug) => {
    return new Promise((resolve, reject) => {
      const docRef = pagesCollection.doc(slug)

      docRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            pagesCollection
              .doc(slug)
              .delete()
              .then(() => resolve('The page has been deleted!'))
          } else reject('This page does not exist anymore.')
        })
        .catch((err) => {
          reject(err.message)
        })
    })
  }

  function updatePageInFirebase(slug, pageData) {
    return new Promise((resolve, reject) => {
      pagesCollection
        .doc(slug)
        .get()
        .then((docRef) => {
          const { pageTitle, pageContent, pageCoverImageUrl } = pageData
          docRef.ref
            .update({
              pageTitle,
              pageContent,
              pageCoverImageUrl,
            })
            .then(resolve('Update success!'))
        })
        .catch((err) => reject(err))
    })
  }

  function sliceIntoChunks(arr, chunkSize) {
    const res = []
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize)
      res.push(chunk)
    }
    return res
  }

  inject('utils', {
    uploadImageToFirebase,
    newPageToFirebase,
    getPagesFromFirebase,
    getPageFromFirebase,
    deletePageFromFirebase,
    sliceIntoChunks,
    latestPages,
    updatePageInFirebase,
  })
}
