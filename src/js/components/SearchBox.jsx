var React = require('react');
var OptionTemplateGenerator = require('./OptionTemplateGenerator.jsx');
var SearchStore = require('../stores/SearchStore');
var SearchActions = require('../actions/SearchActions');
var Augosuggest = require('react-autosuggest');

var SearchBox = React.createClass({
	getInitialState: function() {
        return {
            input: "",
            suggestions: [],  
        };
    },
    componentDidMount: function() {
        SearchStore.addChangeListener(this.onChange);
        this.onChange();
    },
    onChange: function() {
        var data = SearchStore.getDataForSuggestions();
        this.setState({
            input: data.input,
            suggestions: data.suggestions
        });
    },
    handleKeyDown: function(evt) {
        if (evt.key === "Enter" ) {
            return this.search();
        }
    },
    onSuggestionsFetchRequested: function(value) {
        var input = value.value;
        this.setInput(input)
        SearchActions.suggest(input, this.props.suggester, this.props.searchFields, this.props.preTag, this.props.postTag);
    },
    onSuggestionsClearRequested: function() {
        this.setState({
            suggestions: []
        });   
    },
    onSuggestionSelected: function(event, parameters) {
        this.search();
    },
    getSuggestionValue: function(suggestion) {
        return suggestion.searchText.replace(this.props.preTag,"").replace(this.props.postTag, "");
    },
    renderSuggestion: function(suggestion) {
        var html = this.props.suggestionTemplate.render(suggestion);
        return <div dangerouslySetInnerHTML={{__html: html}} ></div>
    },
    onInputChange: function(event, newValue) {
        if(newValue.method === "up" || newValue.method === "down"){
            return;
        }
        input = newValue.newValue;
        // remove highlight tags for the stored input
        this.setInput(input);
        if(newValue.method === "click" || newValue.method === "enter") {
            this.search();
        }
    },
    setInput: function(input) {
        SearchActions.setInput(input.replace(this.props.preTag,"").replace(this.props.postTag, ""));
    },
    search: function() {
        SearchActions.clearFacetSelections();
        SearchActions.termSearch();
    },
    renderInputComponent: function(inputProps) {
        return (

                <div className="input-group col-md-12 azsearchbox">
                    <input {...inputProps} type="text"></input>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.search}>Search</button>
                    </span>
                </div>

        );  
    },
	render: function(){
        var inputProps = {
            placeholder: 'Start your search here...',
            value: this.state.input,
            onChange: this.onInputChange,
            type: 'search',
            onKeyPress: this.handleKeyDown
        };
        var theme = {
            container:            'react-autosuggest__container col-md-6 col-md-offset-3',
            containerOpen:        'react-autosuggest__container--open',
            input:                'react-autosuggest__input form-control',
            suggestionsContainer: 'react-autosuggest__suggestions-container',
            suggestionsList:      'react-autosuggest__suggestions-list',
            suggestion:           'react-autosuggest__suggestion',
            suggestionFocused:    'react-autosuggest__suggestion--focused',
            sectionContainer:     'react-autosuggest__section-container',
            sectionTitle:         'react-autosuggest__section-title'            
        };
		return (
			<span>
                <Augosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    theme={theme}
                    renderInputComponent={this.renderInputComponent}
                />
            </span>
			)
	}
});

module.exports = SearchBox;