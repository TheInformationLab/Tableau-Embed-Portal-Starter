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

const workbook = (workbookId: string) => `query workbook{
        workbooks (filter: { id: "${workbookId}"}) {
            id
            site {
              id
              name
            }
            luid
            name
            projectName
            dashboards {
              name
              id
            }
            owner {
              id
              name
            }
            uri
          }
}`

const getDatabasesOnSite = `query getDatabasesOnMySite{
    databases {
        id
        name
    }
}`

const basicDataSourceList = `{
  publishedDatasourcesConnection(first: 75, offset: 0) {
    totalCount
    nodes {
      projectName
      name
      owner {
        username
      }
      extractLastRefreshTime
      hasExtracts
    }
  }
}`
export const queries = {
  workbooks,
  workbook,
  getDatabasesOnSite,
  basicDataSourceList,
}
