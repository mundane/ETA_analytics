Ext.regStore('AnalyticsStore', {
    model: 'AnalyticsModel',
    sorters: [{
        property: 'date',
        direction: 'DESC'
    }],
    proxy: {
        type: 'localstorage',
        id: 'analytics-app-store'
    },
    getGroupString: function (record) {
		"use strict";
        if (record && record.data.date) {
            return record.get('date').toDateString();
        } else {
            return '';
        }
    }
});

AnalyticsApp.stores.analyticsStore = Ext.StoreMgr.get('AnalyticsStore');