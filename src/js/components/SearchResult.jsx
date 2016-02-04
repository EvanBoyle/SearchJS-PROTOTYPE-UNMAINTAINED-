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
	modalStyle: {
		content: {
			padding: "0px",
			position: "relative",
			top: "100px "
		}
	},


	render: function(){
		var tableRows = [];
		if(this.props.result.campusType){
			tableRows.push(
				<tr key={tableRows.length}>
					<th className="row-header">Campus Type</th>
					<td>{this.props.result.campusType}</td>
				</tr>
			);
		}
		if(this.props.result.studentsCount){
			tableRows.push(
				<tr key={tableRows.length}>
					<th className="row-header">Students</th>
					<td>{this.props.result.studentsCount}</td>
				</tr>
			);
		}
		if(this.props.result.facultyCount){
			tableRows.push(
				<tr key={tableRows.length}>
					<th className="row-header">Faculty</th>
					<td>{this.props.result.facultyCount}</td>
				</tr>
			);
		}
		if(this.props.result.endowmentAmount){
			tableRows.push(
				<tr key={tableRows.length}>
					<th className="row-header">Endowment (USD)</th>
					<td>{this.props.result.endowmentAmount}</td>
				</tr>
			);
		}
		if(this.props.result.sportsTeamsCount){
			tableRows.push(
				<tr key={tableRows.length}>
					<th className="row-header">Sports Teams</th>
					<td>{this.props.result.sportsTeamCount}</td>
				</tr>
			);
		}
        
        var resultHtml = this.props.resultTemplate(this.props.result);
        
		return (
			<div className="searchResult" onClick={this.openModal}>
                    
					<div dangerouslySetInnerHTML={{__html: resultHtml}}>
                        {/*html for rendered resultd */}
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
							  <div className="row">
							  	<img className="img-rounded img-responsive" src={this.props.result.image_url}/>
								<div className="table-responsive">
									<table className="table table-striped">
										<tbody>
											{tableRows}
										</tbody>
									</table>
								</div>
							  </div>
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