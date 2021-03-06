import { velaRed, velaBlue, offBlack } from '../../style/colors'

const Features = () =>
  <div className='features'>
    <div className='icon'>
      <div className='image rota'>
        <img src='/static/route-bike.png' alt='' />
      </div>
      <p>Rota de</p>
      <p>ciclistas</p>
    </div>

    <div className='icon'>
      <div className='image clientes'>
        <img src='/static/clients.png' alt='' />
      </div>
      <p>Clientes</p>
      <p>potenciais</p>
    </div>

    <div className='icon'>
      <div className='image site'>
        <img src='/static/site.png' alt='' />
      </div>
      <p>Divulgação</p>
      <p>no site</p>
    </div>

    <style jsx>{`
      .features {
        display: grid;
        position: relative;
        text-align: center;
      }
      .features .icon {
        margin: 3rem auto;
      }
      .features .image.rota {
        background-color: ${velaRed};
      }
      .features .image.clientes {
        background-color: ${offBlack};
      }
      .features .image.site {
        background-color: ${velaBlue};
      }
      .features .image img {
        width: 4rem;
        height: auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
      .features .image {
        width: 8rem;
        height: 8rem;
        border-radius: 5px;
        margin-bottom: 1rem;
      }
      .features .icon p {
        margin: 0;
        text-align: center;
        text-transform: uppercase;
        // font-size: 1.5rem;
        font-style: italic;
        line-height: 1;
      }

      @media only screen and (min-width: 768px) {
        .features {
          grid-template-columns: 1fr 1fr 1fr;
          margin: 6rem 0;
        }
      }
    `}</style>
  </div>

export default Features
