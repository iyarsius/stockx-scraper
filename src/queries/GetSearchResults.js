module.exports = `query GetSearchResults($filtersVersion: Int, $query: String!, $page: BrowsePageInput, $sort: BrowseSortInput, $staticRanking: BrowseExperimentStaticRankingInput) {
      browse(
        query: $query
        page: $page
        sort: $sort
        filtersVersion: $filtersVersion
        experiments: {staticRanking: $staticRanking}
      ) {
        categories {
          id
          name
          count
    }
    results {
          edges {
            objectId
            node {
              ... on Product {
                id
                styleId
                description
                urlKey
                traits {
                    name
                    value
                  }
                primaryTitle
                secondaryTitle
                media {
                  thumbUrl
            }
            brand
            productCategory
          }
          ... on Variant {
                id
                product {
                  id
                  urlKey
                  primaryTitle
                  secondaryTitle
                  media {
                    thumbUrl
              }
              brand
              productCategory
            }
          }
        }
      }
      pageInfo {
            limit
            page
            pageCount
            queryId
            queryIndex
            total
      }
    }
    sort {
          id
          order
    }
  }
}
`