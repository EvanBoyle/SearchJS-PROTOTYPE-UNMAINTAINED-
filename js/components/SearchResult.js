var React = require('react');
var Modal = require('react-modal');

var appElement = document.getElementById('app');
Modal.setAppElement(appElement);

var SearchResult = React.createClass({
	getInitialState: function() {
		return { modalIsOpen: false };
	},

	openModal: function() {
		this.setState({modalIsOpen: true});
	},

	closeModal: function() {
		this.setState({modalIsOpen: false});
	},
	dummyStyle: {
		"width": "150px",
		"height": "200px"
	},
	imageStyle: {
		"max-height": "150px",
		"align": "middle",
		"verticalAlign": "middle",

	},
	textStyle: {
		position: "absolute",
		bottom: "0"
	},
	modalStyle: {
		content: {
			padding: "0px",
			position: "relative",
			top: "100px "
		}
	},


	render: function(){
		return(
			<div>
					<div onClick={this.openModal} className="col-md-4">
						<div style={this.dummyStyle}>
							<img style={this.imageStyle}className="img-rounded img-responsive" src={this.props.result.image_url}/>
							<span style={this.textStyle}>{this.props.result.title}</span>
						</div>
					</div>  
					<Modal style={this.modalStyle} className="Modal__Bootstrap modal-dialog" isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
						<div className="modal-content">
				            <div className="modal-header">
				              <button type="button" className="close" onClick={this.closeModal}>
				                <span aria-hidden="true">&times;</span>
				                <span className="sr-only">Close</span>
				              </button>
				              <h4 className="modal-title">{this.props.result.title}</h4>
				            </div>
				            <div className="modal-body">
				              <h4>Details</h4>
				              <img style={this.imageStyle}className="img-rounded img-responsive" src={this.props.result.image_url}/>

				            </div>
				            <div className="modal-footer">
				              <button type="button" className="btn btn-default" onClick={this.closeModal}>Close</button>
				              
				            </div>
				          </div>
					</Modal>
				
			</div>
			)
	}
});

module.exports = SearchResult;