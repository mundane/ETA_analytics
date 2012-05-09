/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.AssertionGrid', {

    extend          : 'Ext.Panel',

    alias           : 'widget.assertiongrid',


    slots           : true,


    testRecord      : null,

    halfWidth       : null,

    isStale         : false,

    maintainMinViewportSize : false,
    minViewportSize         : null,
    
    viewDOM                 : false,
    canManageDOM            : true,

    verticalCenteredTpl     : new Ext.XTemplate(
        '<div class="tr-vertical-align-helper-content {cls}">{text}</div>',
        '<div class="tr-vertical-align-helper"></div>',
        { 
            compiled : true 
        }
    ),


    initComponent : function() {
        this.addEvents('viewdomchange');

        Ext.apply(this, {
            tbar : [{
                text            : 'View source', 
                iconCls         : 'view-source',
                enableToggle    : true,
            
                pressed         : false,
            
                scope           : this,
                handler         : this.toggleSources
            },
            {
                text            : 'Toggle DOM visible', 
                iconCls         : 'show-dom',
            
                scope           : this,
                handler         : function(btn) {
                    this.setViewDOM(!this.viewDOM);
                }
            },
            {
                text            : 'Re-run test', 
                iconCls         : 'rerun',
            
                scope           : this,
                handler         : this.onRerun
            }],

            layout      : 'border',
        
            cls         : 'tr-container',
            border      : false,
        
            items       : [
                // a card container
                {
                    region      : 'center',
                    slot        : 'cardContainer',
                
                    border      : false,
                
                    layout      : 'card', 
                    activeItem  : 0,
                
                    items : [
                        // grid with assertion
                        {
                            cls : 'hide-simulated',
                            xtype       : 'grid',
                            slot        : 'grid',
                    
                            border      : false,
                    
                            store       : this.testRecord.get('assertionsStore'),
                    
                            columns     : [
                                {
                                    tdCls       : 'tr-td-vertical-align',
                                    header      : '#',
                                    width       : 30,
                                    dataIndex   : 'index',
                                    align       : 'center',
                                    renderer : function(value, metaData, record) {
                                        if (record.get('isSimulatedEvent')) {
                                            metaData.tdCls  =  'tr-diag-headercell';
                                            return Ext.String.format('<div class="simulated simulated-{0}">{1}</div>', record.get('eventType'), record.get('description'));
                                        }
                                        return value;
                                    }
                                },
                                {
                                    header      : 'Result',
                                    width       : 60,
                                    dataIndex   : 'passed',
                                    align       : 'center',
                                    fixed       : true,
                                    renderer    : this.resultRenderer
                                },
                                {
                                    header      : 'Assertion',
                                    flex        : 1,
                                    dataIndex   : 'description',
                            
                                    renderer    : this.descriptionRenderer
                                }
                            ],
                    
                            viewConfig      : {
                                forceFit        : true,
                                stripeRows : false,
                                getRowClass: function(record, rowIndex, rowParams, store){
                                    if (record.get('isSimulatedEvent')) {
                                        return 'tr-simulation-row';
                                    }

                                    return record.get("type") == 'Siesta.Result.Diagnostic' ? 
                                        'tr-diagnostic-row' : 
                                        !record.get('passed') && !record.get('isTodo') ? 'tr-row-failed-assertion' : '' 
                                }
                            }                    
                    
                        },
                        // eof grid with assertion
                        {
                            xtype       : 'container',
                            slot        : 'sources',
                            border      : false,
                            autoScroll  : true,
                            cls         : 'test-source-ct'
                        }
                    ]
                },
                {
                    xtype           : 'panel',
                    region          : 'east',
                    slot            : 'domContainer',
                
                    width           : this.halfWidth,
                
                    split           : true,
                    header          : false,
                
                    collapsible     : true,
                    animCollapse    : false,
                    animFloat       : false,
                
                    collapsed       : !this.viewDOM,
                
                    bodyStyle       : 'text-align : center',
                    html            : this.verticalCenteredTpl.apply({ 
                        cls     : 'tr-rounded-box', 
                        text    : '"Keep results" option is not enabled' 
                    })
                }
            ]
        })
    
        this.callParent()
    
        this.slots.domContainer.on({
            expand      : this.onDomContainerExpand,
            collapse    : this.onDomContainerCollapse,
        
            scope       : this
        })
    
        this.on({
            afterlayout : this.afterDOMContainerLayout,
            hide        : this.hideIFrame,
            show        : this.alignIFrame,
        
            scope       : this
        })
    },


    toggleSources : function(btn) {  
        var slots           = this.slots
        var cardContainer   = slots.cardContainer
        var sourcesCt       = slots.sources
    
        cardContainer.layout.setActiveItem(btn.pressed ? sourcesCt : slots.grid);
    
        if (btn.pressed && !sourcesCt.__filled__) {
            sourcesCt.__filled__ = true
        
            sourcesCt.update(Ext.String.format('<pre class="brush: javascript">{0}</pre>', this.testRecord.get('test').getSource()));
        
            if (SyntaxHighlighter && SyntaxHighlighter.highlight) {
                SyntaxHighlighter.highlight(sourcesCt.el);
            }
        } 
    },

    setViewDOM : function (value, suppressEvent) {
        var domContainer    = this.slots.domContainer
    
        if (value)
            domContainer.expand(Ext.Component.DIRECTION_RIGHT, false)
        else
            domContainer.collapse(Ext.Component.DIRECTION_RIGHT, false)
    },


    resultRenderer : function (value, metaData, record, rowIndex, colIndex, store) {
    
        if (record.get('isTodo')) {
            metaData.tdCls = value ? 'tr-assert-row-ok-todo-cell' : 'tr-assert-row-bug-todo-cell';
        } else {
            metaData.tdCls = value ? 'tr-assert-row-ok-cell' : 'tr-assert-row-bug-cell';
        }

        return ''
    },


    descriptionRenderer : function (value, metaData, record, rowIndex, colIndex, store) {
    
        if (record.get('isSimulatedEvent')) {
            return '';
        } else if (record.get('type') == 'Siesta.Result.Diagnostic') {
            metaData.tdCls  =  'tr-diag-headercell';
            return '<h2>' + record.get('description') + '</h2>';
        }
    
        var annotation      = record.get('annotation')
    
        if (annotation) value += '<pre class="tr-assert-row-annontation">' + Ext.String.htmlEncode(annotation) + '</pre>'
    
        return value
    },


    setCanManageDOM : function (value) {
        if (value != this.canManageDOM) {
            this.canManageDOM = value
        
            if (value && !this.hidden) this.alignIFrame()
        }
    },


    getIFrame : function () {
        var test = this.testRecord.get('test')
    
        return this.canManageDOM && test.scopeProvider && test.scopeProvider.iframe
    },


    afterDOMContainerLayout : function () {
        if (!this.slots.domContainer.collapsed) this.alignIFrame() 
    },


    alignIFrame : function () {
        var domContainer    = this.slots.domContainer
        var iframe          = this.getIFrame()
    
        if (this.hidden || domContainer.collapsed || !iframe) return
    
        Ext.fly(iframe).setXY(domContainer.el.getXY())
        
        var containerSize       = domContainer.el.getSize()
        
        if (this.maintainMinViewportSize) {
            var minViewportSize     = this.minViewportSize
            
            containerSize.width     = Math.max(containerSize.width, minViewportSize && minViewportSize.width || 1024)
            containerSize.height    = Math.max(containerSize.height, minViewportSize && minViewportSize.height || 768)
        }
        
        Ext.fly(iframe).setSize(containerSize)
    },

    onDomContainerCollapse : function() {
        this.hideIFrame();
        this.viewDOM = false;
        this.fireEvent('viewdomchange', this, false);
    },

    onDomContainerExpand : function() {
        this.alignIFrame();
        this.viewDOM = true;
        this.fireEvent('viewdomchange', this, true);
    },

    hideIFrame : function () {
        var iframe          = this.getIFrame()
    
        iframe && Ext.fly(iframe).setLeftTop(-10000, -10000)
    },


    isFrameVisible : function () {
        return !(this.hidden || this.slots.domContainer.collapsed)
    },

    onRerun : function() {
        this.fireEvent('rerun', this);
    }
})
