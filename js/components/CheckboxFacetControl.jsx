var React = require("react");
var CheckControl = require("./CheckControl.jsx");
var SearchStore = require("../stores/SearchStore.js");
var SearchActions = require("../actions/SearchActions");

var CheckboxFacetControl = React.createClass({
    getInitialState: function() {
        return {
                collapsed: false,
                facets: null
            };
    },
    componentDidMount: function() {
        SearchStore.addChangeListener(this.onChange);
        this.onChange();
    },
    onChange: function() {
        facets = SearchStore.getFacet(this.props.field);
        this.setState({facets: facets});
    },
    toggleCollapse: function() {
        this.setState({collapsed: !this.state.collapsed});
    },
    onFacetSelection: function(field, value) {
        SearchActions.selectFacet(field, value);
        SearchActions.termSearch();
    },
	render: function() {
		var self = this;
        if(!this.state.facets || this.state.facets.values.length < 1) {
            return <div></div>
        }
        var chevron = this.state.collapsed ? "<" : ">";
        var collapsedClass = this.state.collapsed ? "collapsed" : "collapsedContainer";
		return (
			<div className="checkboxFacet">
                <div className="facetLabel" onClick={this.toggleCollapse}>
                    {this.props.displayName} {chevron}
                </div>
                <div className={collapsedClass}>
                    {this.state.facets.values.map(function(facet, index){
                        return (
                            <div key={index + 1} className="checkbox">
                                <CheckControl onFacetSelection={self.onFacetSelection.bind(null, self.props.field, facet.value)} selected={facet.selected} value={facet.value} count={facet.count} />
                            </div>
                            )
                    })}
                </div>
				
			</div>
		)
	}
});

module.exports = CheckboxFacetControl;