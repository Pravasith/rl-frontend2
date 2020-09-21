import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';

import CategoryProducts from "../src/components/products/categoryProducts";

const Content = withRouter((props) => (
    <div>
        <Navbar/>
        <CategoryProducts />
    </div>
));

const CategoryDetailsPage = () => (
    <section>
        <Content />
    </section>
)

export default CategoryDetailsPage;