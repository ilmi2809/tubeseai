
import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://user-service:3001/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
})

export default client
