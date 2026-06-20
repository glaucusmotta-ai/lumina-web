export async function onRequest(context) {
  const url = new URL(context.request.url)

  const backendUrl = new URL(url.pathname.replace(/^\/api/, ''), 'https://api-lumina.3g-brasil.com')
  backendUrl.search = url.search

  return fetch(backendUrl.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  })
}


