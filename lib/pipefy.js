import { GraphQLClient } from 'graphql-request'

const pipefyURL = 'https://api.pipefy.com/graphql'
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.PIPEFY_KEY}`
}

export const createCard = async ({ pipe, fields, ...options }) => {
  const graphQLClient = new GraphQLClient(pipefyURL, {
    headers: defaultHeaders
  })
  const query = `mutation($input: CreateCardInput!) {
    createCard(input: $input) {
      card {
        id
      }
    }
  }`
  const variables = {
    input: {
      pipe_id: pipe,
      fields_attributes: Object.keys(fields).map(id => ({field_id: id, field_value: fields[id]})),
      ...options
    }
  }
  const card = await graphQLClient.request(query, variables)

  return card
}
