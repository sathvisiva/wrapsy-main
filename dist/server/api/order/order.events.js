/**
 * Order model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Order = require('./order.model');
var OrderEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
OrderEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Order.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    OrderEvents.emit(event + ':' + doc._id, doc);
    OrderEvents.emit(event, doc);
  };
}

exports['default'] = OrderEvents;
module.exports = exports['default'];
//# sourceMappingURL=order.events.js.map
