const { json } = require('micro')
const correios = require('node-correios')()

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

  if (totalPrice < 3500 * 100) {
    const queryArgs = {
      nCdServico: '40010',
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
      console.log(result)
      console.log("\n")
      return res.end(JSON.stringify({
        rates: mapCorreiosResultToRate(result)
      }))
    })
  } else if (['SP', 'RJ', 'PR', 'SC', 'RS', 'ES', 'MG', 'DF', 'PB'].some(v => v === destination.province)) { // eslint-disable-line
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
  service_name: `Sedex`,
  service_code: r.Codigo,
  total_price: parseFloat(r.Valor.split(',').join('.')) * 100,
  description: `${r.PrazoEntrega} dias úteis`,
  currency: `BRL`
}))
