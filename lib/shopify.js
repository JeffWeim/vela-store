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
    const { country, zip } = address
    if (country !== 'Brazil') return address

    try {
      const { city, state } = await cep(zip)

      return { ...address, city, state }
    } catch (e) {
      return address
    }
  }

  const { city, country, zip, address1, address2, province_code } = await fetchAddress(address)

  return {
    address: address1,
    complement: address2,
    state: province_code,
    city: city,
    country,
    zip
  }
}

export const normalizeCustomer = async customer => {
  const { id, email, phone, first_name, last_name, default_address } = customer

  return {
    shopifyId: id,
    firstName: first_name,
    lastName: last_name,
    address: await normalizeAddress(default_address),
    documentId: default_address.company,
    phone,
    email
  }
}

export const normalizeOrderItem = ({ sku, quantity, price, id }) => ({
  shopifyId: id,
  sku,
  quantity: parseInt(quantity),
  price: parseFloat(price)
})

export const normalizeOrder = async ({ customer, ...order }) => {
  const { id, currency, total_price, line_items, shipping_lines, total_tax, total_discounts, created_at } = order

  return {
    from: 'shopify',
    shopifyId: id,
    customer: await normalizeCustomer(customer),
    totalPrice: parseFloat(total_price),
    items: line_items.map(normalizeOrderItem),
    currency,
    shippingPrice: shipping_lines.length ? parseFloat(shipping_lines[0].price) : 0,
    tax: parseFloat(total_tax),
    discounts: parseFloat(total_discounts),
    createdAt: new Date(created_at)
  }
}
