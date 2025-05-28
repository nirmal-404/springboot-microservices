import {TAuthConfig } from 'react-oauth2-code-pkce'


const authConfig ={
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://localhost:8070/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8070/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173',
  scope: 'openid profile email offline_access',
  autoLogin: false,
  onRefreshTokenExpire: (event) => event.logIn(),
}

export default authConfig;;