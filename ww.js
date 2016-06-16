/**
 * Westwing's core Javascript object that stores (should store) all data and
 * methods used by the website. In its base state, it has methods to easily
 * extend and retrieve properties within itself or other 3rd-party objects and
 * takes care of the instances when they don't exist or when they become
 * available.
 * Examples: ww('aPropertyWithinWw.aDecendantPropertyWithinWw').getValue()
 *           ww('aPropertyFromA3rdPartyObject', a3rdPartyObject).getValue()
 *           ww('$', window).ready(doSomething)
 * @author Hesedel Pajaron <hesedel.pajaron@westwing.de>
 * @author Stefan Firnhammer <stefan.firnhammer@westwing.de>
 * @version 1.0.0
 *            - .apply()
 *            - .call()
 *            - .extend()
 *            - .getType()
 *            - .getValue()
 *            - .ready()
 * @global
 * @property {object} _interval
 * @property {object} _propertiesUnready
 * @property {function} apply
 * @property {function} call
 * @property {function} extend
 * @property {function} getType
 * @property {function} getValue
 * @property {function} ready
 */
var ww = (function () { // jshint ignore:line
  'use strict';

  /**
   * Internal storage of properties which have been called.
   * @type {object}
   * @private
   */
  var _properties = {};

  /**
   * Internal representation of a property.
   * @constructor
   * @private
   * @param {*} value
   * @param {string} path
   * @param {object} context
   * @property {object} context
   * @property {object} id
   * @property {object} path
   * @property {object} type
   * @property {object} value
   */
  var _Property = (function () {

    /**
     * Incrementing ID everytime a new instance is created.
     * @type {number}
     * @private
     */
    var _i = 0;

    return function (value, path, context) {
      this.context = context;
      this.id = _i;
      this.path = path;
      this.type = typeof value;
      this.value = value;
      _properties[_i] = this;
      _i += 1;
    };
  })();

  /**
   * @function
   * @param {*} value
   * @returns {undefined}
   */
  _Property.prototype.update = function (value) {
    this.type = typeof value;
    this.value = value;
  };

  /**
   * Interval for the continual execution of internal processes.
   * @constructor
   * @public
   * @property {function} pause
   * @property {function} resume
   */
  var Interval = (function () {

    /**
     * @type {boolean}
     * @private
     */
    var _isPaused = false;

    /**
     * @function
     * @private
     * @returns {undefined}
     */
    function _callback() {
      if (!_isPaused) {
        PropertiesUnready.process();
      }
      setTimeout(_callback, 1);
    }

    /**
     * @function
     * @public
     * @returns {undefined}
     */
    function pause() {
      _isPaused = true;
    }

    /**
     * @function
     * @public
     * @returns {undefined}
     */
    function resume() {
      _isPaused = false;
    }

    setTimeout(_callback, 1);

    return {
      pause: pause,
      resume: resume
    };
  })();

  /**
   * Properties which were called by the .ready() method and are awaiting
   * resolution.
   * @constructor
   * @public
   * @property {function} getIds
   * @property {function} process
   * @property {function} set
   */
  var PropertiesUnready = (function () { // jshint ignore:line

    /**
     * Internal reference to the properties awaiting resolution and the callback
     * functions assigned to them.
     * @type {object}
     * @private
     */
    var _propertiesUnready = {};

    /**
     * @function
     * @public
     * @returns {array}
     */
    function getIds() {
      var i;
      var ids = [];
      for (i in _propertiesUnready) {
        if (_propertiesUnready.hasOwnProperty(i)) {
          ids.push(i);
        }
      }
      return ids;
    }

    /**
     * @function
     * @public
     * @returns {undefined}
     */
    function process() {
      var i, property, value;
      for (i in _propertiesUnready) {
        if (!_propertiesUnready.hasOwnProperty(i)) {
          continue;
        }
        property = _properties[i];
        value = _getProperty(property.path, property.context);
        if ('undefined' === typeof value) {
          continue;
        }
        property.update(value);
        _propertiesUnready[i](property);
        delete _propertiesUnready[i];
      }
    }

    /**
     * @function
     * @public
     * @param {number} id
     * @param {function} callback
     * @returns {boolean}
     */
    function set(id, callback) {
      if ('number' !== typeof id || 'function' !== typeof callback) {
        return false;
      }
      if (!_properties[id]) {
        return false;
      }
      _propertiesUnready[id] = callback;
      return true;
    }

    return {
      getIds: getIds,
      process: process,
      set: set
    };
  })();

  /**
   * Returns the given context if it is valid or the core ww object if it isn't.
   * @function
   * @private
   * @param {object} context
   * @returns {object|Ww}
   */
  function _getContext(context) {
    if ('object' === typeof context || 'function' === typeof context) {
      return context;
    }
    return Ww;
  }

  /**
   * Returns the property if it exists. If it doesn't exist and extendValue is
   * defined, create the property from extendValue and return it.
   * @function
   * @private
   * @param {string} propertyPathString
   * @param {object} context
   * @param {*} [extendValue]
   * @returns {*}
   */
  function _getProperty(propertyPathString, context, extendValue) {
    var i, property, propertyPathArray, propertyPathArrayLength, propertyPrevious, propertyString;
    var isExtend = 'undefined' !== typeof extendValue;
    propertyPrevious = context;
    propertyPathArray = propertyPathString.split('.');
    propertyPathArrayLength = propertyPathArray.length;
    for (i = 0; i < propertyPathArrayLength; i += 1) {
      propertyString = propertyPathArray[i];
      property = propertyPrevious[propertyString];
      if ('undefined' === typeof property) {
        if (isExtend) {
          propertyPrevious[propertyString] = extendValue;
          propertyPrevious = propertyPrevious[propertyString];
          continue;
        }
        return;
      }
      propertyPrevious = property;
    }
    return propertyPrevious;
  }

  /**
   * Wrapper for the internal property to be returned when ww() is called.
   * @constructor
   * @param {_Property} property
   */
  var ww = function (property) {
    var i;
    for (i in property) {
      if (property.hasOwnProperty(i)) {
        this[i] = property[i];
      }
    }
  };

  /**
   * Executes the value if it's a function, using function's apply method.
   * @function
   * @param {object} valueForThis
   * @param {array} arrayOfArguments
   * @returns {boolean}
   */
  ww.prototype.apply = function (valueForThis, arrayOfArguments) {
    if ('function' !== this.type) {
      return false;
    }
    this.value.apply(valueForThis, arrayOfArguments);
    return true;
  };

  /**
   * Executes the value if it's a function, using function's call method.
   * @function
   * @returns {boolean}
   */
  ww.prototype.call = function () {
    var i, valueForThis;
    var argumentsNew = [];
    if ('function' !== this.type) {
      return false;
    }
    valueForThis = arguments[0];
    delete arguments[0];
    for (i in arguments) {
      if (arguments.hasOwnProperty(i)) {
        argumentsNew.push(arguments[i]);
      }
    }
    this.value.apply(valueForThis, argumentsNew);
    return true;
  };

  /**
   * Extends the context to the path if it doesn't exist and returns it.
   * @function
   * @param {*} [value] - Creates the extension with this.
   * @returns {*}
   */
  ww.prototype.extend = function (value) {
    if ('undefined' === typeof value) {
      value = {};
    }
    return _getProperty(this.path, this.context, value);
  };

  /**
   * Returns the type of the value.
   * @function
   * @returns {string}
   */
  ww.prototype.getType = function () {
    return typeof this.getValue();
  };

  /**
   * Returns the value of the property.
   * @function
   * @param {*} [defaultValue] - Returns this if value is undefined.
   * @returns {*}
   */
  ww.prototype.getValue = function (defaultValue) {
    var value = _getProperty(this.path, this.context);
    if ('undefined' !== typeof value) {
      return value;
    }
    return defaultValue;
  };

  /**
   * Executes a callback function when the property becomes available.
   * @function
   * @param {function} callback
   * @returns {boolean}
   */
  ww.prototype.ready = function (callback) {
    var isCallbackAFunction = 'function' === typeof callback;
    if ('undefined' !== this.type) {
      if (isCallbackAFunction) {
        callback(this);
      }
      return true;
    }
    if (isCallbackAFunction) {
      PropertiesUnready.set(this.id, callback);
    }
    return false;
  };

  /**
   * ...
   * @todo
   * @function
   * @param {*} value
   * @returns {boolean}
   */
  //ww.prototype.setValue = function (value) {};

  /**
   * The ww object itself.
   * @constructor
   * @param {string|number} propertyPathString
   * @param {object} [context]
   * @returns {ww|undefined}
   */
  var Ww = function (propertyPathString, context) { // jshint ignore:line
    var property;
    switch (typeof propertyPathString) {
      case 'string':
        if (!propertyPathString.trim().length) {
          return;
        }
        context = _getContext(context);
        return new ww(new _Property(_getProperty(propertyPathString, context), propertyPathString, context)); // jshint ignore:line
      case 'number':
        property = _properties[propertyPathString];
        if (!property) {
          return;
        }
        return new ww(property); // jshint ignore:line
    }
  };
  Ww._interval = Interval;
  Ww._propertiesUnready = PropertiesUnready;

  return Ww;
})();

