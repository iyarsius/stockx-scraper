module.exports = `query GetProductPriceLevels($productId: String!, $market: String, $currencyCode: CurrencyCode, $transactionType: TransactionType, $page: Int, $limit: Int, $isVariant: Boolean!) {
      product(id: $productId) @skip(if: $isVariant) {
        id
        market(currencyCode: $currencyCode) {
          ...MarketPriceLevelsFragment
          __typename
    }
    __typename
  }
  variant(id: $productId) @include(if: $isVariant) {
        id
        market(currencyCode: $currencyCode) {
          ...MarketPriceLevelsFragment
          __typename
    }
    __typename
  }
}
fragment MarketPriceLevelsFragment on Market {
      priceLevels(
        market: $market
        transactionType: $transactionType
        page: $page
        limit: $limit
      ) {
        edges {
          node {
            count
            ownCount
            amount
            isLocal
            variant {
              id
              traits {
                size
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
  __typename
}`