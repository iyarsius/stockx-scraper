module.exports = `query GetProduct($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String) {
  product(id: $id) {
    id
    listingType
    ...AffirmCalloutFragment
    ...BidButtonContentFragment
    ...BreadcrumbsFragment
    ...BreadcrumbSchemaFragment
    ...BuySellContentFragment
    ...BuySellFragment
    ...HazmatWarningFragment
    ...HeaderFragment
    ...LastSaleFragment
    ...LowInventoryBannerFragment
    ...MarketActivityFragment
    ...MediaFragment
    ...MyPositionFragment
    ...ProductDetailsFragment
    ...ProductMetaTagsFragment
    ...ProductSchemaFragment
    ...ScreenTrackerFragment
    ...SizeSelectorWrapperFragment
    ...StatsForNerdsFragment
    ...ThreeSixtyImageFragment
    ...TrackingFragment
    ...UtilityGroupFragment
    __typename
}
}
fragment AffirmCalloutFragment on Product {
  productCategory
  urlKey
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      lowestAsk
      __typename
}
__typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        lowestAsk
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment BidButtonContentFragment on Product {
  id
  urlKey
  sizeDescriptor
  productCategory
  lockBuying
  lockSelling
  minimumBid(currencyCode: $currencyCode)
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      highestBid
      highestBidSize
      lowestAsk
      lowestAskSize
      numberOfAsks
      numberOfBids
      __typename
}
__typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        highestBid
        highestBidSize
        lowestAsk
        lowestAskSize
        numberOfAsks
        numberOfBids
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment BreadcrumbsFragment on Product {
  breadcrumbs {
    name
    url
    level
    __typename
}
__typename
}
fragment BreadcrumbSchemaFragment on Product {
  breadcrumbs {
    name
    url
    __typename
}
__typename
}
fragment BuySellContentFragment on Product {
  id
  urlKey
  sizeDescriptor
  productCategory
  lockBuying
  lockSelling
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      highestBid
      highestBidSize
      lowestAsk
      lowestAskSize
      __typename
}
__typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        highestBid
        highestBidSize
        lowestAsk
        lowestAskSize
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment BuySellFragment on Product {
  id
  title
  urlKey
  sizeDescriptor
  productCategory
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      highestBid
      highestBidSize
      lowestAsk
      lowestAskSize
      __typename
}
__typename
}
media {
    imageUrl
    __typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        highestBid
        highestBidSize
        lowestAsk
        lowestAskSize
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment HazmatWarningFragment on Product {
  id
  hazardousMaterial {
    lithiumIonBucket
    __typename
}
__typename
}
fragment HeaderFragment on Product {
  primaryTitle
  secondaryTitle
  condition
  productCategory
  __typename
}
fragment LastSaleFragment on Product {
  id
  market(currencyCode: $currencyCode) {
    ...LastSaleMarket
    __typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      ...LastSaleMarket
      __typename
}
__typename
}
__typename
}
fragment LastSaleMarket on Market {
  salesInformation {
    annualHigh
    annualLow
    volatility
    pricePremium
    lastSale
    changeValue
    changePercentage
    __typename
}
deadStock {
  sold
}
__typename
}
fragment LowInventoryBannerFragment on Product {
  id
  productCategory
  primaryCategory
  sizeDescriptor
  market(currencyCode: $currencyCode) {
    ...LowInventoryBannerMarket
    __typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      ...LowInventoryBannerMarket
      __typename
}
__typename
}
__typename
}
fragment LowInventoryBannerMarket on Market {
  bidAskData(country: $countryCode, market: $marketName) {
    numberOfAsks
    lowestAsk
    __typename
}
salesInformation {
    lastSale
 salesLast72Hours
    __typename
}
deadStock {
sold
}
__typename
}
fragment MarketActivityFragment on Product {
  id
  title
  productCategory
  primaryTitle
  secondaryTitle
  media {
    smallImageUrl
    __typename
}
__typename
}
fragment MediaFragment on Product {
  id
  productCategory
  title
  brand
  urlKey
  variants {
    id
    hidden
    traits {
      size
      __typename
}
__typename
}
media {
    gallery
    all360Images
    imageUrl
    __typename
}
__typename
}
fragment MyPositionFragment on Product {
  id
  urlKey
  __typename
}
fragment ProductDetailsFragment on Product {
  description
  traits {
    name
    value
    visible
    format
    __typename
}
__typename
}
fragment ProductMetaTagsFragment on Product {
  id
  urlKey
  productCategory
  brand
  model
  title
  description
  condition
  styleId
  breadcrumbs {
    name
    url
    __typename
}
traits {
    name
    value
    __typename
}
media {
    thumbUrl
    imageUrl
    __typename
}
market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      lowestAsk
      numberOfAsks
      __typename
}
__typename
}
variants {
    id
    hidden
    traits {
      size
      __typename
}
market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        lowestAsk
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment ProductSchemaFragment on Product {
  id
  urlKey
  productCategory
  brand
  model
  title
  description
  condition
  styleId
  traits {
    name
    value
    __typename
}
media {
    thumbUrl
    imageUrl
    __typename
}
market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      lowestAsk
      numberOfAsks
      __typename
}
__typename
}
variants {
    id
    hidden
    traits {
      size
      __typename
}
market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        lowestAsk
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment ScreenTrackerFragment on Product {
  id
  brand
  productCategory
  primaryCategory
  title
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      highestBid
      lowestAsk
      numberOfAsks
      numberOfBids
      __typename
}
salesInformation {
      lastSale
 salesLast72Hours
      __typename
}
deadStock {
    sold
}
__typename
}
media {
    imageUrl
    __typename
}
traits {
    name
    value
    __typename
}
variants {
    id
    traits {
      size
      __typename
}
market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        highestBid
        lowestAsk
        numberOfAsks
        numberOfBids
        __typename
  }
  salesInformation {
        lastSale
        salesLast72Hours
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment SizeSelectorWrapperFragment on Product {
  id
  ...SizeSelectorFragment
  ...SizeSelectorHeaderFragment
  ...SizesFragment
  ...SizesOptionsFragment
  ...SizeChartFragment
  ...SizeChartContentFragment
  ...SizeConversionFragment
  ...SizesAllButtonFragment
  __typename
}
fragment SizeSelectorFragment on Product {
  id
  title
  productCategory
  sizeDescriptor
  availableSizeConversions {
    name
    type
    __typename
}
defaultSizeConversion {
    name
    type
    __typename
}
variants {
    id
    hidden
    traits {
      size
      __typename
}
sizeChart {
      baseSize
      baseType
      displayOptions {
        size
        type
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment SizeSelectorHeaderFragment on Product {
  sizeDescriptor
  productCategory
  availableSizeConversions {
    name
    type
    __typename
}
__typename
}
fragment SizesFragment on Product {
  id
  productCategory
  title
  __typename
}
fragment SizesOptionsFragment on Product {
  id
  variants {
    id
    hidden
    group {
      shortCode
      __typename
}
traits {
      size
      __typename
}
sizeChart {
      baseSize
      baseType
      displayOptions {
        size
        type
        __typename
  }
  __typename
}
market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        lowestAsk
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment SizeChartFragment on Product {
  availableSizeConversions {
    name
    type
    __typename
}
defaultSizeConversion {
    name
    type
    __typename
}
__typename
}
fragment SizeChartContentFragment on Product {
  availableSizeConversions {
    name
    type
    __typename
}
defaultSizeConversion {
    name
    type
    __typename
}
variants {
    id
    sizeChart {
      baseSize
      baseType
      displayOptions {
        size
        type
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment SizeConversionFragment on Product {
  productCategory
  sizeDescriptor
  availableSizeConversions {
    name
    type
    __typename
}
defaultSizeConversion {
    name
    type
    __typename
}
__typename
}
fragment SizesAllButtonFragment on Product {
  id
  sizeAllDescriptor
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      lowestAsk
      __typename
}
__typename
}
__typename
}
fragment StatsForNerdsFragment on Product {
  id
  title
  productCategory
  sizeDescriptor
  urlKey
  __typename
}
fragment ThreeSixtyImageFragment on Product {
  id
  title
  variants {
    id
    __typename
}
productCategory
media {
    all360Images
    __typename
}
has360Images
__typename
}
fragment TrackingFragment on Product {
  id
  productCategory
  primaryCategory
  brand
  title
  market(currencyCode: $currencyCode) {
    bidAskData(country: $countryCode, market: $marketName) {
      highestBid
      lowestAsk
      __typename
}
__typename
}
variants {
    id
    market(currencyCode: $currencyCode) {
      bidAskData(country: $countryCode, market: $marketName) {
        highestBid
        lowestAsk
        __typename
  }
  __typename
}
__typename
}
__typename
}
fragment UtilityGroupFragment on Product {
  id
  ...FollowFragment
  ...FollowContentFragment
  ...FollowShareContentFragment
  ...FollowSuccessFragment
  ...PortfolioFragment
  ...PortfolioContentFragment
  ...ShareFragment
  __typename
}
fragment FollowFragment on Product {
  id
  productCategory
  title
  variants {
    id
    traits {
      size
      __typename
}
__typename
}
__typename
}
fragment FollowContentFragment on Product {
  title
  __typename
}
fragment FollowShareContentFragment on Product {
  id
  title
  sizeDescriptor
  variants {
    id
    traits {
      size
      __typename
}
__typename
}
__typename
}
fragment FollowSuccessFragment on Product {
  id
  title
  productCategory
  sizeDescriptor
  media {
    smallImageUrl
    __typename
}
variants {
    id
    traits {
      size
      __typename
}
__typename
}
__typename
}
fragment PortfolioFragment on Product {
  id
  title
  productCategory
  variants {
    id
    __typename
}
traits {
    name
    value
    __typename
}
__typename
}
fragment PortfolioContentFragment on Product {
  id
  productCategory
  sizeDescriptor
  variants {
    id
    traits {
      size
      __typename
}
__typename
}
__typename
}
fragment ShareFragment on Product {
  id
  productCategory
  title
  media {
    imageUrl
    __typename
}
__typename
}
`