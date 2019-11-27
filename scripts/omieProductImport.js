import { listProducts } from '../lib/omie'
// import { firestore } from '../lib/firebase'

// const processCustomer = async customerData => {
//   const customers = firestore.collection('customers')
//   const existingCustomers = await customers.where('omieId', '==', customerData.omieId).limit(1).get()

//   if (existingCustomers.empty) {
//     console.log(`Adding Customer ${customerData.omieId}.`)

//     return customers.add(customerData)
//   } else {
//     console.log(`Customer ${customerData.omieId} already exists, updating.`)

//     return existingCustomers.docs[0].ref.update(customerData)
//   }
// }

// const processCustomerList = async list =>
//   Promise.all(
//     list
//       .filter(c => c.address.zip)
//       .map(processCustomer)
//   )

// const main = async () => {
//   console.log('Starting Omie Customer import...')
//   const { customers, pages, page } = await listCustomers({})
//   console.log('Pages:', pages)
//   console.log('Page:', page)
//   await processCustomerList(customers)

//   for (let page = 2; page <= pages; page++) {
//     console.log('Page:', page)
//     const { customers } = await listCustomers({ page })
//     await processCustomerList(customers)
//   }

//   console.log('Finished importing.')
// }

// main()
