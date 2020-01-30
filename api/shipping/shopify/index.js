const { json } = require('micro')
const correios = require('node-correios')
const request = require('request')
const geolib = require('geolib')

const autorizadas = [
  {
    latitude: '-30.029939997',
    longitude: '-51.23'
  },
  {
    latitude: '-23.2515399629',
    longitude: '-46.3126098758'
  },
  {
    latitude: '-23.9821374',
    longitude: '-46.2999354'
  },
  {
    latitude: '-20.281594',
    longitude: '-40.2982874'
  },
  {
    latitude: '-19.9294985',
    longitude: '-43.9496391'
  },
  {
    latitude: '-23.664',
    longitude: '-46.5332834014'
  },
  {
    latitude: '-8.0372467',
    longitude: '-34.8909859'
  }
]

const normalizeText = text => {
  const specialChars = 'àáäâãèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ'
  const normalChars = 'aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh'
  const expression = new RegExp(specialChars.split('').join('|'), 'g')

  return text.toString().toLowerCase().trim()
    .replace(expression, index => normalChars.charAt(specialChars.indexOf(index)))
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const { rate: { origin, destination, items } } = await json(req)
  const totalGrams = items.map(item => item.grams).reduce((b, a) => b + a, 0)
  const totalPrice = items.map(item => item.price).reduce((b, a) => b + a, 0)
  const cepAvailable = destination.postal_code.replace('-', '')
  var isCepAvailable = false

  const options = {
    url: `http://www.cepaberto.com/api/v3/cep?cep=${cepAvailable}`,
    headers: {
      'Authorization': `Token token=${process.env.CEP_ABERTO_TOKEN}`
    }
  }

  const callback = (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const info = JSON.parse(body)
      autorizadas.map(auto => {
        if (
          geolib.isPointWithinRadius(
            { latitude: info.latitude, longitude: info.longitude },
            { latitude: auto.latitude, longitude: auto.longitude },
            30000
          )
        ) {
          isCepAvailable = true
        }
      })

      return '200'
    } else {
      return 'error'
    }
  }

  request(options, callback)

  if (totalPrice > 6500 && totalGrams < 300) {
    res.end(JSON.stringify({
      rates: [{
        service_name: 'Frete Grátis',
        service_code: 'FG',
        total_price: '0',
        description: '5-10 dias úteis',
        currency: 'BRL'
      }]
    }))
  }

  if (totalPrice < 400000) {
    const queryArgs = {
      nCdServico: '40010,41106',
      sCepOrigem: origin.postal_code.replace('-', ''),
      sCepDestino: destination.postal_code.replace('-', ''),
      nVlPeso: 1,
      nCdFormato: 1,
      nVlAltura: 15,
      nVlLargura: 20,
      nVlComprimento: 40,
      nVlDiametro: 20,
      nVlValorDeclarado: totalPrice / 100
    }

    return correios.calcPrecoPrazo(queryArgs, (err, result) => {
      if (err) return

      return res.end(JSON.stringify({
        rates: mapCorreiosResultToRate(result)
      }))
    })
  } else if (isCepAvailable === true) { // eslint-disable-line
    return (
      res.end(JSON.stringify({
        rates: [{
          service_name: 'Frete Grátis',
          service_code: 'FGN',
          total_price: '0',
          description: 'Produção + 12 dias úteis',
          currency: 'BRL'
        }]
      }))
    )
  } else {
    return res.end(JSON.stringify({
      rates: []
    }))
  }
}

const mapCorreiosResultToRate = (result) => result.map(r => ({ // map here or map out?
  service_name: `Correios -${r.Codigo}`,
  service_code: r.Codigo,
  total_price: parseFloat(r.Valor.split(',').join('.')) * 100,
  description: `${r.PrazoEntrega} dias úteis`,
  currency: `BRL`
}))
