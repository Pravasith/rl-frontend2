import Link from 'next/link';
import Navbar from '../src/components/navbar/navbar';
import HomePage from '../src/components/common/homePage/homePage';


const PostLink = (props) => {
    return (
        <div>
            {/* <Link
            as={`/`}
            href={`/home`}
        >
            <a></a>
        </Link> */}

            <Link
                as={`/vendor/${props.vName}/${props.vId}`}
                href={`/vendor-shared-link?vName=${props.vName}&vId=${props.vId}`}
            >
                <a></a>
            </Link>

            <Link
                as={`/products/${props.catName}/${props.subCatName}/${props.pTypeName}/${props.fetchId}`}
                href={`/products-segregated?catName=${props.catName}&subCatName=${props.subCatName}&fetchId=${props.fetchId}`}
            >
                <a></a>
            </Link>

            <Link
                as={`/product-detail/${props.catName}/${props.subCatName}/${props.prodTypeName}/${props.fetchId}`}
                href={`/product-detail?catName=${props.catName}&subCatName=${props.subCatName}&prodTypeName=${props.prodTypeName}&fetchId=${props.fetchId}`}
                >
                <a></a>
            </Link>

            <Link
                as={`/blog/new-post`}
                href={`/new-blog-post`}
            >
                <a></a>
            </Link>
        </div>
    )
}

export default () => (
    <div>
        <Navbar />
        <HomePage />
        <ul>
            <PostLink />
        </ul>
    </div>
)