﻿var App = new Ext.Application({
    name: 'AnalyticsApp',
    useLoadMask: true,

    launch: function () {
		"use strict";
        Ext.dispatch({
            controller: AnalyticsApp.controllers.analyticsController,
            action: 'index'
        });
    }
});