/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Component

This is a mixin, with helper methods for testing functionality relating to Ext.Component. This mixin is being consumed by {@link Siesta.Test.ExtJS}. 

*/
Role('Siesta.Test.ExtJS.Component', {
    
    requires        : [ 'waitFor' ],
    
    methods : {
        
        /**
         * Waits until the main element of the passed component is the 'top' element in the DOM. The callback will receive the passed component instance.
         * 
         * @param {Ext.Component} component The component to look for.
         * @param {Function} callback The callback to call after the component becomes visible
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */        
        waitForComponentVisible : function(component, callback, scope, timeout) {
            var Ext = this.getExt();
            if (!(component instanceof Ext.Component)) {
                throw 'Expected an Ext.Component, got: ' + component;
            }
            
            var me = this;

            this.waitFor(
                function() { return component.el && me.elementIsTop(component.el, true) && component; }, 
                callback,
                scope, 
                timeout
            );
        },
        
        
        /**
         * Waits until the main element of the passed component is not visible. The callback will receive the passed component instance.
         * 
         * @param {Ext.Component} component The component to look for.
         * @param {Function} callback The callback to call after the component becomes not visible
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */        
        waitForComponentNotVisible : function(component, callback, scope, timeout) {
            var Ext = this.getExt();
            if (!(component instanceof Ext.Component)) {
                throw 'Expected an Ext.Component, got: ' + component;
            }
            
            var me = this;

            this.waitFor(
                function() { return component.el && !me.isElementVisible(component.el) && component; }, 
                callback,
                scope, 
                timeout
            );
        },
        

        /**
         * Waits until Ext.ComponentQuery detects the passed query parameter. The callback will receive the result of the query.
         * 
         * The "root" argument of this method can be omitted.
         * 
         * @param {String} query The component query phrase
         * @param {Ext.Container} root The container to start a component query from. Optional
         * @param {Function} callback The callback to call after the xtype has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */        
        waitForComponentQuery : function(query, root, callback, scope, timeout) {
            // no `root` supplied
            if (this.typeOf(root) == 'Function') {
                timeout     = scope
                scope       = callback
                callback    = root
                root        = this.getExt().ComponentQuery
            }
            
            this.waitFor(
                function() { 
                    var result = root.query(query);
                    return result.length > 0 ? result : false; 
                }, 
                callback,
                scope, 
                timeout
            );
        },

        /**
         * Shorthand alias for {@link #waitForComponentQuery}
         * 
         * @param {String} query The component query phrase
         * @param {Ext.Container} root The container to start a component query from
         * @param {Function} callback The callback to call after the xtype has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */   
        waitForCQ : function () {
            this.waitForComponentQuery.apply(this, arguments);
        },
        
        
        /**
         * Alias for {@link #waitForComponentQueryNotFound}
         * 
         * @param {String} query
         * @param {Function} callback
         * @param {Object} scope
         * @param {Number} timeout
         */
        waitForCQNotFound: function () {
            this.waitForComponentQueryNotFound.apply(this, arguments);
        },

        
        /**
         * Waits until Ext.ComponentQuery from the passed query parameter is no longer found, and then calls the callback supplied.
         *
         * The "root" argument of this method can be omitted.
         *
         * @param {String} query The component query selector
         * @param {Ext.Container} root The container to start a component query from. Optional
         * @param {Function} callback The callback to call after the xtype has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */     
        waitForComponentQueryNotFound: function(query, root, callback, scope, timeout){
            // no `root` supplied
            if (this.typeOf(root) == 'Function') {
                timeout     = scope
                scope       = callback
                callback    = root
                root        = this.getExt().ComponentQuery
            }
           
            this.waitFor(
                function() {
                    var result = root.query(query);
                    return result.length === 0 && result;
                },
                callback,
                scope,
                timeout
            );
        },
        

        /**
         * Alias for {@link #waitForComponentQueryVisible}
         * 
         * @param {String} query
         * @param {Function} callback
         * @param {Object} scope
         * @param {Number} timeout
         */
        waitForCQVisible: function () {
            this.waitForComponentQueryVisible.apply(this, arguments);
        },
        
        
        /**
         * Waits until all results of the Ext.ComponentQuery are detected and visible.
         * 
         * The "root" argument of this method can be omitted.
         *
         * @param {String} query The component query selector
         * @param {Ext.Container} root The container to start a component query from. Optional
         * @param {Function} callback The callback to call after the xtype has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value.
         */
        waitForComponentQueryVisible: function(query, root, callback, scope, timeout){
            var me      = this,
                Ext     = me.getExt();
                
            // no `root` supplied
            if (this.typeOf(root) == 'Function') {
                timeout     = scope
                scope       = callback
                callback    = root
                root        = Ext.ComponentQuery
            }

            me.waitFor(
                function() {
                    var result      = root.query(query),
                        allVisible  = true;
                   
                    if (result.length > 0){
                        Ext.Array.each(result,function(c){
                            if (!me.isElementVisible(c)){
                                allVisible = false;
                                return false;
                            }
                        });
                        return allVisible && result;
                    } else {
                        return false;
                    }
                },
                callback,
                scope,
                timeout
            );
        },
        
        
        /**
         * Waits until the a component with the specified xtype can be detected by a simple ComponentQuery.
         * 
         * The "root" argument of this method can be omitted.
         * 
         * @param {String} xtype The component xtype to look for.
         * @param {Ext.Container} root The container to start a component query from. Optional
         * @param {Function} callback The callback to call after the xtype has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */        
        waitForXType : function(xtype, root, callback, scope, timeout) {
            this.waitForComponentQuery(xtype, root, callback, scope, timeout);
        },

        /**
         * Waits until the a component with the specified xtype can be detected by a simple ComponentQuery.
         * 
         * @param {String} component The class name to wait for.
         * @param {Boolean} rendered true to also wait for the component to be rendered
         * @param {Function} callback The callback to call after the component has been found
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test.ExtJS#waitForTimeout} value. 
         */        
        waitForComponent : function(component, rendered, callback, scope, timeout) {
            var Ext = this.getExt();
            if (Ext.isString(component)) {
                xtype = Ext.ClassManager.get(component).xtype;
            } else {
                xtype = component.xtype;
            }
            
            if (rendered) {
                xtype = xtype + '[rendered]';
            }

            this.waitForXType(xtype, callback, scope, timeout);
        },

        /**
         * This assertion passes when the passed width and height matches the result of component.getSize()
         * 
         * @param {Ext.Component} component The component to query.
         * @param {Int} width
         * @param {Int} height
         * @param {String} description The description of the assertion
         */
        hasSize : function(component, width, height, description) {
            this.isDeeply(component.getSize(), { width : width, height : height }, description);
        },

         /**
         * This assertion passes when the passed x and y matches the result of component.getPosition()
         * 
         * @param {Ext.Component} component The component to query.
         * @param {Int} x
         * @param {Int} y
         * @param {String} description The description of the assertion
         */
        hasPosition : function(component, x, y, description) {
            this.isDeeply(component.getPosition(), [x, y], description);
        }
    }
});
