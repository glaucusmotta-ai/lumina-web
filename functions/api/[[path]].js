export async function onRequest(context) {
  const request = context.request
  const url = new URL(request.url)

  const path = url.pathname.replace(/^\/api/, '')

  const backendUrl =
    `https://api-lumina.3g-brasil.com${path}${url.search}`

  const headers = new Headers(request.headers)

  headers.set('host', 'api-lumina.3g-brasil.com')

  const init = {
    method: request.method,
    headers,
    redirect: 'follow',
  }

  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD'
  ) {
    init.body = await request.arrayBuffer()
  }

  return fetch(backendUrl, init)
}


