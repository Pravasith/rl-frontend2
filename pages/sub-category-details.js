import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';

import CategoryProductsPage from "../src/components/products/subCategorySegregated";

const Content = withRouter((props) => (
    <div>
        <Navbar/>
        <CategoryProductsPage />
    </div>
));

const SubCategoryDetailsPage = () => (
    <section>
        <Content />
    </section>
)

export default SubCategoryDetailsPage;