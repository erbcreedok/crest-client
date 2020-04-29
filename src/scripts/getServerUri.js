function getServerUri(port) {
  const { protocol, hostname } = window.location;
  const originalPort = port || window.location.port;
  return `${protocol}//${hostname}:${originalPort}`;
}

export default getServerUri;
