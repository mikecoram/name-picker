import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

const baseUrl = process.env.url ?? 'not set'
const exampleUrl = `${baseUrl}?names=Bill,Jill`

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { queryStringParameters } = event

  if (queryStringParameters == null || queryStringParameters.names === undefined) {
    return {
      body: `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Bad Request</h1>
        <p>
          Try something like: <a href="${exampleUrl}">${exampleUrl}</a>
        </p>
        <p>
          <a href="https://github.com/mikecoram/name-picker">https://github.com/mikecoram/name-picker</a>
        </p>
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
  const winnerText = `${randomName} is the winner ${run !== undefined ? `to run ${run}` : ''}`
  const drawText = `These names were in the draw: ${names.join(', ')}`
  const titleText = `${winnerText}`
  const url = `${baseUrl}/?names=${rawNames}${run !== undefined ? '&run=' + run : ''}`

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
      <meta property="og:url" content="${url}" />
    </head>
    <body>
      <h1>
        ${winnerText}
      </h1>
      <p>
        ${drawText}
      </p>
      <p>
        <a href="${url}">Pick again</a>
      </p>
      <p>
        <a href="https://github.com/mikecoram/name-picker">https://github.com/mikecoram/name-picker</a>
      </p>
    </body>
    </html>`,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    statusCode: 200
  }
}
