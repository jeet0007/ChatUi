interface Window {
  config: {

  }
}
declare const window: Window

export const isDev =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

