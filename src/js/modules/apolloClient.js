import { ApolloClient, InMemoryCache } from "apollo-client-preset";
import { ApolloLink, concat } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from "apollo-link-http"
import { STUY_SPEC_API_URL } from "../constants";
import store from "../store";
import { signOut, updateUserTokens } from "./accounts/actions";

const httpLink = new HttpLink({ uri: `${STUY_SPEC_API_URL}/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const session = store.getState().accounts.session;
  console.log("Sessions: (from apolloClient)");
  console.dir(session);
  if (session) {
  operation.setContext({
    headers: {
      'access-token': /*localStorage.getItem('token')*/ session['access-token'] || null,
      client: session.client /*localStorage.getItem('client')*/ || null,
      uid: session.uid /*localStorage.getItem('uid')*/ || null,
      expiry: session.expiry /*localStorage.getItem('expiry')*/ || null,
    }
  });
  }

  return forward(operation);
})

const addToken = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    console.dir(operation.getContext());
    const { response: { headers = null } } = operation.getContext();
    store.dispatch(updateUserTokens(headers));
    return response;
  })
})

const removeToken = new onError((networkError) => {
    if(networkError.statusCode === 401) {
        store.dispatch(signOut());
    }
});

//adapted from https://www.apollographql.com/docs/react/features/error-handling.html
const logErrors = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
  
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

const client = new ApolloClient({
  link: ApolloLink.from([authMiddleware, addToken, removeToken, logErrors, httpLink]),
  cache: new InMemoryCache()
});

export default client;
