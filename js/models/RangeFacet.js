function RangeFacet(key, min, max) {
    this.key = key;
    this.min = min;
    this.max = max;
    this.lowerBound = min;
    this.upperBound = max;
    this.lowerBucketCount = 0;
    this.middleBucketCount = 0;
    this.upperBucketCount = 0;
}

RangeFacet.prototype.getFilter = function() {
    // if the control is untouched, don't provide a filter
    // not add entries have this field, so we don't want to filter them out unless the user specifies it
    if(this.min === this.lowerBound && this.max === this.upperBound) {
        return null;
    }
    
    return "";
}

RangeFacet.prototype.setValues = function(newValues) {
   this.lowerBound = this.min;
   this.upperBound = this.max;
   this.lowerBucketCount = 0;
   this.upperBucketCount = 0;
   this.middleBucketCount = newValues[1].count;
}

RangeFacet.prototype.updateValues = function(newValues) {
    this.lowerBucketCount = newValues[0].count;
    this.middleBucketCount = newValues[1].count;
    this.upperBucketCount = newValues[2].count;
}

RangeFacet.prototype.getFacetClause = function() {
    return this.key + ',values:' + this.lowerBound + '|' + this.upperBound;    
}


module.exports = RangeFacet;