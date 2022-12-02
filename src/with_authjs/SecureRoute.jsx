import * as React from 'react'

import * as ReactRouterDom from 'react-router-dom'
import { toRelativeUrl, AuthSdkError } from '@okta/okta-auth-js'
import { useOktaAuth } from '@okta/okta-react'

const SecureRoute = (onAuthRequired, errorComponent, path, component) => {
  const { oktaAuth, authState, _onAuthRequired } = useOktaAuth()
  const match = ReactRouterDom.useMatch(routeProps)
  const pendingLogin = React.useRef(false)
  const [handleLoginError, setHandleLoginError] =
    (React.useState < Error) | (null > null)
  const ErrorReporter = errorComponent || OktaError
  React.useEffect(() => {
    const handleLogin = async () => {
      if (pendingLogin.current) {
        return
      }

      pendingLogin.current = true

      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin,
      )
      oktaAuth.setOriginalUri(originalUri)
      const onAuthRequiredFn = onAuthRequired || _onAuthRequired
      if (onAuthRequiredFn) {
        await onAuthRequiredFn(oktaAuth)
      } else {
        await oktaAuth.signInWithRedirect()
      }
    }

    // Only process logic if the route matches
    if (!match) {
      return
    }

    if (!authState) {
      return
    }

    if (authState.isAuthenticated) {
      pendingLogin.current = false
      return
    }

    // Start login if app has decided it is not logged in and there is no pending signin
    if (!authState.isAuthenticated) {
      handleLogin().catch((err) => {
        setHandleLoginError(err)
      })
    }
  }, [authState, oktaAuth, match, onAuthRequired, _onAuthRequired])

  if (handleLoginError) {
    return <ErrorReporter error={handleLoginError} />
  }

  if (!authState || !authState.isAuthenticated) {
    return null
  }

  return { component }
}
