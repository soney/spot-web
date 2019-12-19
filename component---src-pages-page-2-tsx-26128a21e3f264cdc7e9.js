webpackJsonp([162758589048507],{

/***/ 101:
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    getDerivedStateFromProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};
	
	var KNOWN_STATICS = {
	    name: true,
	    length: true,
	    prototype: true,
	    caller: true,
	    callee: true,
	    arguments: true,
	    arity: true
	};
	
	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
	
	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
	    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
	
	        if (objectPrototype) {
	            var inheritedComponent = getPrototypeOf(sourceComponent);
	            if (inheritedComponent && inheritedComponent !== objectPrototype) {
	                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
	            }
	        }
	
	        var keys = getOwnPropertyNames(sourceComponent);
	
	        if (getOwnPropertySymbols) {
	            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
	        }
	
	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
	                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
	                try { // Avoid failures from read-only properties
	                    defineProperty(targetComponent, key, descriptor);
	                } catch (e) {}
	            }
	        }
	
	        return targetComponent;
	    }
	
	    return targetComponent;
	}
	
	module.exports = hoistNonReactStatics;


/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isProduction = ("production") === 'production';
	var prefix = 'Invariant failed';
	function invariant(condition, message) {
	  if (condition) {
	    return;
	  }
	
	  if (isProduction) {
	    throw new Error(prefix);
	  } else {
	    throw new Error(prefix + ": " + (message || ''));
	  }
	}
	
	module.exports = invariant;


/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isProduction = ("production") === 'production';
	function warning(condition, message) {
	  if (!isProduction) {
	    if (condition) {
	      return;
	    }
	
	    var text = "Warning: " + message;
	
	    if (typeof console !== 'undefined') {
	      console.warn(text);
	    }
	
	    try {
	      throw Error(text);
	    } catch (x) {}
	  }
	}
	
	module.exports = warning;


/***/ }),

/***/ 201:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(4);
	const gatsby_link_1 = __webpack_require__(100);
	const SecondPage = () => React.createElement("div", null, React.createElement("h1", null, "Hi from the second page"), React.createElement("p", null, "Welcome to page 2"), React.createElement(gatsby_link_1.default, { to: "/" }, "Go back to the homepage"));
	exports.default = SecondPage;

/***/ })

});
//# sourceMappingURL=component---src-pages-page-2-tsx-26128a21e3f264cdc7e9.js.map