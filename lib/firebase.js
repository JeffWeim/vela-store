import * as firebase from 'firebase-admin'
import {Base64} from 'js-base64'

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(Base64.decode(process.env.FIREBASE_KEY))),
    databaseURL: "https://vela-c1f68.firebaseio.com"
  })
}

export const firestore = firebase.firestore()

export const putCustomer = async customerData => {
  const customers = firestore.collection('customers')
  const customerQuery = await customers.where('shopifyId', '==', customerData.shopifyId).limit(1).get()
  if (customerQuery.empty) {
    return await customers.add(customerData)
  } else {
    const update = await customerQuery.docs[0].ref.update(customerData)
    return customerQuery.docs[0].ref
  }
}

export const putOrder = async orderData => {
  const orders = firestore.collection('orders')
  const orderQuery = await orders.where('shopifyId', '==', orderData.shopifyId).limit(1).get()
  if (orderQuery.empty) {
    return await orders.add(orderData)
  } else {
    const update = await orderQuery.docs[0].ref.update(orderData)
    return orderQuery.docs[0].ref
  }
}