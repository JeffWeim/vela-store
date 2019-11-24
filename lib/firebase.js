import * as firebase from 'firebase-admin'
import {Base64} from 'js-base64'

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(Base64.decode(process.env.FIREBASE_KEY))),
    databaseURL: "https://vela-c1f68.firebaseio.com"
  })
}

export const firestore = firebase.firestore()