mondrian.stores.pages = new Ext.data.Store({

    model: Ext.regModel('', {
        fields: [
            {name:'id', type:'int'},
            {name:'title', type:'string'},
            {name:'content', type:'string'}
        ]
    }),

    data: [
        {id: 2, title: 'Flowchart', icon:'2.png', content:'flow.js'},
        {id: 1, title: 'Graphs', icon:'1.png', content:'graph.js'},
          
    ]

});
