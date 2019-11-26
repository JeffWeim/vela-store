import { listCustomers } from '../lib/omie'
import { putCustomer } from '../lib/firebase'

let processedCount = 0

const processCustomer = async customer => {
  console.log(customer)
  console.log(processedCount++)
  await putCustomer(customer)
}

const processCustomerList = async list =>
  Promise.all(
    list
      .filter(c => c.address.zip)
      .map(processCustomer)
  )

const main = async () => {
  console.log('Starting Omie import')
  const { customers, pages } = await listCustomers({})
  console.log('Pages:', pages)
  await processCustomerList(customers)
return
  for (let page = 2; page <= pages; page++) {
    const { customers } = await listCustomers({ page })
    await processCustomerList(customers)
  }
}

main()
