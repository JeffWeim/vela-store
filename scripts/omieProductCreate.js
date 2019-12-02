import { createClient } from '@particular./shopify-request'
import { firestore } from '../lib/firebase'
import { addProduct } from '../lib/omie'

const shopify = new createClient({ // eslint-disable-line
  store_name: 'vela-bikes-store',
  client_key: process.env.SHOPIFY_API_KEY,
  client_pass: process.env.SHOPIFY_API_PASS
})

const handle = async () => {
  const id = '' // quadro reto 4099129638967 - quadro baixo 3728611573815
  const quadroBaixo = await shopify.get(`/admin/products/${id}.json`).catch(console.error)
  const products = firestore.collection('products')

  quadroBaixo.product.variants.map(async prod => {
    const existingProduct = await products.where('id', '==', prod.id).limit(1).get()

    if (existingProduct.empty) {
      console.log(`Adding product ${prod.id}.`)

      return (
        products.doc().set({
          id: prod.id,
          inventory_quantity: prod.inventory_quantity,
          sku: prod.sku,
          title: prod.title
        }).catch(console.error)
      )
    } else {
      console.log(`Product ${prod.id} already exists, updating.`)

      return (
        existingProduct.docs[0].ref.update({
          id: prod.id,
          inventory_quantity: prod.inventory_quantity,
          sku: prod.sku,
          title: prod.title
        }).catch(console.error)
      )
    }
  })

  // products.listDocuments.map(prod => {
  //   addProduct({ ...prod })
  // })
}

handle()

export default handle
