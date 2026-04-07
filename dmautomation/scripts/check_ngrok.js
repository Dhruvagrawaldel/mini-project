fetch("http://localhost:4040/api/requests/http?limit=10")
  .then(r => r.json())
  .then(d => {
    d.requests.forEach(req => {
      console.log(`[${req.request.method}] ${req.request.uri} -> Response: ${req.response.status_code}`);
    });
  })
  .catch(e => console.error(e));
