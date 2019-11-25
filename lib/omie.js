import fetch from 'isomorphic-fetch'

const apiURL = 'https://app.omie.com.br/api/v1'

const auth = {
  app_key: process.env.OMIE_KEY,
  app_secret: process.env.OMIE_SECRET
}

const headers = {
  'Content-Type': 'application/json'
}

//
// Creates a customer
//

export const putCustomer = async ({
  id,
  firstName,
  lastName,
  email,
  documentId,
  phone,
  address: {
    address,
    complement,
    city,
    state,
    country,
    zip
  }
}) => {
  const createCustomerURL = apiURL + '/geral/clientes/'
  const createCustomerBody = {
    ...auth,
    call: 'UpsertCliente',
    param: [{
      'codigo_cliente_integracao': id,
      'email': email,
      'razao_social': `${firstName} ${lastName}`,
      'cnpj_cpf': documentId,
      'telefone1_ddd': phone && phone.split('').filter(Number).join('').substring(0, 2),
      'telefone1_numero': phone && phone.split('').filter(Number).join('').substring(2, phone.length),
      'endereco': address,
      'endereco_numero': 0,
      'complemento': complement,
      'exterior': country === 'Brazil' ? 'N' : 'S',
      'estado': country === 'Brazil' ? state : 'SP',
      'cidade': country === 'Brazil' ? `${city} (${state})` : 'São Paulo (SP)',
      'cep': country === 'Brazil' ? zip : '09930270'
    }]
  }
  const createCustomerOptions = {
    method: 'POST',
    body: JSON.stringify(createCustomerBody),
    headers: headers
  }
  const response = await fetch(createCustomerURL, createCustomerOptions)
  const { faultstring, ...customer } = await response.json()
  if (faultstring) throw new Error(faultstring)

  return normalizeCustomer(customer)
}

export const findCustomer = async ({ doc }) => {
  const endpointURL = apiURL + '/geral/clientes/'
  const body = {
    ...auth,
    call: 'ListarClientes',
    param: [{
      'pagina': 1,
      'registros_por_pagina': 50,
      'apenas_importado_api': 'N',
      'clientesFiltro': {
        'cnpj_cpf': doc
      }
    }]
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers
  }
  const response = await fetch(endpointURL, options)
  const { total_de_registros, clientes_cadastro, faultstring } = await response.json()
  if (total_de_registros !== 1 || faultstring) return false

  return normalizeCustomer(clientes_cadastro[0])
}

//
// Get product
//

const getProduct = async ({ sku, id, extId }) => {
  const getProductURL = apiURL + '/geral/produtos/'
  const getProductBody = {
    ...auth,
    call: 'ConsultarProduto',
    param: [{
      codigo_produto: id,
      codigo_produto_integracao: extId,
      codigo: sku
    }]
  }
  const getProductOptions = {
    method: 'POST',
    body: JSON.stringify(getProductBody),
    headers: headers
  }
  const response = await fetch(getProductURL, getProductOptions)
  const json = await response.json()

  return json
}

//
// Create a order
//

export const createOrder = async ({
  customerId,
  id,
  items,
  shippingPrice,
  totalPrice
}) => {
  const createOrderURL = apiURL + '/produtos/pedido/'
  const createOrderBody = {
    ...auth,
    call: 'IncluirPedido',
    param: [{
      cabecalho: {
        data_previsao: '03/09/2019',
        codigo_cliente_integracao: customerId,
        codigo_pedido_integracao: id
      },
      informacoes_adicionais: {
        codigo_categoria: '1.01.03',
        codigo_conta_corrente: 1359770974,
        consumidor_final: 'S',
        enviar_email: 'N'
      },
      det: await Promise.all(items.map(async ({ sku, price, quantity, id }) => {
        const { codigo_produto, codigo_produto_integracao } = await getProduct({ sku })

        return ({
          ide: {
            codigo_item_integracao: id
          },
          produto: {
            codigo_produto: codigo_produto,
            quantidade: quantity,
            valor_unitario: price
          }
        })
      })),
      total_pedido: {
        valor_total_pedido: totalPrice
      },
      frete: {
        valor_frete: shippingPrice
      }
    }]
  }

  const createOrderOptions = {
    method: 'POST',
    body: JSON.stringify(createOrderBody),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(createOrderURL, createOrderOptions)
  const json = await response.json()

  return json
}

//
// Creates a service order
//

export const createServiceOrder = async ({
  customerId,
  extId,
  description
}) => {
  const endpointURL = apiURL + '/servicos/os/'
  const body = {
    ...auth,
    call: 'IncluirOS',
    param: [{
      'Cabecalho': {
        'cCodIntOS': extId,
        'cEtapa': '20',
        'nCodCli': customerId,
        'nQtdeParc': 1
      },
      'InformacoesAdicionais': {
        'cCodCateg': '1.01.02',
        'nCodCC': 1359770974
      },
      'ServicosPrestados': [{
        'cCodServLC116': '14.01',
        'cCodServMun': '01015',
        'cRetemISS': 'N',
        'cTribServ': '1',
        'nQtde': 1,
        'nValUnit': 1
      }],
      'Observacoes': {
        'cObsOS': description
      }
    }]
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers
  }
  const response = await fetch(endpointURL, options)
  const { faultstring, ...serviceOrder } = await response.json()
  if (faultstring) throw new Error(faultstring)

  return normalizeServiceOrder(serviceOrder)
}

//
// Normalizes a Customer
// Transforms unnaceptable field names into well thought ones
//

const normalizeCustomer = ({
  codigo_cliente_omie,
  ...customer
}) => ({
  id: codigo_cliente_omie,
  ...customer
})

const normalizeServiceOrder = ({
  nCodOS,
  cNumOS
}) => ({
  id: nCodOS,
  number: cNumOS
})
