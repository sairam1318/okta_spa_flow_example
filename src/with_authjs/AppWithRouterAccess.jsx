import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react'
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import Home from './Home'
import SignIn from './SignIn'
import Protected from './Protected'
import config from '../config'
const oktaAuth = new OktaAuth({
  issuer: config.oidc.issuer,
  clientId: config.oidc.clientId,
  scopes: config.oidc.scopes,
  redirectUri: config.oidc.redirect_uri
});
const AppWithRouterAccess = () => {
  const navigate = useNavigate()
  const onAuthRequired = () => {
    navigate('/login')
  }
  console.log(oktaAuth, 'okta auth', process.env);
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri, window.location.origin))
  }
  return (
    <Security oktaAuth={oktaAuth} onAuthRequired={onAuthRequired} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/login/callback" element={<LoginCallback />} />
      </Routes>
    </Security>
  )
}
export default AppWithRouterAccess
