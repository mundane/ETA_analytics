/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
 * 
@class Siesta.Test.ExtJS
@extends Siesta.Test.Browser
@mixin Siesta.Test.ExtJS.Observable
@mixin Siesta.Test.ExtJS.FormField
@mixin Siesta.Test.ExtJS.Component
@mixin Siesta.Test.ExtJS.Element 
@mixin Siesta.Test.ExtJS.Store 
@mixin Siesta.Test.ExtJS.DataView
@mixin Siesta.Test.ExtJS.Grid


A base class for testing browser and ExtJS applications. It inherit from {@link Siesta.Test.Browser} 
and adds various ExtJS specific assertions.

In various places where the {@link Siesta.Test.Browser} accepts the DOM element as the argument (for example, `type/click/drag` etc), 
this class will allow you to accept the instance of `Ext.Component`. In such case the `getEl` method of the component will be used to
convert the component to DOM element. 

This file is a reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

*/
Class('Siesta.Test.ExtJS', {
    
    isa         : Siesta.Test.Browser,
        
    does        :  [ 
        Siesta.Test.ExtJS.Component, 
        Siesta.Test.ExtJS.Element, 
        Siesta.Test.ExtJS.FormField, 
        Siesta.Test.ExtJS.Observable, 
        Siesta.Test.ExtJS.Store, 
        Siesta.Test.ExtJS.Grid,
        Siesta.Test.ExtJS.DataView
    ],
    
    has : {
        waitForExtReady         : true,
        waitForAppReady         : false,
        loaderPath              : null,
        
        simulateEventsWith      : {
            is      : 'rw',
            init    : function () {
                var div = document.createElement('div')
                
                return div.attachEvent ? 'fireEvent' : 'dispatchEvent'
            }
        }
    },

    methods : {
        
        initialize : function() {
            // Since this test is preloading Ext JS, we should let Siesta know what to 'expect'
            this.expectGlobals('Ext', 'id');
            this.SUPER();
        },
        
        
        start : function (alreadyFailedWithException, startNote) {
            var me      = this;
            var sup     = this.SUPER;
            var Ext     = this.getExt();
            
            if (this.loaderPath && Ext) {
                Ext.Loader.setPath(this.loaderPath);
            }
            
            if (Ext && (this.waitForExtReady || this.waitForAppReady)) {
                var errorMessage    = this.waitForExtReady 
                        ? 
                    "Ext.onReady took longer than 10 seconds - some dependency can't be loaded? Check the `Net` tab in Firebug"
                        :
                    "Waiting for MVC application launch took longer than 10 seconds - no MVC application on test page? You may need to disable the `waitForAppReady` config option."
                
                var hasTimedOut     = false
                
                var timeout         = setTimeout(function () {
                    hasTimedOut     = true
                    
                    sup.call(me, alreadyFailedWithException, errorMessage)
                    
                }, 10000)
                
                var continuation    = function () {
                    clearTimeout(timeout)
                    
                    if (!hasTimedOut) sup.call(me, alreadyFailedWithException, startNote)
                }
                
                // this flag will explain to Ext, that DOM ready event has already happened
                // Ext fails to set this flag if it was loaded dynamically, already after DOM ready
                // the test will start only after DOM ready anyway, so we just set this flag  
                Ext.isReady         = true

                var canWaitForApp   = Boolean(Ext.ClassManager.get('Ext.app.Application'))
                
                if (this.waitForAppReady && canWaitForApp) {
                    Ext.util.Observable.observe(Ext.app.Application, {
                        launch      : continuation,
                        
                        single      : true,
                        delay       : 100
                    })
                    
                    return
                }
                
                if (this.waitForExtReady || (this.waitForAppReady && !canWaitForApp)) 
                    // we still wrap the start of the test with the Ext.onReady, but we are waiting not for DOM loading but for dependencies loading
                    Ext.onReady(continuation)
                    
            } else
                this.SUPERARG(arguments)
        },

        /**
         * This method returns the `Ext` object from the scope of the test. When creating your own assertions for Ext JS code, you need
         * to make sure you are using this method to get the `Ext` instance. Otherwise, you'll be using the same "top-level" `Ext`
         * instance, used by the harness for its UI. 
         * 
         * For example:
         * 
         *      elementHasProvidedCssClass : function (el, cls, desc) {
         *          var Ext     = this.getExt();
         *          
         *          if (Ext.fly(el).hasCls(cls)) {
         *              this.pass(desc);
         *          } else {
         *              this.fail(desc);
         *          }
         *      }
         *   
         * @return {Object} The `Ext` object from the scope of test
         */
        getExt : function () {
            return this.global.Ext
        },
        
        
        /**
         * The alias for {@link #getExt}
         * @method
         */
        Ext : function () {
            return this.global.Ext
        },
        

        // Accept Ext.Element and Ext.Component
        normalizeElement : function(el) {
            if (!el) return null
            
            var Ext = this.getExt();
            return el instanceof Ext.Component ? el.getEl().dom : (el.dom ? el.dom : el);
        },

        
        /**
        * This method wraps the {@link Siesta.Test.Browser#type} method with additional check:
        * if the 1st passed parameter is an instance of `Ext.form.Field`, then the typing will occur
        * into its `inputEl` property. Please see {@link Siesta.Test.Browser#type} description
        * for the list of supported advanced key codes.
        * 
        * @param {Ext.form.Field/HTMLElement} el The element or Component to type into
        * @param {String} text the text to type.
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the type operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        */
        type: function (el, text, callback, scope) {
            var Ext = this.getExt();
            if (el instanceof Ext.form.Field) {
                el = el.inputEl;
            }
            this.SUPER(el, text, callback, scope);
        },

        /**
         * This method wraps the {@link Siesta.Test.Browser#click} method with additional check:
         * if the 1st passed parameter is an instance of `Ext.form.Field`, then click will occur
         * in the center of its `inputEl`. If its an instance of `Ext.Component` - in the center
         * of the component's element.
         * 
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mouseup`, `click`
         * 
         * See also {@link Siesta.Test.Browser#click}.
         *   
         * @param {Ext.Component/HTMLElement} el The element or Component to click
         * @param {Function} callback (optional) A function to call when the condition has been met.
         * @param {Object} scope (optional) The scope for the callback 
         */
        click: function (el, callback, scope) {
            var Ext = this.getExt();
            if (el instanceof Ext.form.Field && el.inputEl) {
                el = el.inputEl;
            } else if (el instanceof Ext.Component) {
                var center = this.findCenter(el);
                el = this.elementFromPoint(center[0], center[1]);
            }
            this.SUPER(el, callback, scope);
        },

        /**
         * This method will simulate a drag and drop operation between either two points, two DOM elements or two `Ext.Component`s.
         * The following events will be fired, in order:  `mouseover`, `mousedown`, `mousemove` (along the mouse path), `mouseup`
         * 
         * This method is deprecated in favor of {@link #dragTo} and {@link #dragBy} methods
         *   
         * @param {Ext.Component/HTMLElement/Array} source Either an element, or [x,y] as the drag starting point
         * @param {Ext.Component/HTMLElement/Array} arget (optional) Either an element, or [x,y] as the drag end point
         * @param {Array} delta (optional) the amount to drag from the source coordinate, expressed as [x,y]. [50, 10] will drag 50px to the right and 10px down.
         * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the drag operation is completed.
         * @param {Object} scope (optional) the scope for the callback
         * @param {Object} options any extra options used to configure the DOM event
        */
        drag: function (source, target, delta, callback, scope, options) {
            var Ext = this.getExt();
            if (source instanceof Ext.Component) {
                var center = this.findCenter(source.el);
                source = this.elementFromPoint(center[0], center[1]);
            }

            if (target instanceof Ext.Component) {
                var center = this.findCenter(target.el);
                target = this.elementFromPoint(center[0], center[1]);
            }
            this.SUPER(source, target, delta, callback, scope, options);
        },

        /**
        * This method will simulate a drag and drop operation between either two points or two DOM elements.
        * The following events will be fired, in order:  `mouseover`, `mousedown`, `mousemove` (along the mouse path), `mouseup`
        *   
        * @param {Ext.Component/HTMLElement/Array} source Either an element, or [x,y] as the drag starting point
        * @param {Ext.Component/HTMLElement/Array} target Either an element, or [x,y] as the drag end point
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the drag operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        * @param {Object} options any extra options used to configure the DOM event
        * @param {Boolean} dragOnly true to skip the mouseup and not finish the drop operation.
        */
        dragTo : function(source, target, callback, scope, options, dragOnly) {
            var Ext = this.getExt();
            if (source instanceof Ext.Component) {
                var center = this.findCenter(source.el);
                source = this.elementFromPoint(center[0], center[1]);
            }

            if (target instanceof Ext.Component) {
                var center = this.findCenter(target.el);
                target = this.elementFromPoint(center[0], center[1]);
            }
            this.SUPER(source, target, callback, scope, options, dragOnly);
        },

        /**
        * This method will simulate a drag and drop operation from a point (or DOM element) and move by a delta.
        * The following events will be fired, in order:  `mouseover`, `mousedown`, `mousemove` (along the mouse path), `mouseup`
        *   
        * @param {Ext.Component/HTMLElement/Array} source Either an element, or [x,y] as the drag starting point
        * @param {Array} delta The amount to drag from the source coordinate, expressed as [x,y]. E.g. [50, 10] will drag 50px to the right and 10px down.
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the drag operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        * @param {Object} options any extra options used to configure the DOM event
        * @param {Boolean} dragOnly true to skip the mouseup and not finish the drop operation.
        */
        dragBy : function(source, delta, callback, scope, options, dragOnly) {
            var Ext = this.getExt();
            if (source instanceof Ext.Component) {
                var center = this.findCenter(source.el);
                source = this.elementFromPoint(center[0], center[1]);
            }
            this.SUPER(source, delta, callback, scope, options, dragOnly);
        },

        /**
        * This method will simulate a mouse move to an Ext JS component, xy-coordinate or an element (the center of it)
        * @param {Ext.Component/HTMLElement/Array} target Either an element, or [x,y] as the target point
        * @param {Function} callback (optional) To run this method async, provide a callback method to be called after the operation is completed.
        * @param {Object} scope (optional) the scope for the callback
        */
        moveMouseTo : function(target, callback, scope) {
            var Ext = this.getExt();
            if (target instanceof Ext.Component) {
                var center = this.findCenter(target.el);
                target = this.elementFromPoint(center[0], center[1]);
            }
            this.SUPER(target, callback, scope);
        },

         /**
         * This method allow assertions to fail silently for tests executed in versions of Ext JS up to a certain release. When you try to run this test on a newer
         * version of Ext JS and it fails, it will fail properly and force you to re-investigate. If it passes in the newer version, you should remove the 
         * use of this method.
         * 
         * See also {@link Siesta.Test#todo}
         *   
         * @param {String} frameworkVersion The Ext JS framework version, e.g. '4.0.7'
         * @param {Function} fn The method covering the broken functionality
         * @param {String} reason The reason or explanation of the bug
        */
        knownBugIn : function(frameworkVersion, fn, reason) {
            var Ext = this.getExt();
            
            if (Ext.versions.extjs.isGreaterThan(frameworkVersion)) {
                fn.call(this.global, this);
            } else {
                this.todo(reason, fn);
            }
        },
        
        
         /**
         * This method will load the specified classes with `Ext.require()` and call the provided callback. Additionally it will check that all classes have been loaded.
         * 
         * This method accepts either variable number of arguments:
         *
         *      t.requireOk('Some.Class1', 'Some.Class2', function () { ... })
         * or array of class names:
         * 
         *      t.requireOk([ 'Some.Class1', 'Some.Class2' ], function () { ... })
         * 
         * @param {String} className1 The name of the class to `require`
         * @param {String} className2 The name of the class to `require`
         * @param {String} classNameN The name of the class to `require`
         * @param {Function} fn The callback. Will be called even if the loading of some classes have failed.
        */
        requireOk : function () {
            var me                  = this
            var global              = this.global
            var Ext                 = this.getExt()
            var args                = Ext.Array.flatten(Array.prototype.slice.call(arguments))
            
            var callback
            
            if (this.typeOf(args[ args.length - 1 ]) == 'Function') callback = args.pop()
            
            
            // what to do when loading completed or timed-out
            var continuation    = function () {
                me.endAsync(async)
                
                Joose.A.each(args, function (className) {
                    var cls     = Ext.ClassManager.get(className)
                    
                    //                       normal class                         singleton
                    if (cls && (me.typeOf(cls) == 'Function' || me.typeOf(cls.self) == 'Function'))
                        me.pass("Class: " + className + " was loaded")
                    else
                        me.fail("Class: " + className + " was loaded")
                })
                
                callback && callback()
            }
            
            var timeout         = Ext.isIE ? 120000 : 30000,
                async           = this.beginAsync(timeout + 100)
            
            var hasTimedOut     = false
            
            var timeoutId       = global.setTimeout(function () {
                hasTimedOut     = true
                continuation()
            }, timeout)
            
            Ext.Loader.setConfig({ enabled : true });

            Ext.require(args, function () {
                global.clearTimeout(timeoutId)
                
                if (!hasTimedOut) continuation() 
            })
        },
        
        /**
         * This method is a simple wrapper around the {@link #chainClick} - it performs a component query for provided `selector` starting from the `root` container
         * and then clicks on all found components, in order:
         * 

    // click all buttons in the `panel`
    t.clickComponentQuery('button', panel, function () {})
    
         * 
         * The 2nd argument for this method can be omitted and method can be called with 2 arguments only. In this case a global component query will be performed:
         *

    // click all buttons in the application
    t.clickComponentQuery('button', function () {})
    
         * 
         * @param {String} selector The selector to perform a component query with
         * @param {Ext.Container} root The optional root container to start a query from.
         * @param {Function} callback The callback to call, after clicking all the found components
         */
        clickComponentQuery : function (selector, root, callback) {
            
            if (arguments.length == 2 && this.typeOf(arguments[ 1 ] == 'Function')) {
                callback    = root
                root        = this.Ext().ComponentQuery
            }
            
            if (arguments.length == 1) {
                root        = this.Ext().ComponentQuery
            }
            
            var result      = root.query(selector)
            
            this.chainClick(result, function () { callback && callback.call(this, result) })
        },
        
        
        /**
         * An alias for {@link #clickComponentQuery}.
         * 
         * @param {String} selector The selector to perform a component query with
         * @param {Ext.Container} root The optional root container to start a query from.
         * @param {Function} callback The callback to call, after clicking all the found components
         */
        clickCQ : function () {
            this.clickComponentQuery.apply(this, arguments)
        }
    }
})
