import { putCustomer, createOrder } from 'lib/omie'
import cep from 'cep-promise'

const handle = async (req, res) => {
  const order = req.body
  const cepLocation = await cep(order.customer.zip.length > 8 ? order.customer.zip : '09930270')

  const omieCustomer = await putCustomer({
    extId: order.customer.shopifyId.toString().substring(3, order.customer.shopifyId.length),
    name: order.customer.name,
    email: order.customer.email,
    document: order.customer.document,
    phone: order.customer.phone,
    zip: cepLocation.cep,
    state: cepLocation.state,
    city: cepLocation.city + ' (' + cepLocation.state + ')',
    address: order.customer.address,
    number: order.customer.number,
    complement: order.customer.complement
  })

  const omieOrder = await createOrder({
    customerId: omieCustomer.id,
    orderId: order.id.toString().substring(3, order.id.length),
    forecast: '03/09/2019',
    information: {
      codigo_categoria: '1.01.03',
      codigo_conta_corrente: 1359770974,
      consumidor_final: 'S',
      enviar_email: 'N'
    },
    products: order.line_items.map(item => ({
      sku: item.sku,
      extId: item.id,
      quantity: item.quantity,
      price: item.price * (order.total_line_items_price - order.total_discounts) / order.total_line_items_price
    })),
    shippingValue: 30
  })

  console.log(omieCustomer)
  console.log(omieOrder)

  res.status(200).send('OK')
}

export default handle
