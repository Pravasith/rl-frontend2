import EditBlog from "../src/components/blogs/blogEditor";
import Navbar from '../src/components/navbar/navbar';

const BlogEditor = () => (
    <section className="new-post-container">
        <Navbar
            dontDisplayProducts = {true}
        />
        <div className="new-post-wrapper">
            <EditBlog />
        </div>
    </section>
)

export default BlogEditor;