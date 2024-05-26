/*!
 * Hype Snapshot Properties Extension
 * Copyright (2024) Max Ziebell, (https://maxziebell.de). MIT-license
 */

/*
 * Version-History
 * 1.0.0 Released under MIT
*/

// Ensure the extension isn't redefined
if ("HypeSnapshotProps" in window === false) {
	window['HypeSnapshotProps'] = (function () {

		// Define default settings for the extension
		var _default = {
			props: 'top,left',
			duration: 1,
			easing: 'easeinout'
		};

		/**
		 * Set or update a default value for the extension.
		 * 
		 * @param {String|Object} key - The default's key or an object with multiple defaults.
		 * @param {*} [value] - The new value for the default, if key is a string.
		 */
		function setDefault(key, value) {
			if (typeof key === 'object') {
				_default = Object.assign(_default, key);
			} else {
				_default[key] = value;
			}
		}

		/**
		 * Get the current value of a default.
		 * 
		 * @param {String} [key] - The key of the default to get. If omitted, all defaults are returned.
		 * @returns {*} The default value(s).
		 */
		function getDefault(key) {
			return key ? _default[key] : _default;
		}

		/**
		 * Snapshot properties for an element.
		 * 
		 * @param {Object} hypeDocument - The Hype document instance.
		 * @param {HTMLElement} element - The element to snapshot.
		 */
		function snapshotProps(hypeDocument, element) {
			var props = element.getAttribute('data-snapshot-props') || _default.props;
			var propsArray = props.split(',').map(function (prop) { return prop.trim(); });

			propsArray.forEach(function (prop) {
				var value = hypeDocument.getElementProperty(element, prop);
				element.setAttribute('data-snapshot-prop-' + prop, value);
			});
		}

		/**
		 * Snapshot properties for an element or all elements within the current scene based on the provided selector.
		 * 
		 * @param {Object} hypeDocument - The Hype document instance.
		 * @param {String|HTMLElement} [selectorOrElement] - The selector string or the element to snapshot. If omitted, selects all elements in the current scene.
		 */
		function snapshotPropsAll(hypeDocument, selectorOrElement) {
			var elements = [];

			if (!selectorOrElement) {
				var container = document.querySelector('#' + hypeDocument.currentSceneId());
				elements = container.querySelectorAll('[data-snapshot-props]');
			} else if (typeof selectorOrElement === 'string') {
				var container = document.querySelector('#' + hypeDocument.currentSceneId());
				var baseElements = container.querySelectorAll(selectorOrElement);
				baseElements.forEach(function (baseElement) {
					if (baseElement.hasAttribute('data-snapshot-props')) {
						elements.push(baseElement);
					}
					var childElements = baseElement.querySelectorAll('[data-snapshot-props]');
					elements = elements.concat(Array.prototype.slice.call(childElements));
				});
			} else {
				elements = [selectorOrElement];
			}

			elements.forEach(function (element) {
				snapshotProps(hypeDocument, element);
			});
		}

		/**
		 * Restore properties for an element or all elements within the current scene based on the provided selector.
		 * 
		 * @param {Object} hypeDocument - The Hype document instance.
		 * @param {String|HTMLElement} [selectorOrElement] - The selector string or the element to restore. If omitted, selects all elements in the current scene.
		 * @param {Object} [options] - Optional overrides for duration, easing, and props.
		 */
		function restoreProps(hypeDocument, selectorOrElement, options) {
			options = options || {};
			var elements = [];

			if (!selectorOrElement) {
				var container = document.querySelector('#' + hypeDocument.currentSceneId());
				elements = container.querySelectorAll('[data-snapshot-props]');
			} else if (typeof selectorOrElement === 'string') {
				var container = document.querySelector('#' + hypeDocument.currentSceneId());
				var baseElements = container.querySelectorAll(selectorOrElement);
				baseElements.forEach(function (baseElement) {
					if (baseElement.hasAttribute('data-snapshot-props')) {
						elements.push(baseElement);
					}
					var childElements = baseElement.querySelectorAll('[data-snapshot-props]');
					elements = elements.concat(Array.prototype.slice.call(childElements));
				});
			} else {
				elements = [selectorOrElement];
			}

			elements.forEach(function (element) {
				var props = options.props || element.getAttribute('data-snapshot-props') || _default.props;
				var propsArray = props.split(',').map(function (prop) { return prop.trim(); });

				var duration = options.duration !== undefined ? options.duration : parseFloat(element.getAttribute('data-snapshot-duration')) || 0.5;
				var easing = options.easing || element.getAttribute('data-snapshot-ease') || _default.easing;

				propsArray.forEach(function (prop) {
					var value = element.getAttribute('data-snapshot-prop-' + prop);
					hypeDocument.setElementProperty(element, prop, value, duration, easing);
				});
			});
		}

		// Hype Document Load handler
		function HypeDocumentLoad(hypeDocument, element, event) {
			hypeDocument.snapshotProps = function (selectorOrElement) {
				snapshotPropsAll(hypeDocument, selectorOrElement);
			};

			hypeDocument.restoreProps = function (selectorOrElement, options) {
				restoreProps(hypeDocument, selectorOrElement, options);
			};
		}

		// Hype Scene Prepare For Display handler
		function HypeScenePrepareForDisplay(hypeDocument, element, event) {
			var elements = element.querySelectorAll('[data-snapshot-props]');
			elements.forEach(function (el) {
				hypeDocument.snapshotProps(el);
			});
		}

		// Register event listeners
		if ("HYPE_eventListeners" in window === false) {
			window.HYPE_eventListeners = Array();
		}
		window.HYPE_eventListeners.push({ "type": "HypeDocumentLoad", "callback": HypeDocumentLoad });
		window.HYPE_eventListeners.push({ "type": "HypeScenePrepareForDisplay", "callback": HypeScenePrepareForDisplay });

		// Public API for the extension
		return {
			version: '1.0.0',
			setDefault: setDefault,
			getDefault: getDefault
		};

	})();
}
