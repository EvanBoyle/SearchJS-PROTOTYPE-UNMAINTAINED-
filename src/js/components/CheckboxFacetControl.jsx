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
        var collapsedClass = this.state.collapsed ? "indicator glyphicon glyphicon glyphicon-triangle-right" : "indicator glyphicon glyphicon glyphicon-triangle-bottom";
        var collapseID = "collapse" + this.props.facetId;
        var collapseHref = "#" + collapseID;
		return (
            <div className="checkboxFacet panel-body">
                <div className="facetLabel panel-heading">
                    <h4 className="panel-title">
                        <a data-toggle="collapse" href={collapseHref} className="colapseHeader" onClick={this.toggleCollapse}>
                                <span className={collapsedClass} aria-hidden="true"></span> {this.props.displayName}
                        </a>
                    </h4>
                </div>
                <div id={collapseID} className="panel-collapse collapse in" >
                    <ul className="list-group">
                        {this.state.facets.values.map(function(facet, index){
                            return (
                                <li key={index + 1} className="list-group-item">
                                    <div className="checkbox">
                                        <CheckControl onFacetSelection={self.onFacetSelection.bind(null, self.props.field, facet.value)} selected={facet.selected} value={facet.value} count={facet.count} />
                                    </div>
                                </li>
                                )
                        })}
                    </ul>
                </div>
            </div>
		)
	}
});

module.exports = CheckboxFacetControl;