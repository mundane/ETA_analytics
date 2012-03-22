/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial Software License Agreement provided with the Software or, alternatively, in accordance with the terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * Tests Ext.data.Store functionality
 * @author Ed Spencer
 */
(function() {
    var suite  = Ext.test.session.getSuite('Ext.form.Panel'),
        assert = Y.Assert;
    
    function buildForm(config) {
        return new Ext.form.Panel(config);
    };
    
    suite.add(new Y.Test.Case({
        name: 'initialization',
        
        testCreatesForm: function() {
            var form = buildForm();
            
            assert.isTrue(form.form instanceof Ext.form.Basic);
        },
        
        testInitsItems: function() {
            var FormPanel = Ext.form.Panel,
                proto     = FormPanel.prototype,
                oldInit   = proto.initItems,
                wasCalled = false;
            
            proto.initItems = function() {
                wasCalled = true;
            };
            
            var form = buildForm();
            assert.isTrue(wasCalled);
            
            proto.initItems = oldInit;
        },
        
        testStartsMonitoring: function() {
            var FormPanel = Ext.form.Panel,
                proto     = FormPanel.prototype,
                oldFunc   = proto.startMonitoring,
                wasCalled = false;
            
            proto.startMonitoring = function() {
                wasCalled = true;
            };
            
            var form = buildForm({
                monitorValid: true, 
                renderTo    : Ext.getBody()
            });
            
            form.render();
            assert.isTrue(wasCalled);
            
            proto.startMonitoring = oldFunc;
            form.destroy();
        }
    }));
    
    suite.add(new Y.Test.Case({
        name: 'destruction',
        
        testStopMonitoring: function() {
            var FormPanel = Ext.form.Panel,
                proto     = FormPanel.prototype,
                oldFunc   = proto.stopMonitoring,
                wasCalled = false;
            
            proto.stopMonitoring = function() {
                wasCalled = true;
            };
            
            var form = buildForm({
                monitorValid: true, 
                renderTo    : Ext.getBody()
            });
            
            form.render();
            form.destroy();
            assert.isTrue(wasCalled);
            
            proto.stopMonitoring = oldFunc;
        }
    }));
    
    suite.add(new Y.Test.Case({
        name: 'initFields',
        
        testIsField: function() {
            var mockField = {
                setValue    : Ext.emptyFn,
                getValue    : Ext.emptyFn,
                markInvalid : Ext.emptyFn,
                clearInvalid: Ext.emptyFn
            };
            
            var form = buildForm();
            
            assert.isTrue(form.isField(mockField));
        }
    }));
})();
