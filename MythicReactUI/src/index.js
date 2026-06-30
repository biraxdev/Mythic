import React from 'react';
import {createRoot} from 'react-dom/client';
import { App } from './components/App';
import {BrowserRouter as Router} from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache, from, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import {successfulRefresh, FailedRefresh, successfulLogin} from './cache';
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context';
import {snackActions} from './components/utilities/Snackbar';
import {jwtDecode} from 'jwt-decode';
import {meState} from './cache';
import {getSkewedNow} from "./components/utilities/Time";

export const mythicUIVersion = "0.3.112";

let fetchingNewToken = false;

let cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                operationeventlog: {
                    
                },
                callback: {
                  
                }
            }
        }
    }
});

let retryLink = new RetryLink({
  delay: {
    initial: 2,
    max: 10
  },
  attempts: {
    max: 2,
    retryIf: (error, _operation) => !!error
  }
});
let httpLink = new HttpLink({
    uri: window.location.origin + "/graphql/",
    options: {
        reconnect: true,   
        connectionParams: {
          headers: {
              Authorization: () => `Bearer ${localStorage.getItem('access_token')}`,
              MythicSource: "web"
          }
       }     
    }
});
export const isJWTValid = () => {
  let access_token = localStorage.getItem("access_token");
  if(!access_token){
      let cookie = document.cookie;
      if(cookie && cookie !== ""){
          let cookies = cookie.split(";");
          for(let i = 0; i < cookies.length; i++){
              let cookiePieces = cookies[i].split("=");
              if(cookiePieces.length !== 2){
                  // invalid cookie format, skip
              } else if(cookiePieces[0].trim() !== "user") {
                  // not the user cookie, skip
              } else {
                  try{
                      let cookieString = decodeURIComponent(cookiePieces[1].trim());
                      let cookieJSON = JSON.parse(atob(cookieString));
                      if("access_token" in cookieJSON){
                          successfulLogin(cookieJSON);
                          restartWebsockets();
                          access_token = localStorage.getItem("access_token");
                      }else{
                          snackActions.warning("Invalid Authentication");
                      }
                  }catch(error){
                      // failed to process cookie
                  }
              }
          }
      }
  }
  if(access_token){
    const decoded_token = jwtDecode(access_token);
    if(getSkewedNow().getTime() > decoded_token.exp * 1000){
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }
}
export const JWTTimeLeft = () => {
  let access_token = localStorage.getItem("access_token");
  if(access_token){
    const decoded_token = jwtDecode(access_token);
    return (decoded_token.exp * 1000) - getSkewedNow();
  }else{
    return 0;
  }
}
const authLink = setContext( async (_, {headers}) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  while(fetchingNewToken){
    // we need to wait until we're no longer fetching a token
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
    let access_token = localStorage.getItem('access_token');
    if(access_token){
      const decoded_token = jwtDecode(access_token);
      // JWT lifetime is 4 hours. If there's 2hrs or less left of the JWT, update it
      let diff = (decoded_token.exp * 1000) - getSkewedNow();
      let twoHours = 30 * 60000; // 30min in milliseconds
      // we want to make sure we try to get a new access_token while the current one is still active or it'll fail
      if(!isJWTValid()){
          const updated = await GetNewToken();
          if(updated){
              return{
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                      MythicSource: "web"
                  }
              }
          } else {
              FailedRefresh();
          }
      } else if(diff < twoHours && diff > 0){
          const updated = await GetNewToken();
          if(updated){
              return{
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                      MythicSource: "web"
                  }
              }
          }
      }
    }else{
      FailedRefresh();
    }
    return {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          MythicSource: "web"
      }
    }
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  try{
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          case 'forbidden':
              snackActions.error("You don't have permission to perform this action. Contact your admin.");
              break;
          case 'access-denied':
              snackActions.error("Access denied. Please check your permissions or log in again.");
              break;
            //fallsthrough
          case 'start-failed':
            // when AuthenticationError thrown in resolver
            // modify the operation context with a new token
            /*
            return promiseToObservable(
              GetNewToken())
              .flatMap(() => {
              // retry the request, returning the new observable
              operation.setContext({
                headers: {
                 Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
              });
              // retry the request, returning the new observable
              });
              */
          case 'validation-failed':
            return;
          default:
              snackActions.error(err.message);
        }
      }
    }
    if (networkError) {
      
      if(networkError.extensions === undefined){
        meState({...meState(), badConnection: true});
        //FailedRefresh();
        //window.location = "/new/login";
        return;
      }
      switch (networkError.extensions.code) {
          case 'access-denied':
            snackActions.warning("Access denied. Your session may have expired. Please log in again.");
            break;
          case 'start-failed':
            // when AuthenticationError thrown in resolver
              FailedRefresh();
              window.location = "/new/login";
              break;
          default:
        }
        
    }
  }catch(error){
    snackActions.error("Connection lost. Reconnecting...");
    restartWebsockets();
    window.location = "/new/login";
    return;
  }
});

export const GetNewToken = async () =>{
  fetchingNewToken = true;
  const requestOptions = {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          MythicSource: "web"
      },
      body: JSON.stringify({"refresh_token": localStorage.getItem("refresh_token"),
        "access_token": localStorage.getItem("access_token")})
  };
  try{
      const response = await fetch('/refresh', requestOptions);
      if (response.ok) {
          return response.json().then(data => {
              if("access_token" in data){
                  successfulRefresh(data);
                  fetchingNewToken = false;
                  return true;
              }else{
                  FailedRefresh();
                  fetchingNewToken = false;
                  return false;
              }
          }).catch(error => {
              FailedRefresh();
              fetchingNewToken = false;
              return false;
          });
      } else if(response.status === 403) {
          FailedRefresh();
          fetchingNewToken = false;
          return false;
      } else {
          return true
      }
  }catch(error){
      FailedRefresh();
      fetchingNewToken = false;
      return false;
  }


}
const websocketAddress = () =>{
    return window.location.protocol === "https:" ? "wss://" + window.location.host + "/graphql/" : "ws://" + window.location.host + "/graphql/";
}
const wsClient = createClient({
    url: websocketAddress(),
    reconnectionAttempts: 3,
    on: {
      error: (err) => {
          meState({...meState(), badConnection: true});
      },
      connected: (socket) => {
          meState({...meState(), badConnection: false});
      }
    },
    connectionParams: () => {
        return {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                MythicSource: "web"
            }
        }
    }});
const wsLink = new GraphQLWsLink(wsClient);
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)
export const apolloClient = new ApolloClient({
   link: from([authLink, errorLink, retryLink, authLink.concat(splitLink)]),
    cache
  });
export function restartWebsockets () {
    wsClient.dispose();
}
  // if the user refreshes the page, we lose all react tracking, so try to reload from localstorage first
if(localStorage.getItem("access_token") !== null){
  if(isJWTValid(localStorage.getItem("access_token"))){
      if(localStorage.getItem("user") !== null){
          try {
              let userData = JSON.parse(localStorage.getItem("user"));
              if(userData.user_id !== undefined && userData.user_id > 0){
                  meState({
                      loggedIn: true,
                      access_token: localStorage.getItem("access_token"),
                      refresh_token: localStorage.getItem("refresh_token"),
                      user: {...userData}
                  })
              } else {
                  FailedRefresh();
              }
          }catch(error){
              FailedRefresh();
          }
      } else {
          FailedRefresh();
      }
  }else{
      FailedRefresh();
  }
}
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
        <ApolloProvider client={apolloClient}>
            <Router>
                <App key="App"/>
            </Router>
        </ApolloProvider>
);
