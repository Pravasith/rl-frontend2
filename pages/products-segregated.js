import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';
import ProductsSegregated from "../src/components/products/productsSegregated";

const Content = withRouter((props) => {
    return (
        <div className="productsSegregatedContentContainer">
            <ProductsSegregated
                catName={props.router.query.catName}
                subCatName={props.router.query.subCatName}
                productTypeName={props.router.query.prodTypeName}
                fetchId={props.router.query.fetchId}
            />
        </div>
    )
});

const ProductsSegregatedPage = () => (
    <section className="productsSegregated">
        <Navbar/>
        <Content />
    </section>
)

export default ProductsSegregatedPage;