function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  list-style-type: none;\n  display: flex;\n  align-items: center;\n  margin: 12px 0;\n  font-size: 18px;\n\n  ", "\n\n  ", "\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  padding: 15px 25px;\n  margin: 0 auto;\n  @media (min-width: 501px) {\n    display: none;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  width: 150px;\n  height: 2px;\n  background-color: white;\n  margin: 0 auto;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  box-sizing: border-box;\n  height: 100%;\n  width: ", "px;\n  top: 0;\n  right: 0;\n  padding: 0 15px;\n  background-color: rgba(0,0,0,0.6);\n  z-index: 500;\n  color: #999;\n  cursor: default;\n\n  & h3 {\n    color: white;\n    font-size: 18px;\n    & svg {\n      vertical-align: text-top;\n      cursor: help;\n    }\n  }\n  transition: transform 0.25s ease;\n  transform: translate3d(0,0,0);\n\n  @media (max-width: 500px) {\n    width: 100%;\n    padding: 0 65px;\n    ", "\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import styled from 'styled-components';
import { MdErrorOutline } from 'react-icons/md';
import { useLeaflet } from 'react-leaflet';
var DRAWER_WIDTH = 200;
var Drawer = styled.div(_templateObject(), DRAWER_WIDTH, function (props) {
  return !props.open ? "\n      transform: translate3d(0,0,0);\n    " : "\n      transform: translate3d(0,calc(100% - 32px),0);\n    ";
});
var Bar = styled.div(_templateObject2());
var ShowMore = styled(function (props) {
  return /*#__PURE__*/React.createElement("div", props, /*#__PURE__*/React.createElement(Bar, null));
})(_templateObject3());
var Avatar = styled.img.attrs(function (_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 24 : _ref$size,
      uuid = _ref.uuid;
  return {
    src: "https://crafatar.com/avatars/".concat(uuid.replace('-', ''), "?size=").concat(size)
  };
})(_templateObject4());
var ListItem = styled.li(_templateObject5(), function (props) {
  return props.active ? "color: #fff;" : '';
}, function (props) {
  return props.onClick ? "\n    cursor: pointer;\n\n    &:hover {\n      color: #fff;\n    }\n  " : '';
});

var PlayerListItem = function PlayerListItem(_ref2) {
  var name = _ref2.name,
      uuid = _ref2.uuid,
      rest = _objectWithoutProperties(_ref2, ["name", "uuid"]);

  return /*#__PURE__*/React.createElement(ListItem, rest, /*#__PURE__*/React.createElement(Avatar, {
    uuid: uuid,
    "aria-hidden": "true",
    style: {
      marginRight: 10
    }
  }), name);
};

var Sidebar = function Sidebar(_ref3) {
  var players = _ref3.players,
      maps = _ref3.maps,
      onMapChange = _ref3.onMapChange,
      currentMap = _ref3.currentMap,
      error = _ref3.error;

  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      open = _React$useState2[0],
      setOpen = _React$useState2[1];

  var leaflet = useLeaflet();
  var cmap = maps.find(function (m) {
    return m.id === currentMap;
  });
  return /*#__PURE__*/React.createElement(Drawer, {
    open: open
  }, /*#__PURE__*/React.createElement(ShowMore, {
    onClick: function onClick() {
      return setOpen(!open);
    }
  }), /*#__PURE__*/React.createElement("h3", null, "Maps"), /*#__PURE__*/React.createElement("ul", null, maps.map(function (map) {
    return /*#__PURE__*/React.createElement(ListItem, {
      key: map.id,
      onClick: function onClick() {
        return onMapChange(map.id);
      },
      active: cmap.id === map.id
    }, map.name);
  })), /*#__PURE__*/React.createElement("h3", null, "Online ", error ? /*#__PURE__*/React.createElement(MdErrorOutline, {
    title: error
  }) : null), /*#__PURE__*/React.createElement("ul", null, players.map(function (p) {
    return /*#__PURE__*/React.createElement(PlayerListItem, {
      onClick: p.dimension === cmap.dimension ? function () {
        leaflet.map.setView(p.markerPosition, 0);
      } : null,
      key: p.UUID,
      name: p.Name,
      uuid: p.UUID,
      active: p.dimension === cmap.dimension
    });
  })));
};

export default Sidebar;