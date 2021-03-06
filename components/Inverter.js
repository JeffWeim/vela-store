import PropTypes from 'prop-types'
import { offBlack } from 'style/colors'

const Inverter = ({ children }) =>
  <div>
    {children}
    <style jsx>{`
      div {
        color: white;
      }
      div :global(h1),
      div :global(h2),
      div :global(h3),
      div :global(h4),
      div :global(h5),
      div :global(h6) {
        color: white;
      }
      div :global(.Card) {
        background-color: ${offBlack};
      }
      div :global(.PaddedView) {
        background-color: ${offBlack};
      }
    `}</style>
  </div>

Inverter.propTypes = {
  children: PropTypes.node
}

export default Inverter
