import Button from '../Button'
import { offBlack, offWhite } from '../../style/colors'
import Link from 'next/link'
import Grid from 'components/Grid'
import VelaPointFigure from './VelaPointFigure'

const VelaPoint = () =>
  <section>
    <Grid template="1fr 1fr">
      <div className='description'>
        <h1>Ponto Vela</h1>
        <p>A primeira Rede de Recarga Rápida para bicicletas elétricas, desenvolvida pela Vela, chegou em São Paulo.</p>
        <p>Os pontos são distribuídos em estabelecimentos parceiros para todos os Velejadores aproveitarem.</p>
        <div>
          <Link href='https://forms.gle/Wb7DyMpQwUwqQL6F7'><a>
            <Button big>Onde encontrar</Button>
          </a></Link>
          <Link href='https://forms.gle/Wb7DyMpQwUwqQL6F7'><a>
            <Button big>Saiba mais</Button>
          </a></Link>
        </div>
      </div>

      <div className='figureWrapper'>
        <div><VelaPointFigure /></div>
      </div>
    </Grid>
    <style jsx>{`
      .description div {
        margin-top: 2em;
      }
      .figureWrapper :global(svg){
        max-height: 260px;
      }
    `}</style>
  </section>

export default VelaPoint
