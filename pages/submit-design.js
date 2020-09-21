import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';
import CustomDesign from "../src/components/project-designs/customDesign";

const Content = withRouter((props) => (
    <div>
        <CustomDesign />
    </div>
));

const CustomDesignPage = () => (
    <section>
        <Navbar/>
        <Content />
    </section>
)

export default CustomDesignPage;