
function Ship(options) {
    if (!options) {
        options = {};
    }
    var _self = this;
    this.mass = getOption(options, 'mass', 1000);
    this.engines = getOption(options, 'engines', []);
    this.actualAcceleration = 0;
    this.instantVelocity = 0;
    this.gauges = {
        odometer: new Odometer(_self),
        altimeter: new Altimeter('#altimeter')
    };
    $.sub.subscribe('ship.odometer.spaceUpdated', function(space) {
        _self.gauges.altimeter.update(space);
    });
}

Ship.prototype.thrust = function() {
    var thrust = 0;
    var enginesWorking = false;
    for (var engine in this.engines) {
        if (this.engines[engine].status) {
            enginesWorking = true;
            thrust += this.engines[engine].thrust.generateThrust();
            this.engines[engine].consumeFuel();
            this.engines[engine].updateGauges();
        }
    }
    if (thrust > 0) {
        this.actualThrust = thrust;
        return thrust;
    }
    if (!enginesWorking) {
        this.resetThrust();
    }
    return 0;
};

Ship.prototype.acceleration = function() {
    this.actualAcceleration = this.thrust() / this.totalMass();
    return this.actualAcceleration;
};

Ship.prototype.totalMass = function() {
    return parseInt(this.mass) + parseInt(this.fuelMass());
};

Ship.prototype.resetThrust = function() {
    this.actualThrust = 0;
    this.stopEngines();
};

Ship.prototype.reset = function() {
    this.resetThrust();
    this.reFuel();
    this.desassemblingEngines();
    this.gauges.altimeter.desassembling();
    this.actualAcceleration = 0;
    this.instantVelocity = 0;
    this.gauges.odometer.instantSpace = 0;
    this.gauges.odometer.instantVelocity = 0;
};

Ship.prototype.startEngines = function() {
    for (var engine in this.engines) {
        this.engines[engine].start();
    }
};

Ship.prototype.stopEngines = function() {
    for (var engine in this.engines) {
        this.engines[engine].stop();
    }
};

Ship.prototype.reFuel = function() {
    for (var engine in this.engines) {
        this.engines[engine].reFuel();
    }
};

Ship.prototype.consumeFuel = function() {
    for (var engine in this.engines) {
        this.engines[engine].consumeFuel();
    }
};

Ship.prototype.fuelMass = function() {
    var fuelMass = 0;
    for (var engine in this.engines) {
        fuelMass += this.engines[engine].fuelTank.loaded;
    }
    return fuelMass;
};

Ship.prototype.desassemblingEngines = function() {
    for (var engine in this.engines) {
        this.engines[engine].desassembling();
    }
};

Ship.prototype.assemblingEngines = function() {
    var _self = this;
    _self.enginesReady = 0;
    for (var engine in this.engines) {
        $.sub.subscribe(this.engines[engine].name + '.engine.ready', function() {
            _self.enginesReady++;
            if (_self.enginesReady == _self.engines.length) {
                $.sub.publish('ship.enginesReady');
            }
        });
        this.engines[engine].assembling();
    }
};
