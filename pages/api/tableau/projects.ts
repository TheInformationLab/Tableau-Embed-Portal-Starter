import type { NextApiRequest, NextApiResponse } from 'next'
import { authTableau, data, ResponseProps } from '../../../lib/auth'
import fetch from 'node-fetch'

const getProjects = async (data: any) => {
  const { server, authToken, siteId } = data
  const fetchURL = `https://${server}/api/${process.env.TAB_VERSION}/sites/${siteId}/projects`
  try {
    const info = await fetch(fetchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Tableau-Auth': authToken,
      },
    })
    const responseData = await info.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response: ResponseProps = await authTableau(data)
    //   need to use the REST API to get the projects
    const projects = await getProjects({
      server: process.env.TAB_SERVER,
      authToken: response.credentials.token,
      siteId: response.credentials.site.id,
    })

    res.status(200).json(projects)
  } catch (error) {
    //   if error return to user
    res.status(500).json({ error })
  }
}
