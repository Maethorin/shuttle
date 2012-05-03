function FuelTank(engine) {
    this.engine = engine;
    this.loaded = this.engine.fuelLoaded;
    this.capacity = this.engine.tankCapacity;
    this.createTank();
}

FuelTank.prototype.createTank = function() {
    var _self = this;
    $(['<div class="fuel-tank">',
        '<div id="fuel-indicator-' + this.engine.name + '" class="jgauge"></div>',
    '</div>'].join('')).appendTo(this.engine.container.find('.controllers'));

    this.gauge = this.createGauge();
    this.gauge.init();
};


FuelTank.prototype.createGauge = function() {
    var fuelGauge = new jGauge(); // Create a new jGauge.
    fuelGauge.id = 'fuel-indicator-' + this.engine.name; // Link the new jGauge to the placeholder DIV.
    fuelGauge.autoPrefix = autoPrefix.si; // Use SI prefixing (i.e. 1k = 1000).
    fuelGauge.imagePath = 'img/fuel-gauge.png';
    fuelGauge.segmentStart = -225;
    fuelGauge.segmentEnd = 43;
    fuelGauge.width = 170;
    fuelGauge.height = 170;

    fuelGauge.needle.imagePath = 'img/fuel-needle.png';
    fuelGauge.needle.xOffset = 0;
    fuelGauge.needle.yOffset = 0;

    fuelGauge.label.yOffset = 55;
    fuelGauge.label.color = '#555';
    fuelGauge.label.precision = 1; // 0 decimals (whole numbers).
    fuelGauge.label.suffix = ''; // Make the value label watts.

    fuelGauge.ticks.labelRadius = 59;
    fuelGauge.ticks.labelColor = '#777';
    fuelGauge.ticks.start = 0;
    fuelGauge.ticks.end = this.capacity;
    fuelGauge.ticks.labelPrecision = 2;
    fuelGauge.ticks.count = 5;
    fuelGauge.ticks.radius = 73;
    fuelGauge.ticks.width = 10;
    fuelGauge.ticks.color = 'rgba(66, 66, 66, 1)';

    var redRange = {
        thickness: 6,
        radius: 75,
        start: -225,
        end: -158,
        color: 'rgba(255, 0, 0, 1)'
    };

    var yellowRange = {
        thickness: 6,
        radius: 75,
        start: -158,
        end: -90,
        color: 'rgba(255, 255, 0, 1)'
    };

    var greenRange = {
        thickness: 6,
        radius: 75,
        start: -90,
        end: 43,
        color: 'rgba(36, 94, 47, 1)'
    };

    fuelGauge.ranges = [redRange, yellowRange, greenRange];

    return fuelGauge;
};

FuelTank.prototype.consumeFuel = function(amount) {
    this.loaded -= amount;
    if (this.loaded < 0) {
        this.loaded = 0;
        $.sub.publish(this.engine.name + '.engine.fuelEmpty');
    }
};

FuelTank.prototype.reFuel = function(amount) {
    this.loaded = amount ? amount : this.engine.tankCapacity;
};

FuelTank.prototype.fuelTankFullness = function() {
    var value = this.fuelTank * 100 / this.tankCapacity;
    return value.toFixed(2) + "%";
};

FuelTank.prototype.updateGauge = function() {
    this.gauge.setValue(this.loaded);
};
