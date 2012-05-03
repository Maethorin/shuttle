function Odometer(ship) {
    this.ship = ship;
    this.instantSpace = 0;
    this.gauge = this.createGauge();
    this.gauge.init();
}

Odometer.prototype.velocity = function(inKilometer) {
    var resultantVelocity = this.ship.acceleration() * (updateInterval / 1000) + this.ship.instantVelocity;
    this.ship.instantVelocity = resultantVelocity;
    $.sub.publish('ship.odometer.velocityUpdated', resultantVelocity);
    this.updateGauge(resultantVelocity * 3.6);
    if (inKilometer) {
        return (resultantVelocity * 3.6).toFixed(4);
    }
    return resultantVelocity;
};

Odometer.prototype.updateGauge = function(velocity) {
    this.gauge.setValue(velocity);
};

Odometer.prototype.space = function() {
    var resultantSpace = (this.velocity() * (updateInterval / 1000)) + this.instantSpace;
    this.instantSpace = resultantSpace;
    $.sub.publish('ship.odometer.spaceUpdated', resultantSpace);
    return (resultantSpace / 1000).toFixed(4);
};

Odometer.prototype.createGauge = function() {
    var gauge = new jGauge();
    gauge.id = 'odometer';
    gauge.autoPrefix = autoPrefix.si;
    gauge.imagePath = 'img/odometer-gauge.png';
    gauge.segmentStart = -234;
    gauge.segmentEnd = 54;
    gauge.width = 200;
    gauge.height = 200;

    gauge.needle.imagePath = 'img/odometer-needle.png';
    gauge.needle.xOffset = 0;
    gauge.needle.yOffset = 0;

    gauge.label.yOffset = 55;
    gauge.label.color = '#999';
    gauge.label.precision = 1;
    gauge.label.suffix = '';

    gauge.ticks.labelRadius = 59;
    gauge.ticks.labelColor = '#777';
    gauge.ticks.start = 0;
    gauge.ticks.end = 2700;
    gauge.ticks.labelPrecision = 2;
    gauge.ticks.count = 9;
    gauge.ticks.radius = 73;
    gauge.ticks.width = 10;
    gauge.ticks.color = 'rgba(66, 66, 66, 0)';

    var redRange = {
        thickness: 6,
        radius: 75,
        start: -18,
        end: 54,
        color: 'rgba(255, 0, 0, 1)'
    };

    var yellowRange = {
        thickness: 6,
        radius: 75,
        start: -90,
        end: -18,
        color: 'rgba(255, 255, 0, 1)'
    };

    var greenRange = {
        thickness: 6,
        radius: 75,
        start: -234,
        end: -90,
        color: 'rgba(36, 94, 47, 1)'
    };

    gauge.ranges = [redRange, yellowRange, greenRange];

    return gauge;
};
