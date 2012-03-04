mondrian.stores.pages = new Ext.data.Store({

    model: Ext.regModel('', {
        fields: [
            {name:'id', type:'int'},
            {name:'title', type:'string'},
            {name:'content', type:'string'}
        ]
    }),

    data: [
        {id: 1, title: 'Introduction', content:
            "<p>Project management software is a term covering many types of software, including estimation and planning, scheduling, cost control and budget management, resource allocation, collaboration software, communication, quality management and documentation or administration systems, which are used to deal with the complexity of large projects.</p>" 
         },
         {id: 2, title: 'Graph', content:
             "hej hej" 
          },
        
    ]

});