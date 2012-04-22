Ext.regStore('GraphStore', {
    model: 'GraphModel',
    sorters: [{
        property: 'date',
        direction: 'DESC'
    }],
    proxy: {
        type: 'localstorage',
        id: 'analytics-app-store'
    },
	data: [
		{id: 1, title: 'Flowchart', desc: 'Flowcharting gone wild'},
		{id: 2, title: 'Chart', desc: 'Flowcharting gone wild'},
		{id: 3, title: 'Barchart', desc: 'Flowcharting gone wild'},
		{id: 4, title: 'Scatterchart', desc: 'Flowcharting gone wild'}
	]
   
});

AnalyticsApp.stores.graphStore = Ext.StoreMgr.get('GraphStore');
