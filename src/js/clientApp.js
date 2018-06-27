import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { RoutingApp } from "./modules";
import { AppContainer } from "react-hot-loader";
import injectTapEventPlugin from "react-tap-event-plugin";
import store from "./store";
import Provider from "react-redux/lib/components/Provider";
import { STUY_SPEC_API_URL } from "./constants";
import client from "./modules/apolloClient"

import { ApolloProvider } from "react-apollo";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// for onClick events with MUI/React
try {
  injectTapEventPlugin();
} catch (err) {
  // hot reloading, no issue
}

import { VERSION } from "./versionInfo";
console.log("appVersion ->", VERSION);

import { objectFilter } from "./utils";
Object.filter = objectFilter;

ReactDOM.render(
  <AppContainer>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <RoutingApp />
      </Provider>
    </ApolloProvider>
  </AppContainer>,
  document.getElementById("app"),
);
