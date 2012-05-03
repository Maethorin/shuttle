function Thrust(engine) {
    this.engine = engine;
    this.instantThrust = 0;
    this.controllerId = 'thrustController-' + this.engine.name;
    this.gaugeId = 'thrust-gauge-' + this.engine.name;
    this.container = $('<div class="thrust"></div>').appendTo(engine.container.find('.controllers'));
    $('<input type="range" class="range" id="' + this.controllerId + '" min="0" max="100" value="0" />').appendTo(this.container);
    $('#' + this.controllerId).rangeinput();
    this.handle = $('#' + this.controllerId).data('rangeinput');
    $('<div class="thrust-gauge"><div id="' + this.gaugeId + '" class="jgauge"></div></div>').appendTo(this.container);
    this.gauge = this.createGauge();
    this.gauge.init();
}

Thrust.prototype.reset = function() {
    this.handle.setValue(0);
    this.instantThrust = 0;
    this.updateGauge();
};

Thrust.prototype.generateThrust = function() {
    this.instantThrust = this.handle.getValue() * this.engine.maxPotency / 100;
    this.updateGauge();
    return this.instantThrust;
};

Thrust.prototype.updateGauge = function() {
    this.gauge.setValue(this.instantThrust);
};

Thrust.prototype.createGauge = function() {
    var thrustGauge = new jGauge(); // Create a new jGauge.
    thrustGauge.id = this.gaugeId; // Link the new jGauge to the placeholder DIV.
    thrustGauge.autoPrefix = autoPrefix.si; // Use SI prefixing (i.e. 1k = 1000).
    thrustGauge.imagePath = 'img/thrust-gauge.png';
    thrustGauge.segmentStart = -225;
    thrustGauge.segmentEnd = 45;
    thrustGauge.width = 170;
    thrustGauge.height = 170;
    thrustGauge.needle.imagePath = 'img/jgauge_needle_taco.png';
    thrustGauge.needle.xOffset = 0;
    thrustGauge.needle.yOffset = 0;
    thrustGauge.label.yOffset = 55;
    thrustGauge.label.color = '#159dca';
    thrustGauge.label.precision = 0; // 0 decimals (whole numbers).
    thrustGauge.label.suffix = ''; // Make the value label watts.
    thrustGauge.ticks.labelRadius = 55;
    thrustGauge.ticks.labelColor = '#0ce';
    thrustGauge.ticks.start = 0;
    thrustGauge.ticks.end = this.engine.maxPotency;
    thrustGauge.ticks.count = 7;
    thrustGauge.ticks.color = 'rgba(0, 0, 0, 0)';
    thrustGauge.ranges = [];
    return thrustGauge;
};