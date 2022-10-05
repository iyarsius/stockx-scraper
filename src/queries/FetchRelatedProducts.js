module.exports = `query FetchRelatedProducts($productId: String!, $countryCode: String!, $currencyCode: CurrencyCode, $type: RelatedProductsType, $marketName: String) {
    product(id: $productId) {
        id
        productCategory
        related(input: {type: $type, country: $countryCode, limit: 15}) {
              edges {
                node {
                  id
                  urlKey
                  productCategory
                  primaryCategory
                  brand
                  name
                  description
                  model
                  listingType
                  lockBuying
                  lockSelling
                  title
                  styleId
                  media {
                    thumbUrl
                  }
                  traits {
                    name
                    value
                  }
                  market(currencyCode: $currencyCode) {
                    bidAskData(country: $countryCode, market: $marketName) {
                      lowestAsk
                      highestBid
                      __typename
                }
                salesInformation {
                      salesLast72Hours
                      lastSale
                      __typename
                }
                __typename
            }
            media {
                smallImageUrl
                imageUrl
                __typename
            }
            __typename
         }
          __typename
      }
      __typename
   }
   __typename
}
}`