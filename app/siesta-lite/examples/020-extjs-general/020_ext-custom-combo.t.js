StartTest(function(t) {
    
    t.diag("Testing one of the online Sencha examples.");

    t.waitForXType('combobox', function(cmps) {
        var combo = cmps[0],
            loadTriggered = false,
            store = combo.store;

        t.is(store.getCount(), 0, 'Store is empty before we start typing');

        store.on('beforeload', function() {
            loadTriggered = true;
            t.is(combo.getValue().length, 4, 'Store is loading when we entered 4 characters');
        });
    
        t.click(combo, function() {
            t.type(combo, 'gri', function() {
                t.notOk(loadTriggered, 'Store load not triggered when typing < 4 chars');

                t.type(combo, 'd', function() {
                    t.waitForStoresToLoad(store, function() {
                        t.ok(loadTriggered, 'Store load was triggered when typing 4 chars');

                        t.waitFor(
                            function() { return Ext.getBody().down('.x-tbar-page-next'); },
                            function(el) { 
                                t.click(el, function() {
                                    t.waitForStoresToLoad(store, function() {
                                        t.pass('Store load was triggered when clicking paging button');
                                    });
                                });
                            }
                        );
                    });
                });
            });
        });
    });
});