function getScripts(server, dimension, callback) {
    console.log("loading scripts");
    let scripts = [
        server + "/" + dimension + '/lambda.markers.js',
        server + "/" + dimension + '/lambda.players.js',
        server + "/" + dimension + '/unmined.map.properties.js',
        server + "/" + dimension + '/unmined.map.regions.js'
    ];
    var progress = 0;
    scripts.forEach(function(script) {
        $.getScript(script, function () {
            if (++progress === scripts.length) {
                callback();
            }
        });
    });
}

var mapsPlaceholder = [];
var markersLayer = new L.LayerGroup();

function Loaded(server, dimension) {
    if (this.dimension === dimension && this.server === server) {
        return;
    }

    this.dimension = dimension;
    this.server = server;
    getScripts(server, dimension, function (data, textStatus) {
        document.title = UnminedMapProperties.worldName + " - uNmINeD map browser";

        var unmined = new Unmined();
        unmined.map(server, dimension, 'map', UnminedMapProperties, UnminedMapRegions, markersLayer);
    });
}

function ChangeDimension(dimension) {
  Loaded(this.server, dimension);
}

L.Map.addInitHook(function () {
    mapsPlaceholder.push(this);
});

function onReady() {
    Loaded('tech', 'overworld');
}
