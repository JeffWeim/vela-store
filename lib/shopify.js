import withApollo from 'next-with-apollo'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import cep from 'cep-promise'

export default withApollo(({ ctx, headers, initialState }) => (
  new ApolloClient({
    uri: 'https://checkout.velabikes.com.br/api/graphql',
    cache: new InMemoryCache().restore(initialState || {}),
    headers: {
      'X-Shopify-Storefront-Access-Token': '952655b7618da7c0ea8472837ccc5076'
    }
  })
))

export const normalizeAddress = async address => {
  const fetchAddress = async address => {
    const {country, zip} = address
    if (country !== 'Brazil') return address
    try {
      const fetched = await cep(zip)
      return fetched
    } catch (e) {
      return address
    }
  }
  const {city, country, zip, address1, address2, province_code} = fetchAddress(address)

  return {
    address: address1,
    complement: address2,
    state: province_code,
    city: country === 'Brazil' ? await cep(): city,
    country,
    zip
  }
}

export const normalizeCustomer = async customer => {
  const {id, email, phone, first_name, last_name, default_address} = customer

  return {
    shopifyData: customer,
    shopifyId: id,
    firstName: first_name,
    lastName: last_name,
    address: await normalizeAddress(default_address),
    documentId: default_address.company,
    phone,
    email
  }
}

export const normalizeOrderItem = ({sku, quantity, price}) => ({
  sku,
  quantity,
  price
})

export const normalizeOrder = async ({customer, ...order}) => {
  const {id, currency, total_price, line_items, shipping_lines, total_tax} = order

  return {
    from: 'shopify',
    shopifyData: order,
    shopifyId: id,
    customer: await normalizeCustomer(customer),
    totalPrice: total_price,
    items: line_items.map(normalizeOrderItem),
    currency,
    shippingPrice: shipping_lines.length ? shipping_lines[0].price : 0,
    tax: total_tax
  }
}