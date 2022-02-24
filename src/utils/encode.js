import crypto from 'crypto'
import axios from 'axios'

export function signMessage(message) {
  const key =
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpAIBAAKCAQEA3vFKUMhrdeYDpS2i27PO/sdH2E/hq679v9+WGajqDX3bP36W\n' +
    'Q/BgkEJnGDxHO6wwGOdfaSz8YEs20BvC+Nh2n34PcTYKvl/4RCfoQxrUFahu8D1l\n' +
    'ReJQi753yRLJuWTZv0hNomHCe5XByKYP1T6wHES5RsGV0cXW9krgmt7Nshh9n9+X\n' +
    'wrnSTmUdsSetbg96fEAuIY3h8auxlaBKr0eJXmQxQBIDjfQsAx77DShiS7nVa5rX\n' +
    'LHrn7zMVddvjR4MEhx9oTPrbU+MMsHaHc76Nuf1fWNrAduFZKBxikFzrBJpOgmD1\n' +
    '3K6Y/ba13V9aB1v1Z7RGxUOl0b0MIk5wiLOciQIDAQABAoIBAGY03moMh99kFNW8\n' +
    'B0aLt2DsQU60yHOp5OD7Atg+rRaEVWhVg1QgNlTMbHEa6Vk9BkvUftQ78HPA558e\n' +
    'qxLkQfW6mB/Bs8k1PB8a4IsrGIHZVwrCStRv/ZcjOc0v1NUum/jqj9Ta1otLy6xO\n' +
    'HUIY3CoJg5shkqq59WOyTigR7uEvJ98+tfnO6cL2R9r+APqwRgYdtIvfBPLoQ6G+\n' +
    '0yGYEl7KjAUQE35pxT5155G/lx3+OqvnxOGxt69I5zEHD11oJiaFzB1VKo823Iz0\n' +
    '6DOV5TGRm+oCeP2K+ca15F5TUR81zQWxiXkyjZrtIgoDXMp3IMFmpJ3K1r4YhtVk\n' +
    'EsYvBXUCgYEA+YYx6y/8b88mELUnEZ7ZQA48hrGKZJ9rN0oeeKsxNZG8EX4yayTl\n' +
    '6kioiDanqKhwUL/I6BoGGsDJSp75oJgYvlSuuR1dfMQDL6UkSAM3JpKoH4OYvt2E\n' +
    'C2h3OQ83mEyMVNlFbggVOnNnh6OxuQ3Vz0v8cJsRcOqj/OLoaPWoJvMCgYEA5Lp9\n' +
    'h/boiVfjtkKHN3Cfflxcq8/stzO4jaLzHFZRPR5wDUm/9lqTt5L8Vx1vYOH+2NPY\n' +
    'igOvXliPNeaVxtOUm6tjzej1vKjlT2IQrBtDTv5xzl47HyPDm3VvGTp2Q7oQ696/\n' +
    'iGL109awlEzfIof61gCGj+RiI4NJLPwuQtuzhZMCgYEAxNCZnUXLWrHM946700U1\n' +
    'XTYdfayaWYX5PrIi2NFHTla2PiIJSMPg6ewHqvFZS0oY1UiBArpMKFv6Kfa9NXPi\n' +
    'yHXpHzBPZjMBxFoBBSAsJyu0mq7lE1+MYKc0qvgaxPFUGzUJc6HChMk0VyPB8hI8\n' +
    'nHb2FifqGOOrF7Qu12M1EAsCgYEA0JAYjRUgnrPsqLHrOCtS09cGjYgwEjFwNH6E\n' +
    'ba9rrm6FwCgiiVG4Zmj5/bmSaOZKCo7JYbfQfhgEpiKXKlCdroDOpeCpypi7V/JU\n' +
    'v4qwimRLg+C6yj9DSwr+/iMn2cPdUCaxwXxzKfIW23No98TEfcTG7ohS0I0S+ZkN\n' +
    '2dsZzE8CgYBuaEsVrg5eKn5oRV47ybMWpSO7Cgy9xbdjM+x2H1ga0LBx+2oJs13s\n' +
    'GIuC53jCjDTcuYemT/I0I05gwzQcpN33NvWDZCWAT7xqjhWDd/sxHhrb5qfAo/1W\n' +
    'W4ckRkrAsJFTofhbhhPk2OhILmPUGrnbwqQJLag9qRn1sj11sQW/rg==\n' +
    '-----END RSA PRIVATE KEY-----'
  return crypto.createSign('RSA-SHA256').update(message).sign(key, 'base64')
}

export const callApi = async (sign, format) => {
  const base64 = sign.replaceAll('+', '-').replaceAll('/', '_')
  return axios.post(
    'https://mac-portal-dev.appmanteam.com/api/workflow/api/dopa/auth',
    {
      request_time: format,
      signature: base64,
    }
  )
}
