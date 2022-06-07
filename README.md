# Tableau Embed Portal Starter - Next.js + Tailwind CSS

**[Author: Andre de Vries](https://www.andredevries.dev/)**

This project should jumpstart your next project for building out a portal for Embedded Tableau dashboards. This repo contains the building blocks for any portal that has integrations with Tableau dashboards. _Why?_ Because learning and understanding the various components and APIs of a portal is hard. Therefore, this repo is a starting point for anyone who wants to build out a portal for Tableau dashboards.

This example has been built with Tableau Online / Cloud in mind but can also be used with Tableau Server. It is opinionated in terms of the tech stack, but can be fully taken apart and integrated within your application. It contains the bare minimum starter code to authenticate to the Tableau REST and Metadata API, code snippets for embedding dashboards and generating JWT tokens for version 3 of the Embedding API. I purposefully did not create an authentication wrapper around this application because there are so many authentication providers with slight variations in their APIs. More about that below.

## Getting started

Clone or download the repo

```bash
git clone git@github.com:TheInformationLab/Tableau-Embed-Portal-Starter.git
cd Tableau-Embed-Portal-Starter
# install packages
npm install
# or
yarn install
# run local server
npm run dev
# or
yarn run dev
```

## Tableau Setup

We need to configure a few settings in Tableau Online / Cloud or Tableau Server:

- Step 1: This repo contains a .env.example file. Recreate the .env file or rename the .env.example file to .env
- Step 2: Fill in the Tableau Server / Online URL (e.g dub01.online.tableau.com)
- Step 3: Find the [API version](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_versions.htm) for your Server or Cloud deployment and add it to _TAB_VERSION_
- Step 4: Fill in the Tableau Server / Online Site Name: (name after 'site/' in the URL)
- Step 5: Generate a Personal Access Token (My Account Settings > Settings > Personal Access Tokens) and add to the .env file
- Step 6: Create a Connected App (Settings > Connected Apps > New Connected App - make sure you enable the Connected App) and add to the .env file

## Background

This starter kit has been built with:

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/)
- [TypeScript](https://www.typescriptlang.org/)

### Directory Layout

```sh
.
├── /components/                # List of React Components
├── /node_modules/              # Project dependencies (npm modules)
├── /pages/                     # Every .tsx or .js file becomes a page in this folder
│   ├── /api/                   # Serverless API routes
│   │   ├── /tableau/
│   │   │    ├── /index.ts      # Fetching data with Tableau Metadata API
│   │   │    ├── /projects.ts   # Fetching project information from Tableau REST API
│   ├── /_app.tsx               # Entry point of Next.js App
│   ├── /_document.tsx          # Custom document to set base styles
│   └── /index.tsx              # Landing page
├── /public/                    # Serves static files
├── /styles/                    # Global CSS file for TailwindCSS
├── package.json                # The list of project dependencies
├── tailwind.config.js          # Configuration for TailwindCSS - https://tailwindcss.com/docs/configuration
└── config.json                 # Config for data around Tableau Cloud / Server - do not put secrets here
```

Every .tsx or .js file becomes a page in the `Pages` folder. Every file in the API folder becomes an API route. This is the backend of your application.

## Tableau APIs

This example starter uses serveral Tableau APIs:

- [REST API](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm): calls endpoint to fetch all the projects in the specified Tableau site
- [Metadata API](https://help.tableau.com/current/api/metadata_api/en-us/index.html): for each project, fetches workbooks and metadata about workbooks / dashboards
- [Embedding API](https://help.tableau.com/current/api/embedding_api/en-us/index.html): easily embed dashboards in your application

## REST API Authentication

The authentication for the REST API is done through a Personal Access Token. This token is generated in the Tableau Online / Cloud My Account Settings > Settings > Personal Access Tokens. In `lib/auth.ts` you see how to generate the token you need for subsequent API calls. You need to remove the TypeScript types if you are using Vanilla JavaScript.

```ts
export const authTableau = async (data: AuthProps): Promise<ResponseProps> => {
  const { server, site, paName, paTokenSecret } = data
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
    return json
  } catch (err) {
    console.log('Error in getting auth token', err)
    throw err
  }
}
```

After you have generated the token, you can use it to make API calls. For example, to get all the projects in the site, you can use the following code:

```ts
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
```

The authtoken from the authentication call is being using the `X-Tableau-Auth` header. No paging is implemented in this example. If you would like to implement pagination, please see the [Tableau API documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_paging.htm).

**Note:** the authtoken is valid for 240 minutes by default. If you need to refresh the token, you need to call the authentication API again. However, this depends on your setup. This starter kit does not store the authentication token anywhere and is being called each time you refresh the page. This might lead to a lot of calls to your Tableau Cloud or Server site. A good setup for production would be to store the token in a database and call the authentication API only when the token is expired.

## Metadata Queries

I am using the Metadata API to fetch the workbooks and dashboards for each project. The following GraphQL query fetches the workbooks, projects and upstream data sources for a particular project. This is implemented in the `pages/projects/[id].tsx` file.

```ts
const workbooks = (projectName: string) => `query workbooks{
    workbooks (filter: { projectName: "${projectName}"}) {
        id
        luid
        name
        description
        createdAt
        site {
            luid
          }
        projectName
        projectVizportalUrlId
        owner {
            id
            }
        uri
        upstreamDatasources {
            id
            luid
            name
            }
        }
    }`
```

I have also included two other GraphQL queries in the `metadataQueries.ts` file to showcase how to fetch more resources from Tableau Metadata API.

## Single Sign On / Authentication

I have not implemented a Single Sign On (SSO) provider with SAML in this starter kit. There are so many options. Internally at The Information Lab we use [Auth0](https://auth0.com/) for SSO. However, this is not a requirement. Your portal can use any other SSO provider. To learn more about configuring this for Tableau Cloud / Online please see the [Tableau Cloud / Online documentation](https://help.tableau.com/current/online/en-us/saml.htm).

I have implemented a very simple authentication flow that stores login details to local storage. This is just for illustrating the concept. The main idea is to find an easy way to store the login details in your application. These details are then being using the `api/tableau/token.ts` file to get the JWT token for the embedded dashboards.

## Connected Apps / JWT

Connected Apps allow you to setup a trusted relationship between your Tableau Server/Online site and a custom application. This process is established and verified through an authentication token in the JSON Web Token (JWT) standard, which uses a shared secret provided by the Tableau connected app and signed by your custom application.

You can learn more about Connected Apps on my [interactive playground](https://playground.theinformationlab.io/)

## Embedding Dashboards

The main goal of the portal is to let users interact with Tableau dashboards. The Tableau Embedding API is used to embed dashboards in your application. My colleague Craig Bloodworth has created an [interactive tutorial](https://tableau-connectedapps.theinformationlab.io) that walks you through the steps to embed a Tableau dashboard in a React application. This start kit also uses the code from this tutorial to embed dashboards.
