import { createClient } from '@particular./shopify-request'
import { firestore } from '../lib/firebase'
import { addProduct } from '../lib/omie'

const shopify = new createClient({ // eslint-disable-line
  store_name: 'vela-bikes-store',
  client_key: process.env.SHOPIFY_API_KEY,
  client_pass: process.env.SHOPIFY_API_PASS
})

const handle = async () => {
  // get shopify products
  const quadroBaixo = await shopify.get('/admin/products/3728611573815.json').then(console.log).catch(console.error)

  // parse shopify to firebase
  const products = firestore.collection('products')
  quadroBaixo.variants.map(async prod => {
    await products.set({ prod })
  })

  // parse firebase to omie
  products.map(async prod => {
    await addProduct({ prod })
  })
}

handle()

export default handle
