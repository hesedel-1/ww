ww._tests = (function () {
  var tests = {
    'ww() -> undefined': function () {
      return 'undefined' === typeof ww();
    },
    'ww(\'\') -> undefined': function () {
      return 'undefined' === typeof ww('');
    },
    'ww(\' \') -> undefined': function () {
      return 'undefined' === typeof ww(' ');
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
    'extend ww(\'nonexistentProperty.nonexistentChildProperty\').extend(value) -> nonexistentChildProperty = value': function () {
      var mock = {};
      if (true !== ww('nonexistentProperty.nonexistentChildProperty', mock).extend(true)) {
        return false;
      }
      if (true !== ww('nonexistentProperty.nonexistentChildProperty', mock).value) {
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
    'extend ww(\'existentProperty.nonexistentChildProperty\').extend(value) -> value': function () {
      var mock = {
        existentProperty: {}
      };
      if (true !== ww('existentProperty.nonexistentChildProperty', mock).extend(true)) {
        return false;
      }
      if (true !== ww('existentProperty.nonexistentChildProperty', mock).value) {
        return false;
      }
      return true;
    },
    'extend ww(\'existentProperty.existentChildProperty\').extend(value) -> existentChildProperty': function () {
      var mock = {
        existentProperty: {
          existentChildProperty: false
        }
      };
      if (false !== ww('existentProperty.existentChildProperty', mock).extend(true)) {
        return false;
      }
      if (false !== ww('existentProperty.existentChildProperty', mock).value) {
        return false;
      }
      return true;
    },
    'extend method additional tests': function () {
      var mock = {
        existentProperty: {
          existentChildProperty: false
        }
      };
      ww('existentProperty', mock).extend({
        existentChildProperty: true
      });
      if (false !== ww('existentProperty.existentChildProperty', mock).value) {
        return false;
      }
      ww('existentProperty', mock).extend({
        existentChildProperty2: true
      });
      if (true !== ww('existentProperty.existentChildProperty2', mock).value) {
        return false;
      }
      ww('existentProperty', mock).extend({
        existentChildProperty: true,
        existentChildProperty2: false,
        existentChildProperty3: true
      });
      if (false !== ww('existentProperty.existentChildProperty', mock).value || true !== ww('existentProperty.existentChildProperty2', mock).value || true !== ww('existentProperty.existentChildProperty3', mock).value) {
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
        if (typeof mock.nonexistentProperty !== typeof ww.value) {
          isPassed = false;
          return;
        }
        isPassed = true;
      });
      ww('nonexistentProperty.nonexistentChildProperty', mock).ready(function (ww) {
        if (typeof mock.nonexistentProperty !== typeof ww.parent) {
          isPassed = false;
          return;
        }
        if (mock.nonexistentProperty.nonexistentChildProperty !== ww.value) {
          isPassed = false;
          return;
        }
        isPassed = true;
      });
      if (2 !== ww._propertiesUnready.getIds().length) {
        return false;
      }
      ww._propertiesUnready.process();
      if (2 !== ww._propertiesUnready.getIds().length) {
        return false;
      }
      mock.nonexistentProperty = {
        nonexistentChildProperty: true
      };
      ww._propertiesUnready.process();
      if (0 !== ww._propertiesUnready.getIds().length) {
        return false;
      }
      return isPassed;
    },
    'call ww(\'nonexistentPropertyFunction\').call() -> false': function () {
      return false === ww('nonexistentPropertyFunction').call();
    },
    'call ww(\'existentPropertyFunction\').call() -> existentPropertyFunction()': function () {
      var isPassed = false;
      var mock = {
        existentPropertyFunction: function (argument) {
          if (true !== argument) {
            return;
          }
          isPassed = true;
          return true;
        }
      };
      if (true !== ww('existentPropertyFunction', mock).call(null, true)) {
        return false;
      }
      return isPassed;
    },
    'call ww(\'existentPropertyFunction\').call() and `this`': function () {
      var mock = new Mock();
      function Mock() {
        this.existentProperty = true;
      }
      Mock.prototype.existentPropertyFunction = function () {
        return this.existentProperty;
      };
      return mock.existentProperty === ww('existentPropertyFunction', mock).call();
    },
    'apply ww(\'nonexistentPropertyFunction\').apply() -> false': function () {
      return false === ww('nonexistentPropertyFunction').apply();
    },
    'apply ww(\'existentPropertyFunction\').apply() -> existentPropertyFunction()': function () {
      var isPassed = false;
      var mock = {
        existentPropertyFunction: function (argument) {
          if (true !== argument) {
            return;
          }
          isPassed = true;
          return true;
        }
      };
      if (true !== ww('existentPropertyFunction', mock).apply(null, [true])) {
        return false;
      }
      return isPassed;
    },
    'apply ww(\'existentPropertyFunction\').apply() and `this`': function () {
      var mock = new Mock();
      function Mock() {
        this.existentProperty = true;
      }
      Mock.prototype.existentPropertyFunction = function () {
        return this.existentProperty;
      };
      return mock.existentProperty === ww('existentPropertyFunction', mock).apply();
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
