/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.Model.TestFile', {

    extend      : 'Ext.data.Model',

    idProperty  : 'id',

    fields      : [
        'id',
        'url',
    
        'title',
    
        'passCount',
        'failCount',
        'todoPassCount',
        'todoFailCount',
    
        'time',
    
        {
            name            : 'checked',
            defaultValue    : false
        },
    
        {
            name            : 'folderStatus',
            defaultValue    : 'yellow'
        },
    
        // will be set to true for all tests, once the users clicks "run"
        'isStarting',
        // will be set to true, right before the scope preload begin
        'isStarted',
        // will be set to true, after preload ends and tests launch
        'isRunning',
        'isMissing',
        'isFailed',
    
        // composite objects
        'assertionsStore',
        'test',
        'descriptor'
    ],


    init : function () {
        this.internalId     = this.getId() || this.internalId
    },


    computeFolderStatus : function () {
        if (!this.childNodes.length) return 'yellow'
    
        var hasFailed       = false
        var allGreen        = true
    
        Joose.A.each(this.childNodes, function (childNode) {
        
            if (childNode.isLeaf()) {
                var test    = childNode.get('test')
            
                if (test && test.isFailed()) {
                    allGreen    = false
                    hasFailed   = true
                
                    // stop iteration
                    return false
                }
            
                if (test && !test.isPassed())   allGreen = false
                if (!test)                      allGreen = false
            
            } else {
                var status  = childNode.computeFolderStatus()
            
                if (status == 'red') {
                    allGreen    = false
                    hasFailed   = true
                
                    // stop iteration
                    return false
                }
            
                if (status == 'yellow')         allGreen = false
            }
        })
    
        if (hasFailed)  return 'red'
        if (allGreen)   return 'green'
    
        return 'yellow'
    },


    updateFolderStatus : function () {
        this.set('folderStatus', this.computeFolderStatus())
    
        var parentNode  = this.parentNode
    
        if (parentNode && !parentNode.isRoot()) parentNode.updateFolderStatus()
    }
})
