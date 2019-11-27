import { putCustomer as putOmieCustomer, createOrder as createOmieOrder } from 'lib/omie'
import { createCard } from 'lib/pipefy'
import { firestore } from 'lib/firebase'
import { normalizeOrder } from 'lib/shopify'

export const putCustomer = async customerData => {
  const customers = firestore.collection('customers')
  const customerQuery = await customers.where('shopifyId', '==', customerData.shopifyId).limit(1).get()

  if (customerQuery.empty) {
    return customers.add(customerData)
  } else {
    await customerQuery.docs[0].ref.update(customerData)

    return customerQuery.docs[0].ref
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

const handle = async (req, res) => {
  if (req.headers['x-shopify-topic'] !== 'orders/paid') return res.status(401).send('Unauthorized')

  console.log(`Processing shopify paid order #${req.body.order_number}.`)

  const orderData = await normalizeOrder(req.body)
  const { customer: customerData } = orderData
  const customer = await putCustomer(customerData)
  const order = await putOrder({
    ...orderData,
    customerRef: customer
  })

  res.send('OK')
  console.log('posok')
  const omieCustomerData = await putOmieCustomer({
    ...customerData,
    id: customer.id
  })
  console.log(omieCustomerData)
  customer.update(omieCustomerData)

  const omieOrder = await createOmieOrder({
    ...orderData,
    id: order.id,
    customerId: customer.id
  })
  order.update(omieOrder)

  orderData.line_items.map(async item => {
    if (item.title === 'Reserva Vela 2') {
      console.log(`Creating pipefy card for Vela 2 reservation.`)
      const card = await createCard({
        pipe: '1127491',
        fields: {
          nome: `${order.customer.first_name} ${order.customer.last_name}`,
          reserva: item.title,
          telefone: order.customer.default_address.phone,
          email: order.customer.email
        }
      })
      console.log('card: ' + card)
    }
  })
}

export default handle
