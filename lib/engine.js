engineStatus = {
    OFF: 0,
    ON: 1
};

function Engine(index, name, options) {
    if (!options) {
        options = {};
    }
    this.initializeInternals(index, name, options);
}

Engine.prototype.initializeInternals = function(index, name, options) {
    this.index = index;
    this.name = name;
    this.status = engineStatus.OFF;
    this.fuelConsumePerPeriod = getOption(options, 'fuelConsumePerPeriod', 1);
    this.maxPotency = getOption(options, 'maxPotency', 10000);
    this.tankCapacity = getOption(options, 'tankCapacity', 2000);
    this.fuelLoaded = getOption(options, 'fuelLoaded', this.tankCapacity);
};

Engine.prototype.assembling = function() {
    this.createContainer();
    this.createStarterButton();
    this.createThrust();
    this.createFuelTank();
    this.updateGauges();
    this.delayTime = 0;
    this.operation = setInterval('ship.engines[' + this.index + '].enablingEngine();', 500);
};

Engine.prototype.desassembling = function() {
    this.container.remove();
    this.container = null;
};

Engine.prototype.createContainer = function() {
    this.container = $('<li class="engine"></li>');
    this.container.appendTo("ul.engines");
    $('<div class="controllers"></div>').appendTo(this.container);
};

Engine.prototype.createStarterButton = function() {
    var _self = this;
    this.starter = $('<button class="start-engine" disabled="disabled">DISABLE</button>');
    this.starter.appendTo(this.container);
    this.starter.bind('click', function() {
        _self.activatingButton();
    });
};

Engine.prototype.createThrust = function() {
    this.thrust = new Thrust(this);
};

Engine.prototype.createFuelTank = function() {
    var _self = this;
    $.sub.subscribe(this.name + '.engine.fuelEmpty', function() {
        _self.stop();
    });
    this.fuelTank = new FuelTank(this);
};

Engine.prototype.createFuelGauge = function() {
    var fuelGauge = new jGauge();
    fuelGauge.id = 'fuel-indicator-' + this.name;
    fuelGauge.autoPrefix = autoPrefix.si;
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
    fuelGauge.label.precision = 1;
    fuelGauge.label.suffix = '';

    fuelGauge.ticks.labelRadius = 59;
    fuelGauge.ticks.labelColor = '#777';
    fuelGauge.ticks.start = 0;
    fuelGauge.ticks.end = this.tankCapacity;
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

Engine.prototype.consumeFuel = function() {
    this.fuelTank.consumeFuel(this.fuelConsumeTax());
};

Engine.prototype.fuelConsumeTax = function() {
    if (this.thrust.instantThrust == 0) {
        return 0.05;
    }
    return this.fuelConsumePerPeriod * this.thrust.instantThrust / this.maxPotency;
};

Engine.prototype.start = function() {
    this.status = engineStatus.ON;
    this.turningButtonOn();
    $.sub.publish(this.name + '.engine.started');
};

Engine.prototype.stop = function() {
    this.status = engineStatus.OFF;
    this.thrust.reset();
    this.updateGauges();
    this.turningButtonOff();
    $.sub.publish(this.name + '.engine.stoped');
};

Engine.prototype.turningButtonOff = function() {
    this.starter.removeClass('green');
    this.starter.addClass('red');
    this.starter.text("OFF");
};

Engine.prototype.turningButtonOn = function() {
    this.starter.removeClass('red');
    this.starter.addClass('green');
    this.starter.text("ON");
};


Engine.prototype.reFuel = function(amount) {
    this.fuelTank.reFuel(amount);
};

Engine.prototype.updateGauges = function() {
    this.fuelTank.updateGauge();
};

Engine.prototype.delayOperation = function(callback) {
    this.delayTime++;
    this.starter.toggleClass('green red');
    if (this.delayTime >= 6) {
        clearInterval(this.operation);
        callback();
    }
};

Engine.prototype.starting = function() {
    var _self = this;
    this.delayOperation(function() { _self.start(); });
};

Engine.prototype.stoping = function() {
    var _self = this;
    this.delayOperation(function() { _self.stop(); });
};

Engine.prototype.activatingButton = function() {
    this.delayTime = 0;
    if (this.starter.hasClass('red')) {
        this.operation = setInterval('ship.engines[' + this.index + '].starting();', 500);
    }
    else {
        this.operation = setInterval('ship.engines[' + this.index + '].stoping();', 500);
    }
};

Engine.prototype.enablingEngine = function() {
    var _self = this;
    this.delayTime++;
    this.starter.toggleClass('red');
    if (this.delayTime >= 10) {
        clearInterval(_self.operation);
        $.sub.publish(_self.name + ".engine.ready");
        _self.starter.removeAttr('disabled');
        _self.starter.addClass('red');
        _self.starter.text('OFF');
    }
};
