const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

let codeVerifier = localStorage.getItem('code_verifier');

const clientId = '295b2220f8ce4d888c3eb996c59b9e17';
const redirectUri = 'http://localhost:5500/playlist.html';

let body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: redirectUri,
  client_id: clientId,
  code_verifier: codeVerifier
});

const response = fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body
})
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('access-token', data.access_token);
  })
  .catch(error => {
    console.error('Error:', error);
  });


async function getProfile(accessToken) {
    let accessToken2 = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken2
      }
    });
  
    const data = await response.json();
    print(data)
}