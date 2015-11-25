var React = require('react');

var Sorter = React.createClass({
	render: function() {
		return (
			<select ref="sortBy" value={this.props.value} onChange={this.props.onSelectionChange}id="sortBy" className="form-control">
				{
					this.props.options.map(function(option, index) {
						return <option key={index} value={option.value}>{option.text}</option>
					})
				}
			</select>
		)
	}
});

module.exports = Sorter;