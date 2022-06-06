import fetch from 'node-fetch'

type AuthProps = {
  server: string | undefined
  site: string | undefined
  paName: string | undefined
  paTokenSecret: string | undefined
}

export type ResponseProps = {
  credentials: {
    site: { id: string; contentUrl: string }
    user: { id: string }
    token: string
    estimatedTimeToExpiration: string
  }
}

export const data: AuthProps = {
  server: process.env.TAB_SERVER,
  site: process.env.TAB_SITE,
  paName: process.env.TAB_PA_NAME,
  paTokenSecret: process.env.TAB_PA_TOKEN_SECRET,
}

export const authTableau = async (data: AuthProps): Promise<ResponseProps> => {
  const { server, site, paName, paTokenSecret } = data
  console.log(data)
  // console.log("Data from data/auth", { data });
  const url = `https://${server}/api/${process.env.TAB_VERSION}/auth/signin`
  const body = {
    credentials: {
      personalAccessTokenName: paName,
      personalAccessTokenSecret: paTokenSecret,
      site: {
        contentUrl: site,
      },
    },
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    const json = await resp.json()
    // @ts-ignore
    return json
  } catch (err) {
    console.log('Error in getting auth token', err)
    throw err
  }
}
