import { putCustomer, createOrder } from 'lib/omie'
import cep from 'cep-promise'

const handle = async (req, res) => {
  const order = req.body
  const cepLocation = await cep(order.customer.default_address.zip.length > 8 ? order.customer.default_address.zip : '09930270')
  const addressArray = order.customer.default_address.address1.split(' ')

  console.log(`

  Criando cliente omie:

  Id Shopify: ${order.customer.id.toString().substring(3, order.customer.id.length)}
  Nome: ${order.customer.first_name} ${order.customer.last_name}
  Email: ${order.customer.email}
  Telefone: ${order.customer.default_address.phone}

  `)

  const omieCustomer = await putCustomer({
    extId: order.customer.id.toString().substring(3, order.customer.id.length),
    name: `${order.customer.first_name} ${order.customer.last_name}`,
    email: order.customer.email,
    document: order.customer.default_address.company,
    phone: order.customer.default_address.phone,
    zip: cepLocation.cep,
    state: cepLocation.state,
    city: cepLocation.city + ' (' + cepLocation.state + ')',
    address: addressArray.slice(0, -1).join(' '),
    number: addressArray[addressArray.length - 1],
    complement: order.customer.default_address.address2
  })

  console.log(`

  Criando ordem de pedido:

  Id do cliente: ${omieCustomer.id}
  Id do pedido: ${order.id.toString().substring(3, order.id.length)}

  `)

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

  console.log(`
  
  Cliente e ordem de pedido cadastrados com sucesso. :)

  `)

  res.status(200).send('OK')
}

export default handle
