import fetch from 'node-fetch'

type MetadataProps = {
  authToken: string
  server: string | undefined
  query: string
}

// fetch data from Metadata API Queries
export const fetchMetaData = async (data: MetadataProps) => {
  const { server, query, authToken } = data
  const fetchURL = `https://${server}/api/metadata/graphql`
  const info = await fetch(fetchURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Tableau-Auth': authToken,
    },
    body: JSON.stringify({
      query,
    }),
  })
  const responseData = await info.json()
  return responseData
}
