// Isolated loopback test server. Never connects to the application database.
import { createServer } from 'node:http'

createServer((request, response) => {
  if (request.url === '/health' || request.url === '/health/live') {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Healthy')
    return
  }
  if (request.url === '/api/test-proxy') {
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'ziapp_test=loopback-only; Path=/; HttpOnly; SameSite=Lax',
    })
    response.end(
      JSON.stringify({
        cookieReceived: (request.headers.cookie ?? '').includes(
          'ziapp_test=loopback-only',
        ),
        csrfReceived: request.headers['x-csrf-token'] === 'test-only-token',
        exactValue: '-10000.000000000000000000000000001',
      }),
    )
    return
  }
  response.writeHead(404)
  response.end()
}).listen(5510, '127.0.0.1')
