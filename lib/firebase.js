import * as firebase from 'firebase-admin'
import {Base64} from 'js-base64'

firebase.initializeApp({
  credential: firebase.credential.cert(Base64.decode(process.env.FIREBASE_KEY)),
  databaseURL: "https://vela-c1f68.firebaseio.com"
})

export const firestore = firebase.firestore()