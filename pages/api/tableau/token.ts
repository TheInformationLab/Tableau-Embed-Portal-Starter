import { NextApiRequest, NextApiResponse } from 'next'

const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const jwtExpirySeconds = 300

type Data = {
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    username,
    connectedappclientid,
    connectedappsecret,
    connectedappsecretid,
  } = req.body
  if (
    !username ||
    !connectedappclientid ||
    !connectedappsecret ||
    !connectedappsecretid
  ) {
    return res.status(401).end()
  }

  const payload = {
    jti: randomBytes(64).toString('hex'),
    iss: connectedappclientid,
    aud: 'tableau',
    sub: username,
    scope: ['tableau:views:embed'],
  }

  //   Create a new token with the username in the payload
  const token = jwt.sign(payload, connectedappsecret, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds,
    header: {
      kid: connectedappsecretid,
      iss: connectedappclientid,
    },
  })
  res.status(200).json({ token })
}
