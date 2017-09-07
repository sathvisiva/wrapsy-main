'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var slugs = require('mongoose-url-slugs');

var FiltersSchema = new Schema({
  label: {
    type: String
  },
  value: [{
    type: String
  }]
});

var CatalogSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: String
  },
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: 'Catalog'
  }],
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Catalog'
  }],
  imageUrl: {
    type: String
  },
  filters: [{
    type: Schema.Types.ObjectId,
    ref: 'Filters'
  }]

});

CatalogSchema.methods = {
  addChild: function addChild(child) {
    var that = this;
    child.parent = this._id;
    child.ancestors = this.ancestors.concat([this._id]);
    return this.model('Catalog').create(child).addCallback(function (child) {
      that.children.push(child._id);
      that.save();
    });
  }
};

CatalogSchema.plugin(slugs('name'));

mongoose.model('Filters', FiltersSchema);

module.exports = mongoose.model('Catalog', CatalogSchema);
//# sourceMappingURL=catalog.model.js.map
