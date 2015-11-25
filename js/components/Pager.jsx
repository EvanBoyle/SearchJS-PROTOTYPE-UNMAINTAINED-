var React = require('react');

var Pager = React.createClass({
	getPreviousListItem: function() {
		var isEnabled = this.props.currentPage > 1;
		var liClass = isEnabled ? "" : "disabled";
		var callback = isEnabled ? this.props.callback.bind(this.props.self, this.props.currentPage -1) : null;
		return <li className={liClass}><a href="javascript:void(0)" key={0} onClick={callback} ><span aria-hidden="true">&laquo;</span></a></li>
	},
	
	getNextListItem: function() {
		var isEnabled = this.props.currentPage < this.props.maxPages;
		var liClass = isEnabled ? "" : "disabled";
		var callback = isEnabled ? this.props.callback.bind(this.props.self, this.props.currentPage + 1) : null;
		return <li className={liClass}><a href="javascript:void(0)" key={this.props.maxPages + 1} onClick={callback} ><span aria-hidden="true">&raquo;</span></a></li>
	},
	getPageListItem: function(page) {
		var isActive = page === this.props.currentPage;
		var liClass = isActive ? "active" : "";
		var callback = isActive ? null : this.props.callback.bind(this.props.self, page);
		return <li className={liClass}><a href="javascript:void(0)" key={page} onClick={callback} >{page}</a></li>
	},
	
	render: function() {
		if(this.props.count < 1){
			return <div></div>
		}
		var links = [];
		links.push(this.getPreviousListItem());
		
		for(var i = this.props.startPage; i <= this.props.lastPage; i++) {
			links.push(this.getPageListItem(i));
		}
		
		links.push(this.getNextListItem());
		
		return (
			<ul className="pagination">
				{links}
			</ul>	
		)
	}
});

module.exports = Pager;