import { compose } from 'recompose'
import { withRouter } from 'next/router'
import ProductInfo from '../../components/ProductInfo'
import withProduct from '../../containers/withProduct'
import PaddedView from '../../components/PaddedView';

const ProductPage = ({ isProductLoading, product, ...props }) =>
  <PaddedView>
    { isProductLoading ? 'carregando...' : <ProductInfo product={product} /> }
  </PaddedView>

export default compose(
  withRouter,
  withProduct(({ router }) => router.query.handle)
)(ProductPage)
