function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import L from 'leaflet';
import './L.TileLayer.NoGap';

var WebMap = /*#__PURE__*/function () {
  function WebMap(server, configs, selected, renderTarget) {
    var _this = this;

    _classCallCheck(this, WebMap);

    _defineProperty(this, "selectTiles", function (sel) {
      var dimension = _this.configs[sel].dimension;
      console.log('REMOVING', _this.selected, _this.dimension);

      _this.map.removeLayer(_this.groups.base[_this.selected]);

      _this.map.removeLayer(_this.groups.players[_this.dimension]);

      _this.map.removeLayer(_this.groups.poi[_this.dimension]);

      console.log('ADDING', sel, dimension);

      _this.map.addLayer(_this.groups.base[sel]);

      _this.map.addLayer(_this.groups.players[dimension]);

      _this.map.addLayer(_this.groups.poi[dimension]);

      _this.selected = sel;
      _this.dimension = dimension;

      _this.configureMap(_this.selected);
    });

    this.groups = {
      base: {},
      poi: {},
      players: {}
    };
    this.server = server;
    this.configs = configs;
    this.selected = selected;
    this.dimension = this.configs[selected].dimension;
    var dimensions = new Set();

    for (var _i = 0, _Object$keys = Object.keys(configs); _i < _Object$keys.length; _i++) {
      var map = _Object$keys[_i];
      var layers = [this.createBaseLayer(map)];
      this.groups.base[map] = L.layerGroup(layers);
      dimensions.add(configs[map].dimension);
    }

    var _iterator = _createForOfIteratorHelper(dimensions),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var dimension = _step.value;
        this.groups.players[dimension] = new L.LayerGroup();
        this.groups.poi[dimension] = new L.LayerGroup();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    this.map = L.map(renderTarget, {
      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
      layers: [this.groups.base[this.selected], this.groups.poi[this.dimension], this.groups.players[this.dimension]]
    });
    this.map.on('baselayerchange', function (e) {
      console.log('CHANGE', e);

      _this.configureMap(e.name);
    });
    this.configureMap();
  }

  _createClass(WebMap, [{
    key: "createBaseLayer",
    value: function createBaseLayer(map) {
      var tileLayer = L.tileLayer("/tiles/".concat(map, "/z.{z}/r.{x}.{y}.png"), {
        attribution: 'LambdaCraft',
        maxZoom: 1.6,
        maxNativeZoom: 0,
        minZoom: this.configs[map].minZoom,
        tileSize: this.configs[map].tileSize,
        zoomOffset: 0,
        defaultZoom: 0,
        bounds: this.getMapBounds(map),
        detectRetina: false,
        updateWhenZooming: false
      });
      return tileLayer;
    }
  }, {
    key: "configureMap",
    value: function configureMap() {
      this.map.setMaxBounds(this.getMapBounds(this.selected));
      this.map.setView([0, 0], 0);
    }
  }, {
    key: "getMapBounds",
    value: function getMapBounds(sel) {
      var cfg = this.configs[sel];
      var ts = cfg.tileSize;
      var minMapX = cfg.regions.minX * ts;
      var minMapY = cfg.regions.minZ * ts;
      var mapWidth = (cfg.regions.maxX + 1 - cfg.regions.minX) * ts;
      var mapHeight = (cfg.regions.maxZ + 1 - cfg.regions.minZ) * ts;
      var bounds = [[minMapX, minMapY], [minMapX + mapWidth, minMapY + mapHeight]];
      console.log(sel, cfg.regions, bounds);
      return bounds;
    }
  }]);

  return WebMap;
}();

export { WebMap as default };