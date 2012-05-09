/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.TestGrid', {

    alias       : 'widget.testgrid',

    extend      : 'Ext.tree.Panel',
    stateful    : true,
    id          : 'testTree',

    initComponent : function () {
    
        Ext.apply(this, {
        
            width       : 400,
        
            cls         : 'tr-testgrid',
            
//            border      : false,
            
            forceFit    : true,
            rootVisible : false,
        
            title       : 'Double click a test to run it',
        
            columns     : [
                { 
                    xtype       : 'treecolumn',
                    header      : 'Name',
                    sortable    : false,
                
                    dataIndex   : 'title',
                
                    width       : 180, 
                    renderer    : this.treeColumnRenderer,
                    scope       : this
                },
                { header: 'Passed', width: 40, sortable: false, dataIndex: 'passCount', align : 'center', renderer : this.passedColumnRenderer, scope : this },
                { header: 'Failed', width: 40, sortable: false, dataIndex: 'failCount', align : 'center', renderer : this.failedColumnRenderer, scope : this },
                { header: 'Time', width: 50, sortable: false, dataIndex: 'time', align : 'center' }
            ],
            tools : [
                {
                    type : 'down',
                    tooltip        : 'Expand all',
                    tooltipType : 'title',
                    scope : this,                                    
                    handler     : this.onExpandAll
                },
                {
                    type : 'up',
                    tooltipType : 'title',
                    tooltip : 'Collapse all',
                    scope : this,                                    
                    handler     : this.onCollapseAll
                }
            ],
            
            dockedItems : [
                {
                    xtype       : 'triggerfield',
                    emptyText   : 'Filter tests',
                    
                    itemId      : 'trigger',
                    
                    style       : 'margin-top : 3px; margin-left : 1px; margin-right : 1px',
                    triggerCls  : 'x-form-clear-trigger',
                    
                    dock        : 'top',
                    
                    onTriggerClick  : Ext.Function.bind(this.onClearFilter, this),
                    
                    listeners   : {
                        change  : this.onFilterChange,
                        scope   : this
                    }
                }
            ]
        })
    
        this.callParent()
    },
    
    
    onClearFilter : function () {
        var treeView    = this.getView()
        
        // TODO 4.0.2 quirk probably not needed in 4.1
        treeView.blockRefresh = false
        
        this.getDockedComponent('trigger').setValue('')
        treeView.store.clearFilter()
        
        // TODO 4.0.2 quirk probably not needed in 4.1
        treeView.blockRefresh = true
    },
    
    
    onFilterChange : function (field, newValue, oldValue) {
        var treeView    = this.getView()
        var nodeStore   = treeView.store
        
        // TODO 4.0.2 quirk probably not needed in 4.1
        treeView.blockRefresh = false
        
        if (newValue) {
            var regexps         = Ext.Array.map(newValue.split(/\s+/), function (token) { return new RegExp(Ext.String.escapeRegex(token), 'i') })
            var length          = regexps.length
            
            var filteredById    = {}
            
            Ext.Array.each(this.store.tree.flatten(), function (testFile) {
                var title       = testFile.get('title')
                
                // blazing fast "for" loop! :)
                for (var i = 0; i < length; i++)
                    if (!regexps[ i ].test(title)) return
                    
                filteredById[ testFile.getId() ] = true

                // also include parent nodes for leafs for better user experience
                if (testFile.isLeaf()) {
                    var parent  = testFile.parentNode
                    
                    while (parent) {
                        filteredById[ parent.getId() ] = true
                        
                        parent = parent.parentNode
                    }
                }
            })
            
            nodeStore.filterBy(function (testFile) {
                return filteredById[ testFile.getId() ]
            })
            
        } else
            nodeStore.clearFilter()
            
        // TODO 4.0.2 quirk probably not needed in 4.1
        treeView.blockRefresh = true
    },
    

    onExpandAll : function () {
        this.expandAll()
    }, 


    onCollapseAll : function () {
        this.collapseAll()
    },

    treeColumnRenderer : function (value, metaData, testFile, rowIndex, colIndex, store) {
        metaData.tdCls = 'tr-test-status '
    
        if (testFile.isLeaf()) {
    
            var test = testFile.get('test')
        
            if (test) {
            
                if (testFile.get('isFailed'))
                    metaData.tdCls += 'tr-test-status-thrown'
                
                else if (testFile.get('isRunning') && !test.isFinished())
                    metaData.tdCls += 'tr-test-status-running'
                else
                    if (test.isFinished()) {
                    
                        if (test.isPassed())
                            metaData.tdCls += 'tr-test-status-passed'
                        else 
                            metaData.tdCls += 'tr-test-status-failed'
                    } else
                        metaData.tdCls += 'tr-test-status-working'
                
            } else {
            
                if (testFile.get('isMissing'))
                    metaData.tdCls += 'tr-test-status-missing'
                else
                    if (testFile.get('isStarting'))
                        metaData.tdCls += 'tr-test-status-working'
                    else
                        metaData.tdCls += 'tr-test-status-empty'
            }
        
            return value.replace(/(?:.*\/)?([^/]+)$/, '$1')
            
        } else {
            metaData.tdCls += 'tr-folder-' + testFile.get('folderStatus')
        
            return value
        }
    },

    passedColumnRenderer : function(v, m, r) {
        if (r.data.todoPassCount > 0) {
            v += ' <span title="' + r.data.todoPassCount + ' todo assertion(s) passed" class="tr-test-todo tr-test-todo-pass">+ ' + r.data.todoPassCount + '</span>';
        }
        return v;
    },

    failedColumnRenderer : function(v, m, r) {
        if (r.data.todoFailCount > 0) {
            v += ' <span title="' + r.data.todoFailCount + ' todo assertion(s) failed" class="tr-test-todo tr-test-todo-fail">+ ' + r.data.todoFailCount + '</span>';
        }
        return v;
    }
})
