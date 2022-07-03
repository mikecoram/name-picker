import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

const url = "https://uc67vqv73hjphy76xr2g3gyzs40nhcrw.lambda-url.eu-west-2.on.aws"

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { queryStringParameters } = event

  if (!queryStringParameters || !queryStringParameters.names) {
    return {
      body: `
      <!DOCTYPE html>
      <html>
      <body>
        bad request
      </body>
      </html>`,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      statusCode: 400,
    }
  }

  const rawNames = queryStringParameters.names
  const names: string[] = rawNames.split(',')
  const randomName = names[Math.floor(Math.random() * names.length)]
  const winnerText = `${randomName} is the winner!`
  const title = `${winnerText} - name Picker run ${Date.now()}`

  return {
    body: `
    <!DOCTYPE html>
    <html prefix="og: https://ogp.me/ns#">
    <head>
      <title>${title}</title>
      <meta property="og:title" content="${title}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${url}/?${rawNames}" />
    </head>
    <body>
      ${winnerText}

      <br />
      <br />

      These names were in the draw: ${rawNames}
    </body>
    </html>`,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    statusCode: 200,
  }
}
