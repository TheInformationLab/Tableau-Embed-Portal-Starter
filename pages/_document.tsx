import Document, { Html, Head, Main, NextScript } from 'next/document'
import config from '../config.json'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className="antialiased h-full bg-slate-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
