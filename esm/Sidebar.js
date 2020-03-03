function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  list-style-type: none;\n  display: flex;\n  align-items: center;\n  margin: 12px 0;\n  font-size: 18px;\n\n  ", "\n\n  ", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  height: 100%;\n  width: ", "px;\n  top: 0;\n  right: 0;\n  padding: 0 15px;\n  background-color: rgba(0,0,0,0.6);\n  z-index: 500;\n  color: #999;\n\n  & h3 {\n    color: white;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import styled from 'styled-components';
var DRAWER_WIDTH = 200;
var Drawer = styled.div(_templateObject(), DRAWER_WIDTH);
var Avatar = styled.img.attrs(function (_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 24 : _ref$size,
      uuid = _ref.uuid;
  return {
    src: "https://crafatar.com/avatars/".concat(uuid.replace('-', ''), "?size=").concat(size)
  };
})(_templateObject2());
var ListItem = styled.li(_templateObject3(), function (props) {
  return props.active ? "color: #fff;" : '';
}, function (props) {
  return props.onClick ? "\n    cursor: pointer;\n\n    &:hover {\n      color: #fff;\n    }\n  " : '';
});

var PlayerListItem = function PlayerListItem(_ref2) {
  var name = _ref2.name,
      uuid = _ref2.uuid,
      rest = _objectWithoutProperties(_ref2, ["name", "uuid"]);

  return React.createElement(ListItem, rest, React.createElement(Avatar, {
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
      currentMap = _ref3.currentMap;
  // const [open, setOpen] = React.useState(true)
  return React.createElement(Drawer, null, React.createElement("h3", null, "Maps"), React.createElement("ul", null, maps.map(function (name) {
    return React.createElement(ListItem, {
      key: name,
      onClick: function onClick() {
        return onMapChange(name);
      },
      active: currentMap === name
    }, name);
  })), React.createElement("h3", null, "Online"), React.createElement("ul", null, players.map(function (p) {
    return React.createElement(PlayerListItem, {
      key: p.UUID,
      name: p.Name,
      uuid: p.UUID,
      active: p.dimension === currentMap
    });
  })));
};

export default Sidebar;