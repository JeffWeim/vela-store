import { putCustomer as putOmieCustomer, createOrder as createOmieOrder } from 'lib/omie'
import { createCard } from 'lib/pipefy'
import { putCustomer, putOrder } from 'lib/firebase'
import { normalizeOrder } from 'lib/shopify'

const handle = async (req, res) => {
  if (req.headers['x-shopify-topic'] !== 'orders/paid') return res.status(401).send('Unauthorized')

  const orderData = await normalizeOrder(req.body)
  const { customer: customerData } = orderData

  const customer = await putCustomer(customerData)
  const order = await putOrder({
    ...orderData,
    customerRef: customer
  })

  res.send('OK')

  const omieCustomerData = await putOmieCustomer({
    ...customerData,
    id: customer.id
  })
  customer.update({ omieId: omieCustomerData.omieId })

  const omieOrder = await createOmieOrder({
    ...orderData,
    id: order.id,
    customerId: customer.id
  })
  order.update({ omieId: omieOrder.omieId })

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
