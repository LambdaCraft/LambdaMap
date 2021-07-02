var _templateObject;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import { useLeaflet } from 'react-leaflet';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
var DisplayBox = styled.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  z-index: 500;\n  margin: 15px;\n  margin-bottom: 40px;\n  color: white;\n  background: rgba(0,0,0,.24);\n  padding: 5px 10px;\n  font-size: 16px;\n"])));
var MouseCoordinates = /*#__PURE__*/React.memo(function () {
  var _React$useState = React.useState('X: ?, Z: ?'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      coord = _React$useState2[0],
      setCoord = _React$useState2[1];

  var _useLeaflet = useLeaflet(),
      map = _useLeaflet.map;

  var cb = React.useCallback(throttle(function (evt) {
    var _evt$latlng = evt.latlng,
        lat = _evt$latlng.lat,
        lng = _evt$latlng.lng;
    setCoord("X: ".concat(Math.round(lng), ", Z: ").concat(-Math.round(lat)));
  }, 16), []);
  React.useEffect(function () {
    map.addEventListener('mousemove', cb);
    return function () {
      map.removeEventListener('mousemove', cb);
    };
  }, []);
  return /*#__PURE__*/React.createElement(DisplayBox, null, coord);
});
export default MouseCoordinates;