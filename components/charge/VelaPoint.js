import Link from 'next/link'
import Grid from 'components/Grid'
import Button from 'components/Button'
import Section from 'components/Section'
import SectionHeader from 'components/SectionHeader'
import VelaPointFigure from './VelaPointFigure'

const VelaPoint = () =>
  <Section>
    <Grid template='1fr 1fr'>
      <div>
        <SectionHeader title='Ponto Vela' />
        <div className='SectionBody'>
          <p>Desenvolvemos a primeira Rede de Recarga Rápida para bicicletas elétricas do Brasil!</p>
          <p>Agora, pedalar pela cidade é uma experiência ainda mais segura e conectada, com autonomia ilimitada pelo caminho.</p>
          <p>Os pontos de carregamento são distribuídos por São Paulo, em diversos estabelecimentos parceiros, para todos os Velejadores aproveitarem.</p>
        </div>

        <div>
          <Link href='/network/map' as='/rede/mapa'><a>
            <Button primary>Onde encontrar</Button>
          </a></Link>
          <Link href='https://velabikes.freshdesk.com/support/solutions/folders/43000558455tii'><a>
            <Button primary outline>Saiba mais</Button>
          </a></Link>
        </div>
      </div>

      <div className='figureWrapper'>
        <VelaPointFigure />
      </div>
    </Grid>
    <style jsx>{`
      .figureWrapper :global(svg) {
        margin: 1em 0;
      }

      .SectionBody {
        margin-bottom: 3em;
      }
    `}</style>
  </Section>

export default VelaPoint
