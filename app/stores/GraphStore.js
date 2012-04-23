Ext.regStore('GraphStore', {
    model: 'GraphModel',
	data: [
		{id: 1, title: 'Flowchart', desc: 'Flowcharting gone wild'},
		{id: 2, title: 'Chart', desc: 'Flowcharting gone wild'},
		{id: 3, title: 'Barchart', desc: 'Flowcharting gone wild'},
		{id: 4, title: 'Scatterchart', desc: 'Flowcharting gone wild'}
	], 
	autoload: 'true'
});

AnalyticsApp.stores.graphStore = Ext.StoreMgr.get('GraphStore');

