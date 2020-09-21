import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';
import MyOrders from "../src/components/checkout/orders/myOrders";

const Content = withRouter((props) => (
    <div>
        <Navbar
            hideCart
            hideSubmitButton
        />
        <MyOrders />
    </div>
));

const MyOrdersPage = () => (
    <section>
        <Content />
    </section>
)

export default MyOrdersPage;