import { putCustomer, createOrder } from 'lib/omie'
import { createCard } from 'lib/pipefy'
import cep from 'cep-promise'

const handle = async (req, res) => {
  const order = req.body
  const cepLocation = await cep(order.customer.default_address.zip.length > 8 ? order.customer.default_address.zip : '09930270')
  const addressArray = order.customer.default_address.address1.split(' ')

  console.log(`Creating customer ${order.customer.first_name} ${order.customer.last_name} on Omie`)

  const omieCustomer = await putCustomer({
    extId: order.customer.id.toString().substring(3, order.customer.id.length),
    name: `${order.customer.first_name} ${order.customer.last_name}`,
    email: order.customer.email,
    doc: order.customer.default_address.company,
    phone: order.customer.default_address.phone,
    zip: cepLocation.cep,
    state: cepLocation.state,
    city: cepLocation.city + ' (' + cepLocation.state + ')',
    address: addressArray.slice(0, -1).join(' '),
    number: addressArray[addressArray.length - 1].substring(0, 10),
    complement: order.customer.default_address.address2
  })
  console.log(omieCustomer)

  console.log(`Creating Order on Omie`)

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
    shippingValue: 30 // check it later
  })
  console.log(omieOrder)

  console.log(`Cliente e ordem de pedido cadastrados com sucesso. :)`)

  order.line_items.map(async item => {
    if (item.title === 'Reserva Vela 2') {
      consoelog.log(`Creating Shopify card for Vela 2 reservation.`)
      const card = await createCard({
        pipe_id: '1127491',
        fields_attributes: [
          { field_id: 'nome', field_value: `${order.customer.first_name} ${order.customer.last_name}` },
          { field_id: 'reserva', field_value: `${item.title}` },
          { field_id: 'telefone', field_value: `${order.customer.default_address.phone}` },
          { field_id: 'email', field_value: `${order.customer.email}` }
        ]
      })
      console.log(card)
    }
  })
  res.status(200).send('OK')
}

export default handle
