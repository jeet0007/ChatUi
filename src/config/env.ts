export const isDev =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
export const CARTER_ENDPOINT =
  process.env.REACT_APP_CARTER_ENDPOINT || 'http://localhost:6005'
