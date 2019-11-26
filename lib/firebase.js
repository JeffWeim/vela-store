import * as firebase from 'firebase-admin'
import { Base64 } from 'js-base64'

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(JSON.parse(Base64.decode(process.env.FIREBASE_KEY))),
    databaseURL: 'https://vela-c1f68.firebaseio.com'
  })
}

export const firestore = firebase.firestore()

export const addCustomer = async customerData => {
  const customers = firestore.collection('customers')

  return customers.add(customerData)
}

export const putCustomer = async customerData => {
  const customers = firestore.collection('customers')
  const shopifyIdQuery = customers.where('shopifyId', '==', customerData.shopifyId).limit(1).get()
  const omieIdQuery = customers.where('omieId', '==', customerData.omieId).limit(1).get()
  await Promise.all([shopifyIdQuery, omieIdQuery])
  const { empty: existsWithShopifyId, docs: [customerWithShopifyId] } = shopifyIdQuery
  const { empty: existsWithOmieId, docs: [customerWithOmieId] } = omieIdQuery

  if (!existsWithShopifyId && !existsWithOmieId) {
    return customers.add(customerData)
  } else {
    console.log('!algum existe')
    const customer = customerWithShopifyId || customerWithOmieId
    await customer.ref.update(customerData)

    return customer.ref
  }
}

export const putOrder = async orderData => {
  const orders = firestore.collection('orders')
  const orderQuery = await orders.where('shopifyId', '==', orderData.shopifyId).limit(1).get()

  if (orderQuery.empty) {
    return orders.add(orderData)
  } else {
    await orderQuery.docs[0].ref.update(orderData)

    return orderQuery.docs[0].ref
  }
}
