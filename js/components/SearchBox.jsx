var React = require('react');
var SearchStore = require('../stores/SearchStore');
var SearchActions = require('../actions/SearchActions');
var Typeahead = require('react-typeahead-component');


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
        if (evt.keyCode == 13 ) {
            return this.search();
        }
        else {
            var input = evt.target.value
            SearchActions.setInput(input);
            SearchActions.suggest(input, this.props.suggester);
        }
    },
	render: function(){
		
		return (
			<div>
                <Typeahead
                    inputValue={this.state.input}
                    options={this.state.suggestions}
                    onChange={this.handleKeyDown}
                    optionTemplate={this.props.OptionTemplate}
                    onDropdownClose={this.search}
                    onOptionChange={this.handleOptionChange}
                    onOptionClick={this.handleOptionClick}
                    placeholder="Start your search here..."
                />
                <button className="searchButton" type="button" onClick={this.search}><img src={"../../img/searchButton.png"}/></button>
            </div>
			)
	}
});

module.exports = SearchBox;