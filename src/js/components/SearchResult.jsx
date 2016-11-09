var React = require('react');
var Modal = require('react-modal');
var DefaultCssClasses = require('../utils/DefaultCssClasses');
var Constants = require('../constants/SearchConstants');
var assign = require('object-assign');

var SearchResult = React.createClass({
    componentWillMount: function() {
        var appElement = document.getElementById(this.props.rootElementId);
        Modal.setAppElement(appElement);
    },
	getInitialState: function() {
		return { modalIsOpen: false };
	},

	openModal: function() {
		this.setState({modalIsOpen: true});
	},

	closeModal: function() {
		this.setState({modalIsOpen: false});
	},
	modalStyle: {
		content: {
            // todo remove and put in css
			top: "100px ",
		}
        
	},
	render: function(){
        var resultHtml = this.props.resultTemplate ? this.props.resultTemplate.render(this.props.result) : JSON.stringify(this.props.result, null, 4);
        var modalHtml = this.props.modalTemplate ? this.props.modalTemplate.render(this.props.result) : JSON.stringify(this.props.result, null, 4);
        var modalTitleHtml = this.props.modalTitleTemplate ? this.props.modalTitleTemplate.render(this.props.result) : "";
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHRESULTS], this.props.cssClasses);
                
		return (
			<div className={cssClasses.searchResults__result} onClick={this.openModal}>
					<div dangerouslySetInnerHTML={{__html: resultHtml}}>
                        {/*html for rendered result */}
					</div>
					<Modal style={this.modalStyle} className={cssClasses.searchResults__modalContainer} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
						<div className={cssClasses.searchResults__modalContent}>
				            <div className={cssClasses.searchResults__modalHeader}>
				              <button type="button" className={cssClasses.searchResults__modalButton} onClick={this.closeModal}>
				                <span aria-hidden="true">&times;</span>
				                <span className={cssClasses.searchResults__modalButtonLabel}>Close</span>
				              </button>
				              <div dangerouslySetInnerHTML={{__html: modalTitleHtml}}>
                                  {/*html for rendered modal title */}
                              </div>
				            </div>
                            <div dangerouslySetInnerHTML={{__html: modalHtml}}>
                                {/*html for rendered modal */}
                            </div>
				          </div>
					</Modal>
			</div>
			)
	}
});

module.exports = SearchResult;