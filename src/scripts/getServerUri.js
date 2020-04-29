function getServerUri() {
  return process.env.VUE_APP_SERVER_URI || 'https://crest-server.herokuapp.com/';
}

export default getServerUri;
