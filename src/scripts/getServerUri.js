function getServerUri() {
  const { protocol, hostname } = window.location;
  return process.env.NODE_ENV === 'development'
    ? `${protocol}//${hostname}:3333`
    : (process.env.VUE_APP_SERVER_URI || 'https://crest-server.herokuapp.com/');
}

export default getServerUri;
