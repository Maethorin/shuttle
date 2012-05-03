function getOption(options, option, defaultValue) {
    return options[option] ? options[option] : defaultValue;
}

var engines = [
    {
        fuelConsumePerPeriod: 1,
        maxPotency: 10000,
        tankCapacity: 2000
    },
    {
        fuelConsumePerPeriod: 2,
        maxPotency: 20000,
        tankCapacity: 4000
    },
    {
        fuelConsumePerPeriod: 3,
        maxPotency: 30000,
        tankCapacity: 6000
    },
    {
        fuelConsumePerPeriod: 4,
        maxPotency: 40000,
        tankCapacity: 8000
    }
];

var windDirections = {
    N: 0,
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    ESE: 112.5,
    SE: 135,
    SSE: 157.5,
    S: 180,
    SSW: 202.5,
    SW: 225,
    WSW: 247.5,
    W: 270,
    WNW: 292.5,
    NW: 315,
    NNW: 337.5
};

var updateInterval = 100;

var World = {
    distance: {
        VERTICAL: 0,
        HORIZONTAL: 0
    },
    gravityAcceleration: 9.81,
    windDirection: windDirections.E,
    windVelocity: 0,
    atmosfere: 1,
    temperature: 25
};

var update = null;
var enablingEngine = null;
var delayOperation = null;
var interval = null;
var ship = null;

$(function() {
    update = function() {
        var space = ship.gauges.odometer.space();
//        $('.distance .value').text(space);
        $('.aceleration .value').text(ship.actualAcceleration.toFixed(4));
    };

//    $.sub.subscribe('ship.odometer.velocityUpdated', function(velocity) {
//        $('.velocity .value').text((velocity * 3.6).toFixed(4));
//    });

    $('#fuel-supply').rangeinput();
    $('.fuel-supply-container .slider').removeClass('slider').addClass('fuel-slider');
    var rangeInput = $('#fuel-supply').data('rangeinput');
    rangeInput.setValue(0);

    var engineOptions = engines[$('#engine').val()];
    $('#engine').bind('change', function() {
        engineOptions = engines[$('#engine').val()];
        rangeInput.setValue(0);
        engineOptions.fuelLoaded = rangeInput.getValue() * engineOptions.tankCapacity / 100;
        $('.fuel-supply-container .value').text(engineOptions.fuelLoaded);
    });

    rangeInput.onSlide(function() {
        engineOptions.fuelLoaded = rangeInput.getValue() * engineOptions.tankCapacity / 100;
        $('.fuel-supply-container .value').text(engineOptions.fuelLoaded);
    });

    $('#start').bind('click', function() {
        var $button = $(this);
        if ($button.text() == "Start simulation") {
            if (!ship) {
                ship = new Ship({
                    mass: $('#mass').val(),
                    engines: [
                        new Engine(0, 'engine-1', engineOptions),
                        new Engine(1, 'engine-2', engineOptions)
                    ]
                });
            }
            ship.assemblingEngines();
            $.sub.subscribe('ship.enginesReady', function() {
                if (!interval) {
                    interval = setInterval('update();', updateInterval);
                }
                $button.text('Stop simulation');
            });
        }
        else {
            $(this).text('Start simulation');
            ship.reset();
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            update();
            ship = null;
        }
    });
});
