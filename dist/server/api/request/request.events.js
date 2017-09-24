/**
 * Request model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Request = require('./request.model');
var RequestEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
RequestEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Request.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    RequestEvents.emit(event + ':' + doc._id, doc);
    RequestEvents.emit(event, doc);
  };
}

exports['default'] = RequestEvents;
module.exports = exports['default'];
//# sourceMappingURL=request.events.js.map
