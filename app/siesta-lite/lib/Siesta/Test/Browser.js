/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * 
@class Siesta.Test.Browser
@extends Siesta.Test
@mixin Siesta.Test.Simulate.Event
@mixin Siesta.Test.TextSelection 


A base class for testing a generic browser functionality. It has various DOM-related assertions, and is not optimized for any framework.

*/
Class('Siesta.Test.Browser', {
    
    isa         : Siesta.Test,
        
    does        :  [ 
        Siesta.Test.Simulate.Event,
        Siesta.Test.Element,
        Siesta.Test.TextSelection
    ],

    methods : { 
        $ : function () {
            var local$ = $.rebindWindowContext(this.global);
            return local$.apply(this.global, arguments);
        },

        // private
        getPathBetweenPoints: function (from, to) {
            if (typeof from[0] !== 'number' || typeof from[1] !== 'number' || typeof to[0] !== 'number' || typeof to[1] !== 'number') {
                throw 'Incorrect arguments passed to getPathBetweenPoints';
            }

            var stops = [],
                x0 = Math.floor(from[0]),
                x1 = Math.floor(to[0]),
                y0 = Math.floor(from[1]),
                y1 = Math.floor(to[1]),
                dx = Math.abs(x1 - x0),
                dy = Math.abs(y1 - y0),
                sx, sy, err, e2;

            if (x0 < x1) {
                sx = 1;
            } else {
                sx = -1;
            }

            if (y0 < y1) {
                sy = 1;
            } else {
                sy = -1;
            }
            err = dx - dy;
            
            while (x0 !== x1 || y0 !== y1) {
                e2 = 2 * err;
                if (e2 > -dy) {
                    err = err - dy;
                    x0 = x0 + sx;
                }

                if (e2 < dx) {
                    err = err + dx;
                    y0 = y0 + sy;
                }
                stops.push([x0, y0]);
            }

            stops.push(to);
            return stops;
        },

        randomBetween : function (min, max) {
            return Math.round(min + (Math.random()*(max - min)));
        },

        
        // private
        isArray : function(a) {
            return a && (a instanceof Array || a instanceof this.global.Array);
        },
        
        
        /**
         * This method will return the top-most DOM element at the specified coordinates from the test page.
         * 
         * @param {Number} x The X coordinate
         * @param {Number} y The Y coordinate
         * @return {HTMLElement} The top-most element at the specified position on the test page
         */
        elementFromPoint : function (x, y) {
            return this.global.document.elementFromPoint(x, y)
        }
    }
});
