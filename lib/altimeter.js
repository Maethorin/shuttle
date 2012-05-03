function Altimeter(containerSelector) {
    this.container = $('<div id="altimeter"></div>');
    this.container.appendTo('#ship .distance');
    this.container.addClass('altimeter-indicator');
    $('<img id="meter-needle" src="img/altimeter-gauge-meter-needle.png" alt="" />').appendTo(this.container);
    $('<img id="kmeter-needle" src="img/altimeter-gauge-kmeter-needle.png" alt="" />').appendTo(this.container);
    $('<img id="dkmeter-needle" src="img/altimeter-gauge-dkmeter-needle.png" alt="" />').appendTo(this.container);
    $('<img id="hkmeter-needle" src="img/altimeter-gauge-hkmeter-needle.png" alt="" />').appendTo(this.container);

}

Altimeter.prototype.update = function(space) {
    this.rotateNeedle('#meter-needle', (9 / 25 * space));
    this.rotateNeedle('#kmeter-needle', (9 / 250 * space));
    this.rotateNeedle('#dkmeter-needle', (9 / 2500 * space));
    this.rotateNeedle('#hkmeter-needle', (9 / 25000 * space));
};

Altimeter.prototype.rotateNeedle = function(needleSelector, degrees) {
    $(needleSelector).rotateAnimation(degrees);
    $(needleSelector).css('position', 'absolute');
};

Altimeter.prototype.desassembling = function() {
    this.container.remove();
    this.container = null;
};