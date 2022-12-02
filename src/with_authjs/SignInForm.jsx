import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const SignInForm = () => {
  const { oktaAuth } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isFromUri = window.location.search.includes('fromURI');
  let fromUri = window.location.search;
  const replacedUrl = fromUri.slice(9, fromUri.length);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    oktaAuth.signInWithCredentials({ username, password })
    .then(res => {
      const sessionToken = res.sessionToken;
      setSessionToken(sessionToken);
      if (isFromUri) {
        oktaAuth.session.setCookieAndRedirect(sessionToken, decodeURIComponent(replacedUrl));
        return;
      }
      // sessionToken is a one-use token, so make sure this is only called once
      oktaAuth.signInWithRedirect({ sessionToken });
    })
    .catch(err => console.log('Found an error', err));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  if (sessionToken) {
    // Hide form while sessionToken is converted into id/access tokens
    return null;
  }

  return (
    <form style={{
      padding: '50px',
      display: 'flex',
      alignItems: 'center',
      
    }} onSubmit={handleSubmit}>
      <div style={{
        padding: '10px'
      }}>
      <label>
        Username:
        <input
          id="username" type="text"
          value={username}
          onChange={handleUsernameChange} />
      </label>
      </div>
      <br/>
      <br />
      <div style={{
        padding: '10px'
      }}>
      <label>
        Password:
        <input
          id="password" type="password"
          value={password}
          onChange={handlePasswordChange} />
      </label>
      </div>
      <input style={{
        alignContent: 'center'
      }} id="submit" type="submit" value="Submit" />
    </form>
  );
};
export default SignInForm;
