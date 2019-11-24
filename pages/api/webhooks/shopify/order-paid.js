import { putCustomer as putOmieCustomer, createOrder as createOmieOrder } from 'lib/omie'
import { createCard } from 'lib/pipefy'
import { firestore } from 'lib/firebase'
import { normalizeOrder } from 'lib/shopify'

const putCustomer = async customerData => {
  const customers = firestore.collection('customers')
  const customerQuery = await customers.where('shopifyId', '==', customerData.shopifyId).limit(1).get()
  if (customerQuery.empty) {
    return await customers.add(customerData)
  } else {
    const update = await customerQuery.docs[0].ref.update(customerData)
    return customerQuery.docs[0].ref
  }
}

const putOrder = async orderData => {
  const orders = firestore.collection('orders')
  const orderQuery = await orders.where('shopifyId', '==', orderData.shopifyId).limit(1).get()
  if (orderQuery.empty) {
    return await orders.add(orderData)
  } else {
    const update = await orderQuery.docs[0].ref.update(orderData)
    return orderQuery.docs[0].ref
  }
}

const handle = async (req, res) => {
  if (req.headers['x-shopify-topic'] !== 'orders/paid') return res.status(401).send('Unauthorized')

  const orderData = await normalizeOrder(req.body)
  const { customer: customerData } = orderData

  const customer = await putCustomer(customerData)
  const order = await putOrder({
    ...orderData,
    customerRef: customer
  })

  console.log('Returning 200 OK to Shopify')
  res.send('OK')
  //console.log(`Creating customer ${order.customer.first_name} ${order.customer.last_name} on Omie`)

  const omieCustomer = await putOmieCustomer({
    ...customerData,
    id: customer.id
  })
  console.log(omieCustomer)

  // console.log(`Creating Order on Omie`)

  const omieOrder = await createOmieOrder({
    ...orderData,
    id: order.id,
    customerId: customer.id
  })

  //   customerId: omieCustomer.id,
  //   orderId: order.id.toString().substring(3, order.id.length),
  //   forecast: '03/09/2019',
  //   products: order.line_items.map(item => ({
  //     sku: item.sku,
  //     extId: item.id,
  //     quantity: item.quantity,
  //     price: item.price * (order.total_line_items_price - order.total_discounts) / order.total_line_items_price
  //   })),
  //   shippingValue: 30 // check it later
  // })
  // console.log(omieOrder)

  // console.log(`Cliente e ordem de pedido cadastrados com sucesso. :)`)

  // order.line_items.map(async item => {
  //   if (item.title === 'Reserva Vela 2') {
  //     console.log(`Creating Shopify card for Vela 2 reservation.`)
  //     const card = await createCard({
  //       pipe: '1127491',
  //       fields: {
  //         nome: `${order.customer.first_name} ${order.customer.last_name}`,
  //         reserva: item.title,
  //         telefone: order.customer.default_address.phone,
  //         email: order.customer.email
  //       }
  //     })
  //     console.log('card:' + card)
  //   }
  // })
}

export default handle
