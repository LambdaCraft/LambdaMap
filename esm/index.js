var _excluded = ["serverAPIURI", "pollInterval", "tilesURI", "maps"];

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// import 'core-js/stable'
import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'react-proptypes';
import styled from 'styled-components';
import L from 'leaflet';
import { Map as LMap, Marker, Tooltip, TileLayer, useLeaflet } from 'react-leaflet';
import Sidebar from './Sidebar';
import MouseCoordinates from './MouseCoordinates';
var Container = styled.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  height: 100%;\n  background-color: #000;\n  position: relative;\n\n  & .icon-shadow {\n    filter: drop-shadow(3px 5px 5px #222);\n  }\n"])));

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
  return /*#__PURE__*/React.createElement(React.Fragment, null, players.filter(function (p) {
    return dimension === p.dimension;
  }).map(function (p) {
    return /*#__PURE__*/React.createElement(Marker, {
      position: p.markerPosition,
      icon: p.icon,
      key: p.name
    }, /*#__PURE__*/React.createElement(Tooltip, null, p.name));
  }));
};

var calcLeafletBoundsFromRegBounds = function calcLeafletBoundsFromRegBounds(regionBounds, tileSize) {
  var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.75;
  var minX = regionBounds.minX,
      maxX = regionBounds.maxX,
      minZ = regionBounds.minZ,
      maxZ = regionBounds.maxZ;
  var minMapX = minX * tileSize;
  var minMapY = minZ * tileSize;
  var mapWidth = (maxX + 1 - minX) * tileSize;
  var mapHeight = (maxZ + 1 - minZ) * tileSize;
  return L.latLngBounds(L.latLng(minMapY, minMapX), L.latLng(minMapY + mapHeight, minMapX + mapWidth)).pad(pad);
};

var TileLayerWrapper = function TileLayerWrapper(props) {
  var _useLeaflet = useLeaflet(),
      map = _useLeaflet.map;

  React.useEffect(function () {
    map.options.minZoom = props.minZoom;

    if (props.defaultZoom !== undefined) {
      map.setView(props.defaultCenter || [0, 0], props.defaultZoom);
    } else {
      map.fitBounds(props.bounds);
    }
  }, [props.bounds, props.defaultCenter, props.defaultZoom, props.minZoom]);
  return /*#__PURE__*/React.createElement(TileLayer, props);
};

export var LambdaMap = function LambdaMap(_ref2) {
  var _configs$selectedMap$, _configs$selectedMap$2;

  var serverAPIURI = _ref2.serverAPIURI,
      pollInterval = _ref2.pollInterval,
      tilesURI = _ref2.tilesURI,
      maps = _ref2.maps,
      props = _objectWithoutProperties(_ref2, _excluded);

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      configs = _React$useState2[0],
      setConfigs = _React$useState2[1];

  var _React$useState3 = React.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      players = _React$useState4[0],
      setPlayers = _React$useState4[1];

  var _React$useState5 = React.useState(null),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      error = _React$useState6[0],
      setError = _React$useState6[1];

  var _React$useState7 = React.useState(props.selectedMap || maps[0]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      selectedMap = _React$useState8[0],
      setSelectedMap = _React$useState8[1]; // Fetch map properties for server and dimension


  React.useEffect(function () {
    var abortControl = new AbortController();
    var errorWait = 1000;

    var fetchAll = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var configs, properties;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                configs = {};
                _context.prev = 1;
                _context.next = 4;
                return Promise.all(maps.map(function (name) {
                  return fetchJSON("".concat(tilesURI, "/").concat(name, "/tile.properties.json"), {
                    signal: abortControl.signal
                  }).then(function (props) {
                    return [name, props];
                  });
                }));

              case 4:
                properties = _context.sent;
                properties.forEach(function (_ref4) {
                  var _ref5 = _slicedToArray(_ref4, 2),
                      name = _ref5[0],
                      props = _ref5[1];

                  configs[name] = props;
                });
                setConfigs(configs);
                errorWait = 1000;
                _context.next = 15;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](1);
                console.warn('Failed to get map properties');
                setTimeout(function () {
                  return fetchAll();
                }, errorWait);
                errorWait = Math.min(20000, errorWait * (Math.random() * 0.5 + 1.75));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 10]]);
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
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var status, _players, mapped;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return fetchJSON(serverAPIURI);

              case 3:
                status = _context2.sent;
                _players = status.Players;
                mapped = _players.map(function (p) {
                  return _objectSpread(_objectSpread({}, p), {}, {
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
                setError(null);
                _context2.next = 13;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                setError('Could not get player status');

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 10]]);
      }));

      return function fetchStatus() {
        return _ref6.apply(this, arguments);
      };
    }();

    fetchStatus();
    var interval = setInterval(fetchStatus, pollInterval * 1000);
    return function () {
      return clearInterval(interval);
    };
  }, []);
  var bounds = React.useMemo(function () {
    if (!configs) return;
    var cfg = configs[selectedMap];
    return calcLeafletBoundsFromRegBounds(cfg.regions, cfg.tileSize);
  }, [selectedMap, configs]);
  return configs ? /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("style", null, ".leaflet-container { height: 100%; background-color: #000; }"), /*#__PURE__*/React.createElement(LMap, {
    crs: L.CRS.Simple,
    zoom: 0,
    center: [0, 0],
    maxBounds: bounds,
    maxBoundsViscosity: 0.0
  }, /*#__PURE__*/React.createElement(TileLayerWrapper, {
    url: "".concat(tilesURI, "/").concat(selectedMap, "/z.{z}/r.{x}.{y}.png"),
    attribution: "",
    zoomOffset: 0,
    maxZoom: 1.6,
    maxNativeZoom: 0,
    minZoom: configs[selectedMap].minZoom,
    tileSize: configs[selectedMap].tileSize,
    detectRetina: false,
    updateWhenZooming: false,
    bounds: bounds,
    defaultZoom: (_configs$selectedMap$ = configs[selectedMap].default) === null || _configs$selectedMap$ === void 0 ? void 0 : _configs$selectedMap$.zoom,
    defaultCenter: (_configs$selectedMap$2 = configs[selectedMap].default) === null || _configs$selectedMap$2 === void 0 ? void 0 : _configs$selectedMap$2.center
  }), /*#__PURE__*/React.createElement(PlayerMarkers, {
    players: players,
    dimension: configs[selectedMap].dimension
  }), /*#__PURE__*/React.createElement(MouseCoordinates, null), /*#__PURE__*/React.createElement(Sidebar, {
    players: players,
    maps: maps.map(function (id) {
      return {
        name: configs[id].mapName,
        dimension: configs[id].dimension,
        id: id
      };
    }),
    error: error,
    onMapChange: function onMapChange(sel) {
      setSelectedMap(sel);
    },
    currentMap: selectedMap
  }))) : null;
};
LambdaMap.propTypes = {
  serverAPIURI: PropTypes.string.isRequired,
  maps: PropTypes.arrayOf(PropTypes.string),
  selectedMap: PropTypes.string,
  tilesURI: PropTypes.string,
  pollInterval: PropTypes.number
};
LambdaMap.defaultProps = {
  tilesURI: '/tiles',
  pollInterval: 3
};