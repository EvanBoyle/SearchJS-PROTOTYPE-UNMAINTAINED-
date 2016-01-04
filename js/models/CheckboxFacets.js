function CheckboxFacets(key, isNumeric) {
    this.values = [];
    this.key = key;
    this.filter = ""
    this.isNumeric =  isNumeric;
}

CheckboxFacets.prototype.getFilter = function() {
    var filter = "";
	var prefix = " " + this.key + " eq ";
	
	var filteredElements = this.values.filter(function(value) {
            return value.selected;
        });
		
	if(filteredElements.length === 0) {
		return null;
	}
	 
	for(var i = 0; i<filteredElements.length; i++) {
		var result = "";
		if(i > 0) {
			result += " or ";
		}
        if(this.isNumeric) {
            result += prefix  + filteredElements[i].value ;
        }
        else {
            result += prefix + "'" + filteredElements[i].value + "'";
        }

		filter += result;
	}
    
    return "(" + filter + ")";
}

CheckboxFacets.prototype.setValues = function(newValues) {
    var values = newValues.map(function(facet, index) {
        facet.selected = false;
        return facet;
    });
    this.values = values;
}

CheckboxFacets.prototype.updateValues = function(newValues) {
    var values = newValues.map(function(facet, index) {
        facet.selected = false;
        return facet;
    });
    var valuesToAdd = [];
    var self = this;
    values.forEach(function(newValue) {
        // find corresponding old value
       var oldValue = self.values.find(function(value) {
           return value.value === newValue.value;
       });
       // if it exists update count
       if(oldValue) {
           oldValue.count = newValue.count;
       }
       // otherwise add a new element
       else {
           valuesToAdd.push(newValue);
       }
    });
    // combine old values with new values
    var updatedValues = this.values.concat(valuesToAdd);
    this.values = updatedValues;
}

CheckboxFacets.prototype.getFacetClause = function() {
    return this.key + ',count:5,sort:count';    
}


module.exports = CheckboxFacets;