import { compose } from 'recompose'
import { lightGray, darkGray } from '../../style/colors'
import withCheckout from '../../containers/withCheckout'
import Button from '../Button'
import Price from '../Price'

const Bar = ({ onContinue, extra, step, checkout }) => {
  return (
    <div className='Bar'>
      <div className='top'>
        <p><a href='/vela'>Especificações técnicas</a></p>
        <p className='right'>Entrega em três meses</p>
      </div>
      <div className='bottom'>
        <div className='left'>
          <h1>
            {step === 1 && <Price value={6890} />}
            {step === 2 && <Price value={6890 + extra.reduce((a, b) => a + parseInt(b.priceV2.amount), 0)} />}
            {step === 3 && 'Total:' && <Price value={checkout.totalPrice} />}
          </h1>
        </div>
        <div className='actions'>
          <Button primary onClick={onContinue}>
            {step === 1 && 'Continuar'}
            {step === 2 && 'Continuar'}
            {step === 3 && 'Finalizar'}
          </Button>
        </div>
      </div>
      <style jsx>{`
      .Bar {
        border-top: 1px solid ${lightGray};
        padding: 1em;
        display: flex;
        flex-direction: column;
      }
      h1 { 
        color: ${darkGray};
      }
      .bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding 1em 0.5em;
        border-top: 1px solid ${lightGray};
      }
      .top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        padding: 0.5em;
      }
      .top p {
        max-width: 6rem;
      }
      .right {
        text-align: right;
      }
      .left {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .left h1 {
        margin-bottom: 0;
      }
      .actions :global(button) {
        margin: 0;
      }
      @media only screen and (min-width: 768px) {
        .Bar {
          width: 100%;
          flex-direction: row;
        }
        .bottom {
          padding: 0 6em 0 0;
          border: 0;
        }
        .top {
          font-size: 0.8em;
          display: flex;
          justify-content: flex-start;
          padding: 0 0 0 6em;
        }
        .top p{
          max-width: 5rem;
          text-align: center;
          margin: 0;
        }
        .right {
          padding-left: 12em;
        }
        .left {
          flex-direction: column;
        }
        .left h1 {
          padding-right: 1.5em;
        }
      }
    `}</style>
    </div>
  )
}

export default compose(
  withCheckout
)(Bar)
