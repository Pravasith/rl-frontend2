import { withRouter } from 'next/router';
import NotFound from "../src/components/common/notFound";

const Content = withRouter((props) => (
    <div>
        <NotFound />
    </div>
));

const NotFoundPage = () => (
    <section>
        <Content />
    </section>
);

export default NotFoundPage;
