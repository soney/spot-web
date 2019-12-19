webpackJsonp([221374088121123],{

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

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(4);
	const gatsby_link_1 = __webpack_require__(100);
	class default_1 extends React.Component {
	    constructor(props, context) {
	        super(props, context);
	    }
	    render() {
	        const { data } = this.props;
	        return React.createElement("div", null, React.createElement("h1", null, "Hi worldy!"), React.createElement("ul", null, data.allStrapiPerson.edges.map(document => React.createElement("li", { key: document.node.id }, React.createElement(gatsby_link_1.default, { to: `${document.node.id}` }, document.node.given_name, " ", document.node.family_name)))), React.createElement(gatsby_link_1.default, { to: "/page-2/" }, "Go to page 2"));
	    }
	}
	exports.default = default_1;
	// export const pageQuery = graphql`
	//   query IndexQuery {
	//     site {
	//       siteMetadata {
	//         title
	//       }
	//     }
	//   }
	// `
	exports.pageQuery = "** extracted graphql fragment **";

/***/ })

});
//# sourceMappingURL=component---src-pages-index-tsx-2a3b0eb9202e80806435.js.map