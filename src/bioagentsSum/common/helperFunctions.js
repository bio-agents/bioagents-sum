import * as R from 'ramda'
import { ALL_SERVICES } from '../../constants/stringConstants'

export const createQueryString = R.compose(
  R.join('&'),
  R.map(R.join('=')),
  R.toPairs,
  R.evolve({
    collectionID: collectionID => `"${collectionID}"`,
  }),
)

export const hyphenDelimitedToCamelCased = string => string.replace(/-([a-z0-9])/g, match => match[1].toUpperCase())

export const config = window.config || require('../../../public/config_select.js').config

export const impacts = window.impacts || require('../../../public/wos.js').impacts

export const configCollection = config.collectionID

export const configBioagents = config.bioagentsIDS

export const configRatingsKeys = config.ratingsKeys

export const configRatings = config.ratings

export const allowReportMode = config.allowReportMode

export const allowCollectionChange = config.allowCollectionChange

export const showOnlyAllServicesInCollection = config.showOnlyAllServicesInCollection

export const getServicesNames = showOnlyAllServicesInCollection
  ? [hyphenDelimitedToCamelCased(ALL_SERVICES)]
  : R.compose(
    R.map(hyphenDelimitedToCamelCased),
    R.prepend(ALL_SERVICES),
    R.pluck('route'),
    R.unnest,
    R.pluck('cells'),
    R.prop('rows'),
  )(config)
