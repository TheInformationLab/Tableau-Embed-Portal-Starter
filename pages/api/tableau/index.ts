import type { NextApiRequest, NextApiResponse } from 'next'
import { authTableau, data, ResponseProps } from '../../../lib/auth'
import { fetchMetaData } from '../../../lib/metadata'
import { queries } from '../../../lib/metadataQueries'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get query from request body
  //   get graphql query and tell TS it's a string
  const project: string = req.query?.project as string
  // each page (id) has its own query for project - e.g default as project name will be passed in to the GraphQL query
  // @ts-ignore
  const query: string = queries[req.query?.query](project)
  try {
    const response: ResponseProps = await authTableau(data)
    //   get auth token to make request
    const authToken = response.credentials.token
    const metadata = await fetchMetaData({
      server: process.env.TAB_SERVER,
      // @ts-ignore
      query,
      authToken,
    })
    res.status(200).json(metadata)
  } catch (error) {
    // if error return to user
    res.status(500).json({ error })
  }
}
