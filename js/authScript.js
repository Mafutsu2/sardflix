window.onload = async() => {
  loadFavicon();
  let code = getCode();
  if(code)
    connect();
};

const getCode = () => {
  const params = new URLSearchParams(window.location.search);
  code = params.get('code');
  if(!code) {
    const randomString = generateRandomString();
    localStorage.setItem('oauth-state', randomString);
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1231396468850561094&response_type=code&redirect_uri=https%3A%2F%2Fwww.sardflix.com%2Fauth&scope=identify&state=' + btoa(randomString);
  } else if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(params.get('state')))) {
    document.getElementById('authIcon').innerHTML = '';
    document.getElementById('authName').innerText = 'Connexion aborted because you may have been clickjacked! - redirecting in 2s';
    console.error('Connexion aborted because you may have been clickjacked!');
    setTimeout(() => {
      window.location.href = 'https://sardflix.com/';
    }, "2000");
    return false;
  }
  return code;
};

const connect = async() => {
  const url = 'https://api.sardflix.com/auth?code=' + code;
  const response = await fetch(url);
  const json = await response.json();
  if(json.token) {
    localStorage.setItem('sardflix-token', json.token);
    sessionStorage.setItem('avatar', json.avatar);
    const image = document.createElement('img');
    image.src = json.avatar + '?size=80';
    document.getElementById('authAvatar').innerHTML = '';
    document.getElementById('authAvatar').appendChild(image);
    document.getElementById('authName').innerText = json.name;
    document.getElementById('authMesaage').innerText = 'Connexion successful! - redirecting in 1s';
  } else {
    localStorage.setItem('sardflix-token', '');
    document.getElementById('authIcon').innerHTML = '';
    document.getElementById('authName').innerText = 'Connexion failed! - redirecting in 1s';
  }
  setTimeout(() => {
    window.location.href = 'https://sardflix.com/';
  }, "1000");
};

const generateRandomString = () => {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  const randomNumber = Math.floor(Math.random() * 10);

  for (let i = 0; i < 20 + randomNumber; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }

  return randomString;
};