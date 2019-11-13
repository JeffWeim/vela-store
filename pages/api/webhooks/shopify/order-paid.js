import { putCustomer, createOrder } from 'lib/omie'
import { createCard } from 'lib/pipefy'

const getOrderCustomer = ({ customer }) => {
  const addressArray = customer.default_address.address1.split(' ')

  return ({
    name: `${customer.first_name} ${customer.last_name}`,
    email: customer.email,
    phone: customer.default_address.phone,
    shopifyId: customer.id,
    document: customer.default_address.company,
    zip: customer.default_address.zip,
    UF: customer.default_address.province_code,
    city: customer.default_address.city,
    address: addressArray.slice(0, -1).join(' '),
    number: addressArray[addressArray.length - 1],
    complement: customer.default_address.address2
  })
}

const getOrderData = ({ id, order_status_url, total_discounts, total_line_items_price }) => {
  return ({
    shopifyId: id,
    shopifyURL: order_status_url,
    totalPrice: total_line_items_price,
    discountPrice: total_discounts,
    discountRatio: (total_line_items_price - total_discounts) / total_line_items_price
  })
}

const getOrderBikes = ({ line_items }) => {
  const isBike = ({ sku }) => sku.startsWith('VEL-V1') || sku.startsWith('VEL-V2')

  return line_items.filter(isBike)
}

const handle = async (req, res) => {
  console.log('oi')
  return res.end()

  const orderCustomer = getOrderCustomer(orderExample)
  const orderData = getOrderData(orderExample)
  const orderBikes = getOrderBikes(orderExample)

  console.log(orderData)

  const omieCustomer = await putCustomer({
    extId: orderCustomer.shopifyId,
    name: orderCustomer.name,
    email: orderCustomer.email,
    document: orderCustomer.document,
    phone: orderCustomer.phone,
    zip: orderCustomer.zip,
    UF: orderCustomer.province_code,
    city: orderCustomer.city,
    address: orderCustomer.address,
    number: orderCustomer.number,
    complement: orderCustomer.complement
  })

  console.log(omieCustomer)

  const omieOrder = await createOrder({
    customerId: orderCustomer.shopifyId,
    orderId: orderData.shopifyId,
    forecast: '03/09/2019',
    information: {
      codigo_categoria: '1.01.03',
      codigo_conta_corrente: 1359770974,
      consumidor_final: 'S',
      enviar_email: 'N'
    },
    products: orderExample.line_items.map(item => ({
      sku: item.sku,
      extId: item.id,
      quantity: item.quantity,
      price: item.price * orderData.discountRatio
    })),
    shippingValue: 30
  })
  console.log(omieOrder)

  const cardCreatePromises = orderBikes.map(async (orderBikes) => {
    const card = await createCard({
      pipe: '1078887',
      fields: [
        { field_id: 'bicicleta', field_value: `${orderBikes.sku}` },
        { field_id: 'detalhes', field_value: `Bike: ${orderBikes.variant_title}` },
        { field_id: 'contato', field_value: `Nome: ${orderCustomer.name}\nEmail: ${orderCustomer.email}\nTelefone: ${orderCustomer.phone}\nCPF: ${orderCustomer.document}` }
      ]
    })
    console.log(card)
    res.end('OK')
  })

  return Promise.all(cardCreatePromises)
}

export default handle
