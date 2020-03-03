function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 100%;\n  background-color: #000;\n  position: relative;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// import 'core-js/stable'
import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'react-proptypes';
import styled from 'styled-components';
import L from 'leaflet';
import { Map as LMap, Marker, Tooltip, TileLayer } from 'react-leaflet';
import Sidebar from './Sidebar';
var Stretch = styled.div(_templateObject());

var fetchJSON = function fetchJSON() {
  return fetch.apply(void 0, arguments).then(function (r) {
    return r.json();
  });
};

var getPlayerName = function getPlayerName(p) {
  return "".concat(p.IsBot ? '[Bot]' : '').concat(p.Name);
};

var PlayerMarkers = function PlayerMarkers(_ref) {
  var players = _ref.players,
      dimension = _ref.dimension;
  return React.createElement(React.Fragment, null, players.filter(function (p) {
    return dimension === p.dimension;
  }).map(function (p) {
    return React.createElement(Marker, {
      position: p.markerPosition,
      icon: p.icon,
      key: p.name
    }, React.createElement(Tooltip, null, p.name));
  }));
};

export var LambdaMap = function LambdaMap(_ref2) {
  var serverAPIURI = _ref2.serverAPIURI,
      tilesDir = _ref2.tilesDir,
      props = _objectWithoutProperties(_ref2, ["serverAPIURI", "tilesDir"]);

  var mapRef = React.useRef(null);

  var _React$useState = React.useState(props.maps),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      maps = _React$useState2[0];

  var _React$useState3 = React.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      configs = _React$useState4[0],
      setConfigs = _React$useState4[1];

  var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      players = _React$useState6[0],
      setPlayers = _React$useState6[1];

  var _React$useState7 = React.useState(props.selectedMap || maps[0]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      selectedMap = _React$useState8[0],
      setSelectedMap = _React$useState8[1]; // Fetch map properties for server and dimension


  React.useEffect(function () {
    var abortControl = new AbortController();

    var fetchAll = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var configs, i, properties;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                configs = {};
                i = 0;

              case 2:
                if (!(i < maps.length)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 5;
                return fetchJSON("".concat(tilesDir, "/").concat(maps[i], "/tile.properties.json"), {
                  signal: abortControl.signal
                });

              case 5:
                properties = _context.sent;
                configs[maps[i]] = properties;

              case 7:
                i++;
                _context.next = 2;
                break;

              case 10:
                console.log(configs);
                setConfigs(configs);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function fetchAll() {
        return _ref3.apply(this, arguments);
      };
    }();

    fetchAll();
    return function () {
      abortControl.abort();
    };
  }, [maps]);
  React.useEffect(function () {
    var fetchStatus = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var status, players, mapped;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetchJSON(serverAPIURI);

              case 2:
                status = _context2.sent;
                players = status.Players;
                mapped = players.map(function (p) {
                  return _objectSpread({}, p, {
                    icon: L.icon({
                      iconUrl: "https://crafatar.com/renders/body/".concat(p.UUID.replace('-', ''), "?scale=1"),
                      iconSize: [20, 45],
                      iconAnchor: [10, 45],
                      className: 'icon-shadow'
                    }),
                    markerPosition: [-p.Z, p.X],
                    position: [p.X, p.Z],
                    dimension: p.Dimension.split(':')[1],
                    name: "".concat(getPlayerName(p), ": (").concat(Math.round(p.X), ", ").concat(Math.round(p.Z), ")")
                  });
                });
                setPlayers(mapped);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function fetchStatus() {
        return _ref4.apply(this, arguments);
      };
    }();

    fetchStatus();
    var interval = setInterval(fetchStatus, 20000);
    return function () {
      return clearInterval(interval);
    };
  }, []);

  var getMapBounds = function getMapBounds(sel) {
    var cfg = configs[sel];
    var ts = cfg.tileSize;
    var minMapX = cfg.regions.minX * ts;
    var minMapY = cfg.regions.minZ * ts;
    var mapWidth = (cfg.regions.maxX + 1 - cfg.regions.minX) * ts;
    var mapHeight = (cfg.regions.maxZ + 1 - cfg.regions.minZ) * ts;
    var bounds = [[minMapX, minMapY], [minMapX + mapWidth, minMapY + mapHeight]];
    return bounds;
  };

  React.useEffect(function () {
    if (!mapRef.current) return;
    var leafmap = mapRef.current.leafletElement;
    leafmap.options.minZoom = configs[selectedMap].minZoom;
    leafmap.setView([0, 0], 0);
  }, [mapRef.current, selectedMap]);
  return configs ? React.createElement(Stretch, null, React.createElement("style", null, ".leaflet-container { height: 100%; background-color: #000; }"), React.createElement(LMap, {
    ref: mapRef,
    crs: L.CRS.Simple,
    center: [0, 0],
    zoom: 0,
    maxBounds: getMapBounds(selectedMap)
  }, React.createElement(TileLayer, {
    url: "".concat(tilesDir, "/").concat(selectedMap, "/z.{z}/r.{x}.{y}.png"),
    attribution: "",
    zoomOffset: 0,
    maxZoom: 1.6,
    maxNativeZoom: 0,
    minZoom: configs[selectedMap].minZoom,
    tileSize: configs[selectedMap].tileSize,
    detectRetina: false,
    updateWhenZooming: false,
    bounds: getMapBounds(selectedMap)
  }), React.createElement(PlayerMarkers, {
    players: players,
    dimension: configs[selectedMap].dimension
  })), React.createElement(Sidebar, {
    players: players,
    maps: maps,
    onMapChange: function onMapChange(sel) {
      setSelectedMap(configs[sel].mapName);
    },
    currentMap: selectedMap
  })) : null;
};
LambdaMap.propTypes = {
  serverAPIURI: PropTypes.string.isRequired,
  maps: PropTypes.arrayOf(PropTypes.string),
  selectedMap: PropTypes.string,
  tilesDir: PropTypes.string
};
LambdaMap.defaultProps = {
  tilesDir: '/tiles'
};