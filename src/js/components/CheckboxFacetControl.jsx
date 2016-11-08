var React = require("react");
var CheckControl = require("./CheckControl.jsx");
var SearchStore = require("../stores/SearchStore.js");
var SearchActions = require("../actions/SearchActions");
var DefaultCssClasses = require('../utils/DefaultCssClasses');
var Constants = require('../constants/SearchConstants');
var assign = require('object-assign');

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
        var cssClasses = assign(DefaultCssClasses[Constants.SEARCHFACETS], this.props.cssClasses);
        
		var self = this;
        if(!this.state.facets || this.state.facets.values.length < 1) {
            return <div></div>
        }
        
        var collapsedClass = this.state.collapsed ? cssClasses.searchFacets__facetHeaderIconCollapsed : cssClasses.searchFacets__facetHeaderIconOpen;
        var collapseID = "collapse" + this.props.facetId;
        var collapseHref = "#" + collapseID;
		return (
            <div className={cssClasses.searchFacets__checkboxFacet}>
                <div className={cssClasses.searchFacets__facetHeaderContainer}>
                    <h4 className={cssClasses.searchFacets__facetHeader}>
                        <a data-toggle="collapse" href={collapseHref} className={cssClasses.searchFacets__facetHeaderLink} onClick={this.toggleCollapse}>
                                <span className={collapsedClass} aria-hidden="true"></span> {this.props.displayName}
                        </a>
                    </h4>
                </div>
                <div id={collapseID} className={cssClasses.searchFacets__facetControlContainer}>
                    <ul className={cssClasses.searchFacets__facetControlList}>
                        {this.state.facets.values.map(function(facet, index){
                            return (
                                <li key={index + 1} className={cssClasses.searchFacets__facetControl}>
                                    <div className={cssClasses.searchFacets__facetControlCheckboxWrapper}>
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