StartTest(function(t) {
    
	//==================================================================================================================================================================================
    t.diag("Siesta.Test.More methods")

    t.testGeneric(function (t) {
        
        t.chain(
            function (next) {
                t.is(arguments.length, 1, 'Only 1 argument for 1st step')
                
                next(1, 1, 2)
            },
            function (next) {
                t.is(arguments.length, 4, '4 arguments for 2nd step')
                
                t.isDeeply(Array.prototype.slice.call(arguments, 1), [ 1, 1, 2 ], 'Correct arguments received from previous step' )
                    
                // not just `setTimeout(next, 100)` because in FF, next will receive 1 argument
                setTimeout(function () {
                    next()
                }, 100)
            },
            function (next) {
                t.is(arguments.length, 1, '1 argument')
            }
        )
        
    })
    
})
