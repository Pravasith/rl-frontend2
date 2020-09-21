import "../../assets/css/image-view-modal.css";

export default class ImageMagnifierModal extends React.Component {

    render() {
        return (
            <div className="image-view-outer-layer"
                style={{
                    display: this.props.isModalOpen ? "block" : "none"
                }}>
                <div
                    className="image-view-inner-layer" 
                    onClick={this.props.closeModal}>
                    <div className="image-view-inner-layer-2">
                        <div onClick={this.props.closeModal} />
                        <div className="image-view-Container">{this.props.children}</div>
                    </div>
                </div>
            </div>
        );
    }
};