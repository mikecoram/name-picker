import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

const url = process.env.url ?? 'not set'
const exampleUrl = `${url}?names=bill,jill`

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { queryStringParameters } = event

  if (queryStringParameters === null || queryStringParameters.names === undefined) {
    return {
      body: `
      <!DOCTYPE html>
      <html>
      <body>
        Bad Request.
        <br />
        <br />
        Try something like: <a href="${exampleUrl}">${exampleUrl}</a>
      </body>
      </html>`,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      statusCode: 400
    }
  }

  const rawNames = queryStringParameters.names
  const run = queryStringParameters.run
  const names = rawNames.split(',')
  const randomName = names[Math.floor(Math.random() * names.length)]
  const winnerText = `${randomName} is the winner!`
  const drawText = `These names were in the draw: ${rawNames}`
  const titleText = `${winnerText}`

  return {
    body: `
    <!DOCTYPE html>
    <html prefix="og: https://ogp.me/ns#">
    <head>
      <title>${titleText}</title>
      <meta property="article:modified_time" content="${new Date().toISOString()}" />
      <meta property="article:published_time" content="${new Date().toISOString()}" />
      <meta property="article:publisher" content="Name Picker" />
      <meta property="og:description" content="${drawText}. Click the link to run again with the same names." />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:site_name" content="Name Picker" />
      <meta property="og:title" content="${titleText}" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="${url}/?names=${rawNames}${run !== undefined ? '&run=' + run : ''}" />
    </head>
    <body>
      ${winnerText}
      <br />
      <br />
      ${drawText}
      <br />
      <br />
      Refresh to pick again.
    </body>
    </html>`,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    statusCode: 200
  }
}