ww._tests = (function () {
  var tests = {
    'ww() -> undefined': function () {
      return 'undefined' === typeof ww();
    },
    'ww(\'\') -> undefined': function () {
      return 'undefined' === typeof ww('');
    },
    'ww(\' \') -> undefined': function () {
      return 'undefined' === typeof ww('');
    },
    'value ww(\'nonexistentProperty\').value -> undefined': function () {
      return 'undefined' === typeof ww('nonexistentProperty').value;
    },
    'value ww(\'nonexistentProperty\').getValue() -> undefined': function () {
      return 'undefined' === typeof ww('nonexistentProperty').getValue();
    },
    'value ww(\'nonexistentProperty.nonexistentChildProperty\').value -> undefined': function () {
      return 'undefined' === typeof ww('nonexistentProperty.nonexistentChildProperty').value;
    },
    'value ww(\'nonexistentProperty.nonexistentChildProperty\').getValue() -> undefined': function () {
      return 'undefined' === typeof ww('nonexistentProperty.nonexistentChildProperty').getValue();
    },
    'value ww(\'existentProperty\').value -> existentProperty': function () {
      var mock = {
        existentProperty: true
      };
      return mock.existentProperty === ww('existentProperty', mock).value;
    },
    'value ww(\'existentProperty\').getValue() -> existentProperty': function () {
      var mock = {
        existentProperty: true
      };
      return mock.existentProperty === ww('existentProperty', mock).getValue();
    },
    'value ww(\'existentProperty.nonexistentChildProperty\').value -> undefined': function () {
      var mock = {
        existentProperty: true
      };
      return 'undefined' === typeof ww('existentProperty.nonexistentChildProperty', mock).value;
    },
    'value ww(\'existentProperty.nonexistentChildProperty\').getValue() -> undefined': function () {
      var mock = {
        existentProperty: true
      };
      return 'undefined' === typeof ww('existentProperty.nonexistentChildProperty', mock).getValue();
    },
    'value ww(\'existentProperty.existentChildProperty\').value -> existentChildProperty': function () {
      var mock = {
        existentProperty: {
          existentChildProperty: true
        }
      };
      return mock.existentProperty.existentChildProperty === ww('existentProperty.existentChildProperty', mock).value;
    },
    'value ww(\'existentProperty.existentChildProperty\').getValue() -> existentChildProperty': function () {
      var mock = {
        existentProperty: {
          existentChildProperty: true
        }
      };
      return mock.existentProperty.existentChildProperty === ww('existentProperty.existentChildProperty', mock).getValue();
    },
    'value ww(\'nonexistentProperty\').getValue(value) -> value': function () {
      var mock = {};
      return true === ww('nonexistentProperty', mock).getValue(true);
    },
    'value ww(\'existentProperty\').getValue(value) -> existentProperty': function () {
      var mock = {
        existentProperty: true
      };
      return mock.existentProperty === ww('existentProperty', mock).getValue(false);
    },
    'ww(id) ww(-1) -> undefined': function () {
      return 'undefined' === typeof ww(-1);
    },
    'ww(id) ww(\'existentProperty\').value === ww(ww(\'existentProperty\').id).value': function () {
      var mock = {
        existentProperty: true
      };
      return mock.existentProperty === ww(ww('existentProperty', mock).id).value;
    },
    'Modifying the returned ww object should not affect the internally stored object.': function () {
      var mock = {
        existentProperty: true
      };
      var object = ww('existentProperty', mock);
      object.value = false;
      return true === ww(object.id).value;
    },
    'Modifying the returned ww object should not affect the original object.': function () {
      var mock = {
        existentProperty: true
      };
      ww('existentProperty', mock).value = false;
      return true === ww('existentProperty', mock).value;
    },
    'extend ww(\'nonexistentProperty\').extend() -> nonexistentProperty = {}': function () {
      var mock = {};
      if ('object' !== typeof ww('nonexistentProperty', mock).extend()) {
        return false;
      }
      if ('object' !== ww('nonexistentProperty', mock).type) {
        return false;
      }
      return true;
    },
    'extend ww(\'nonexistentProperty.nonexistentChildProperty\').extend() -> nonexistentChildProperty = {}': function () {
      var mock = {};
      if ('object' !== typeof ww('nonexistentProperty.nonexistentChildProperty', mock).extend()) {
        return false;
      }
      if ('object' !== ww('nonexistentProperty.nonexistentChildProperty', mock).type) {
        return false;
      }
      return true;
    },
    'extend ww(\'existentProperty.nonexistentChildProperty\').extend() -> nonexistentChildProperty = {}': function () {
      var mock = {
        existentProperty: {}
      };
      if ('object' !== typeof ww('existentProperty.nonexistentChildProperty', mock).extend()) {
        return false;
      }
      if ('object' !== ww('existentProperty.nonexistentChildProperty', mock).type) {
        return false;
      }
      return true;
    },
    'extend ww(\'existentProperty\').extend() -> existentProperty': function () {
      var mock = {
        existentProperty: true
      };
      if (mock.existentProperty !== ww('existentProperty', mock).extend()) {
        return false;
      }
      if (mock.existentProperty !== ww('existentProperty', mock).value) {
        return false;
      }
      return true;
    },
    'extend ww(\'existentProperty.existentChildProperty\').extend() -> existentChildProperty': function () {
      var mock = {
        existentProperty: {
          existentChildProperty: true
        }
      };
      if (mock.existentProperty.existentChildProperty !== ww('existentProperty.existentChildProperty', mock).extend()) {
        return false;
      }
      if (mock.existentProperty.existentChildProperty !== ww('existentProperty.existentChildProperty', mock).value) {
        return false;
      }
      return true;
    },
    'extend ww(\'nonexistentProperty\').extend(value) -> nonexistentProperty = value': function () {
      var mock = {};
      if (true !== ww('nonexistentProperty', mock).extend(true)) {
        return false;
      }
      if (true !== ww('nonexistentProperty', mock).value) {
        return false;
      }
      return true;
    },
    'extend ww(\'existentProperty\').extend(value) -> existentProperty': function () {
      var mock = {
        existentProperty: false
      };
      if (mock.existentProperty !== ww('existentProperty', mock).extend(true)) {
        return false;
      }
      if (mock.existentProperty !== ww('existentProperty', mock).value) {
        return false;
      }
      return true;
    },
    'ready ww(\'nonexistentProperty\').ready() -> false': function () {
      return false === ww('nonexistentProperty').ready();
    },
    'ready ww(\'existentProperty\').ready() -> true': function () {
      var mock = {
        existentProperty: true
      };
      return true === ww('existentProperty', mock).ready();
    },
    'ready ww(\'existentProperty\').ready(function(ww){}) -> (function(ww){})() & true': function () {
      var isReady = false;
      var mock = {
        existentProperty: true
      };
      if (true !== ww('existentProperty', mock).ready(function (ww) {
        isReady = true;
      })) {
        return false;
      }
      return isReady;
    },
    'ready method additional tests': function () {
      var isPassed = false;
      var mock = {};
      ww('nonexistentProperty', mock).ready(function (ww) {
        isPassed = true;
      });
      if (1 !== ww._propertiesUnready.getIds().length) {
        return false;
      }
      ww._propertiesUnready.process();
      if (1 !== ww._propertiesUnready.getIds().length) {
        return false;
      }
      mock.nonexistentProperty = true;
      ww._propertiesUnready.process();
      if (0 !== ww._propertiesUnready.getIds().length) {
        return false;
      }
      return isPassed;
    },
    'call ww(\'nonexistentPropertyFunction\').call() -> false': function () {
      return false === ww('nonexistentPropertyFunction').call();
    },
    'call ww(\'existentPropertyFunction\').call() -> existentPropertyFunction() & true': function () {
      var isPassed = false;
      var mock = {
        existentPropertyFunction: function (argument) {
          if (true !== argument) {
            return;
          }
          isPassed = true;
        }
      };
      if (true !== ww('existentPropertyFunction', mock).call(null, true)) {
        return false;
      }
      return isPassed;
    },
    'apply ww(\'nonexistentPropertyFunction\').apply() -> false': function () {
      return false === ww('nonexistentPropertyFunction').apply();
    },
    'apply ww(\'existentPropertyFunction\').apply() -> existentPropertyFunction() & true': function () {
      var isPassed = false;
      var mock = {
        existentPropertyFunction: function (argument) {
          if (true !== argument) {
            return;
          }
          isPassed = true;
        }
      };
      if (true !== ww('existentPropertyFunction', mock).apply(null, [true])) {
        return false;
      }
      return isPassed;
    },
  };

  function run() {
    var i, isPassed;
    var failedCount = 0;
    for (i in tests) {
      isPassed = tests[i]();
      if (!isPassed) {
        failedCount += 1;
      }
      console.log((isPassed ? '[o]' : '[x]') + ' ' + i);
    }
    console.log('[' + failedCount + '] test' + (failedCount !== 1 ? 's' : '') + ' failed.');
  }

  return {
    run: run,
    tests: tests
  };
})();

ww._tests.run();
