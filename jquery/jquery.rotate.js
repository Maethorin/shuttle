// VERSION: 1.4 LAST UPDATE: 23.06.2010
/*!
 * THIS IS FREE SCRIPT BUT LEAVE THIS COMMENT IF
 * YOU WANT USE THIS CODE ON YOUR SITE
 *
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * http://wilq32.blogspot.com
 *
 */

 // Packed by Darian Cabot for jGauge on 20101012.
(function($){var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform".split(" ");for(var a=0;a<toCheck.length;a++)if(styles[toCheck[a]]!==undefined)supportedCSS=toCheck[a];jQuery.fn.extend({ImageRotate:function(parameters)
{if(this.Wilq32&&this.Wilq32.PhotoEffect)return;var paramClone=$.extend(true,{},parameters)
return(new Wilq32.PhotoEffect(this.get(0),paramClone))._temp;},rotate:function(parameters)
{if(this.length===0)return;if(typeof parameters=="undefined")return;if(typeof parameters=="number")parameters={angle:parameters};var returned=[];for(var i=0,i0=this.length;i<i0;i++)
{var element=this.get(i);if(typeof element.Wilq32=="undefined")
returned.push($($(element).ImageRotate(parameters)));else
{element.Wilq32.PhotoEffect._rotate(parameters.angle);}}
return returned;},rotateAnimation:function(parameters)
{if(this.length===0)return;if(typeof parameters=="undefined")return;if(typeof parameters=="number")parameters={angle:parameters};var returned=[];for(var i=0,i0=this.length;i<i0;i++)
{var element=this.get(i);if(typeof element.Wilq32=="undefined")
returned.push($($(element).ImageRotate(parameters)));else
{element.Wilq32.PhotoEffect._parameters.animateAngle=parameters.angle;element.Wilq32.PhotoEffect._parameters.callback=parameters.callback||element.Wilq32.PhotoEffect._parameters.callback||function(){};element.Wilq32.PhotoEffect._animateStart();}}
return returned;}});Wilq32={};Wilq32.PhotoEffect=(function(){if(supportedCSS)
return function(img,parameters){this._img=img;this._parameters=parameters||{};this._parameters.animateAngle=0;this._parameters.angle=parameters.angle||0;this._angle=0;img.Wilq32={PhotoEffect:this};this._BindEvents(this._img,this._parameters.bind);this._rotate(this._parameters.angle);}
else
return function(img,parameters)
{this._img=img;this._parameters=parameters||{};this._parameters.className=img.className;this._parameters.id=img.getAttribute('id');this._parameters.animateAngle=0;this._angle=0;this._parameters.angle=parameters.angle||0;this._temp=document.createElement('span');this._temp.style.display="inline-block";this._temp.Wilq32={PhotoEffect:this};img.parentNode.insertBefore(this._temp,img);this._img._ref=this;if(this._img.complete){this._Loader();}
else{jQuery(this._img).bind("load",function()
{this._ref._Loader.call(this._ref);});}}})();if(jQuery.browser.msie)
{Wilq32.PhotoEffect.prototype.createVMLNode=(function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml");return function(tagName){return document.createElement('<rvml:'+tagName+' class="rvml">');};}catch(e){return function(tagName){return document.createElement('<'+tagName+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');};}})();}
Wilq32.PhotoEffect.prototype._BindEvents=function(element,events){if(events)
{for(var a in events)if(events.hasOwnProperty(a))
for(var b in events[a])if(events[a].hasOwnProperty(b))
jQuery(element).bind(b,events[a][b]);}}
Wilq32.PhotoEffect.prototype._Loader=(function()
{if(jQuery.browser.msie)
return function()
{var src=this._img.src;this._temp.setAttribute('id',this._parameters.id);this._temp.className=this._parameters.className;var width=this._img.width;var height=this._img.height;this._img.parentNode.removeChild(this._img);this._img._widthMax=this._img._heightMax=Math.sqrt((height)*(height)+(width)*(width));this._img._heightMax=Math.sqrt((height)*(height)+(width)*(width));this._vimage=this.createVMLNode('image');this._vimage._ref=this;this._vimage.style.height=height+"px";this._vimage.style.width=width+"px";this._temp.style.position="relative";this._vimage.style.position="absolute";this._temp.style.width=this._temp.style.height=this._img._heightMax+"px";this._vimage.src=src;this._temp.appendChild(this._vimage);this._temp.style.width=width+"px";this._temp.style.height=height+"px";this._vimage.style.top="0px";this._vimage.style.left="0px";var self=this;this._BindEvents(this._temp,this._parameters.bind);this._rotate(this._parameters.angle);}
else
return function()
{this._temp.setAttribute('id',this._parameters.id);this._temp.className=this._parameters.className;var width=this._img.width;var height=this._img.height;this._img.parentNode.removeChild(this._img);this._img._widthMax=this._img._heightMax=Math.sqrt((height)*(height)+(width)*(width));this._canvas=document.createElement('canvas');this._canvas._ref=this;this._canvas.height=height;this._canvas.width=width;this._canvas.setAttribute('width',width);this._canvas.Wilq32=this._temp.Wilq32;this._temp.appendChild(this._canvas);this._temp.style.width=width+"px";this._temp.style.height=height+"px";this._canvas.style.position="relative";this._canvas.style.left=-(this._img._widthMax-width)/2+"px";this._canvas.style.top=-(this._img._widthMax-height)/2+"px";var self=this;this._BindEvents(this._canvas,this._parameters.bind);this._cnv=this._canvas.getContext('2d');this._rotate(this._parameters.angle);}})();Wilq32.PhotoEffect.prototype._animateStart=function()
{if(this._timer){clearTimeout(this._timer);}
this._animate();}
Wilq32.PhotoEffect.prototype._animate=function()
{if(this._canvas||this._vimage||this._img)this._angle-=(this._angle-this._parameters.animateAngle)*0.1;if(typeof this._parameters.minAngle!="undefined")if(this._angle<this._parameters.minAngle)this._angle=this._parameters.minAngle;if(typeof this._parameters.maxAngle!="undefined")if(this._angle>this._parameters.maxAngle)this._angle=this._parameters.maxAngle;var checkEnd=!!(Math.round(this._angle*100-this._parameters.animateAngle*100))==0&&!!this._timer;if(this._parameters.callback&&checkEnd){this._parameters.callback();}
if(checkEnd&&!this._parameters.animatedGif)
{clearTimeout(this._timer);}
else
{if(this._canvas||this._vimage||this._img)this._rotate((~~(this._angle*10))/10);var self=this;this._timer=setTimeout(function()
{self._animate.call(self);},10);}}
Wilq32.PhotoEffect.prototype._rotate=(function()
{if(jQuery.browser.msie)
return function(angle)
{this._vimage.style.rotation=angle;}
else if(supportedCSS)
return function(angle){this._img.style[supportedCSS]="rotate("+angle+"deg)";}
else
return function(angle)
{if(!this._img.width)return;if(typeof angle!="number")return;angle=(angle%360)*Math.PI/180;var width=this._img.width;var height=this._img.height;var widthAdd=this._img._widthMax-width;var heightAdd=this._img._heightMax-height;this._canvas.width=width+widthAdd;this._canvas.height=height+heightAdd;this._cnv.save();this._cnv.translate(widthAdd/2,heightAdd/2);this._cnv.translate(width/2,height/2);this._cnv.rotate(angle);this._cnv.translate(-width/2,-height/2);this._cnv.drawImage(this._img,0,0);this._cnv.restore();}})();})(jQuery);