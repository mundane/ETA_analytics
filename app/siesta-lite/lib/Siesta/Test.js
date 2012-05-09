/*

Siesta 1.0.8
Copyright(c) 2009-2012 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test
@mixin Siesta.Test.More
@mixin Siesta.Test.Date 
@mixin Siesta.Test.Function 

`Siesta.Test` is a base testing class in Siesta hierarchy. Its not supposed to be created manually, instead, the harness will create it for you.

This file is a reference only, for a getting start guide and manual, please refer to <a href="#!/guide/siesta_getting_started">Getting Started Guide</a>.

Please note: Each test will be run in **its own**, completely **isolated** and **clean** global scope. **There is no need to cleanup anything**.

SYNOPSIS
========

    StartTest(function(t) {
        t.diag("Sanity")
        
        t.ok($, 'jQuery is here')
        
        t.ok(Your.Project, 'My project is here')
        t.ok(Your.Project.Util, '.. indeed')
        
        setTimeout(function () {
        
            t.ok(true, "True is ok")
        
        }, 500)
    })    


*/

Class('Siesta.Test', {
    
    does        : [ 
        Siesta.Test.More,
        Siesta.Test.Date,
        Siesta.Test.Function,
        JooseX.Observable
    ],
    
    
    has        : {
        url                 : { required : true },
        urlExtractRegex     : {
            is      : 'rwc',
            lazy    : function () {
                return new RegExp(this.url.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1") + ':(\\d+)')
            }
        },
        
        assertPlanned       : null,
        assertCount         : 0,
        
        results             : Joose.I.Array,
        
        run                 : { required : true },
        
        harness             : { required : true },
        
        // indicates that test has threw an exception (not related to failed assertions)
        failed              : false,
        failedException     : null,
        
        startDate           : null,
        endDate             : null,
        
        contentManager      : null,
        
        // the scope provider for the context of the test page
        scopeProvider       : null,
        // the context of the test page
        global              : { required : true },
        
        // the scope provider for the context of the test script
        // usually the same as the `scopeProvider`, but may be different in case of using `separateContext` option
        scriptScopeProvider : null,
        
        transparentEx       : false,
        
        needDone            : true,
        isDone              : false,
        
        defaultTimeout      : 15000,
        
        timeoutsCount       : 1,
        timeoutIds          : Joose.I.Object,
        idsToIndex          : Joose.I.Object,
        waitTitles          : Joose.I.Object,
        
        
        // indicates that test function has completed the execution (test may be still running due to async)
        processed           : false,
        
        callback            : null,
        
        // Nbr of exceptions detected while running the test
        nbrExceptions       : 0,
        testEndReported     : false,
        
        // only used for testing itself, otherwise should be always `true`
        needToCleanup           : true,
        
        overrideSetTimeout      : true,
        
        originalSetTimeout      : { required : true },
        originalClearTimeout    : { required : true }
    },
    
    
    methods : {
        
        toString : function() {
            return this.url
        },
        
        
        // deprecated
        plan : function (value) {
            if (this.assertPlanned != null) throw new Error("Test plan can't be changed")
            
            this.assertPlanned = value
        },
        
        
        addResult : function (result) {
            // check for class name for cross-context instances (happens during self-testing)
            var isAssertion = (result instanceof Siesta.Result.Assertion) || result.meta.name == 'Siesta.Result.Assertion'
            
            // only allow to add diagnostic results and todo results after the end of test
            // and only if "needDone" is enabled
            if (isAssertion && (this.isDone || this.isFinished()) && !result.isTodo)
                if (!this.testEndReported) {
                    this.testEndReported = true
                    
                    this.fail("Adding assertions after the test has finished.")
                }
            
            if (isAssertion) result.index = ++this.assertCount
            
            this.results.push(result)
            
            this.harness.onTestUpdate(this, result)
            
            /**
             * This event is fired when the individual test case receives new result (assertion or diagnostic message). 
             * 
             * This event bubbles up to the {@link Siesta.Harness harness}, you can observe it on harness as well. 
             * 
             * @event testupdate
             * @member Siesta.Test
             * @param {JooseX.Observable.Event} event The event instance
             * @param {Siesta.Test} test The test instance that just has started
             * @param {Siesta.Result} result The new result. Instance of Siesta.Result.Assertion or Siesta.Result.Diagnostic classes
             */
            this.fireEvent('testupdate', this, result)
        },
        

        /**
         * This method output the diagnostic message.  
         * @param {String} desc The text of diagnostic message
         */
        diag : function (desc) {
            this.addResult(new Siesta.Result.Diagnostic({
                description : desc
            }))
        },
        
        
        /**
         * This method add the passed assertion to this test.
         * 
         * @param {String} desc The description of the assertion
         * @param {String} annotation The additional description how exactly this assertion passes. Will be shown with monospace font.
         */
        pass : function (desc, annotation) {
            this.addResult(new Siesta.Result.Assertion({
                passed      : true,
                
                annotation  : annotation,
                description : desc
            }))
        },
        
        
        /**
         * This method returns a result of `Object.prototype.toString` applied to the passed argument. The `[object` and trailing `]` are trimmed. 
         * 
         * @param {Mixed} object
         * @return {String} The name of the "type" for this object.
         */
        typeOf : function (object) {
            return Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/\]$/, '')
        },
        
        /**
         * This method add the failed assertion to this test.
         * 
         * @param {String} desc The description of the assertion
         * @param {String/Object} annotation The additional description how exactly this assertion fails. Will be shown with monospace font.
         * 
         * Can be either string or an object with the following properties. In the latter case a string will be constructed from the properties of the object.
         * 
         * - `assertionName` - the name of assertion, will be shown in the 1st line, along with originating source line (in FF and Chrome only)
         * - `got` - an arbitrary JavaScript object, when provided will be shown on the next line
         * - `need` - an arbitrary JavaScript object, when provided will be shown on the next line
         * - `gotDesc` - a prompt for "got", default value is "Got", but can be for example: "We have" 
         * - `needDesc` - a prompt for "need", default value is "Need", but can be for example: "We need"
         * - `annotation` - A text to append on the last line, can contain some additional explanations
         * 
         *  The "got" and "need" values will be stringified to the "not quite JSON" notation. Notably the points of circular references will be 
         *  marked with `[Circular]` marks and the values at 4th (and following) level of depth will be marked with triple points: `[ [ [ ... ] ] ]`  
         */
        fail : function (desc, annotation) {
            if (annotation && this.typeOf(annotation) != 'String') {
                var strings             = []
                
                var params              = annotation
                var annotation          = params.annotation
                var assertionName       = params.assertionName
                var hasGot              = params.hasOwnProperty('got')
                var hasNeed             = params.hasOwnProperty('need')
                var gotDesc             = params.gotDesc || 'Got'
                var needDesc            = params.needDesc || 'Need'
                var sourceLine          = this.getSourceLine()
                
                if (assertionName || sourceLine) strings.push(
                    'Failed assertion ' + (assertionName ? '[' + assertionName + '] ' : '') + this.formatSourceLine(sourceLine)
                )
                
                if (hasGot && hasNeed) {
                    var max         = Math.max(gotDesc.length, needDesc.length)
                    
                    gotDesc         = this.appendSpaces(gotDesc, max - gotDesc.length + 1)
                    needDesc        = this.appendSpaces(needDesc, max - needDesc.length + 1)
                }
                
                if (hasGot)     strings.push(gotDesc   + ': ' + Siesta.Util.Serializer.stringify(params.got))
                if (hasNeed)    strings.push(needDesc  + ': ' + Siesta.Util.Serializer.stringify(params.need))
                
                if (annotation) strings.push(annotation)
                
                annotation      = strings.join('\n')
            }
            
            this.addResult(new Siesta.Result.Assertion({
                name        : assertionName,
                passed      : false,
                
                annotation  : annotation,
                description : desc
            }))
        },
        
        
        getSource : function () {
            return this.contentManager.getContentOf(this.url)
        },
        
        
        getSourceLine : function () {
            try {
                throw new Error()
            } catch (e) {
                if (e.stack) {
                    var match       = e.stack.match(this.urlExtractRegex())
                    
                    if (match) return match[ 1 ]
                }
                
                // TODO
//                if (typeof console != 'udefined' && console.trace) {
//                    var trace = console.trace()
//                }
                
                return null
            }
        },
        
        
        getStackTrace : function (e) {
            if (Object(e) !== e)    return null
            if (!e.stack)           return null
            
            var text            = e.stack
            var traceLineRegex  = /\((.*?)\)@(.*?):(\d+)/g;
            var match
            
            var result      = []
            
            for (var i = 0; match = traceLineRegex.exec(text); i++)
                if (i)
                    // other lines
                    result.push('at line ' + match[ 3 ] + ' of ' + match[ 2 ])
                else
                    // first line
                    result.push(match[ 1 ] + ' at line ' + match[ 3 ] + ' of ' + match[ 2 ])
                
            if (!result.length) return null
            
            return result
        },
        
        
        formatSourceLine : function (sourceLine) {
            return sourceLine ? 'at line ' + sourceLine + ' of ' + this.url : ''
        },
        
        
        appendSpaces : function (str, num) {
            var spaces      = ''
            
            while (num--) spaces += ' '
            
            return str + spaces
        },
        
        
        eachAssertion : function (func, scope) {
            scope       = scope || this
            
            var index   = 0
            
            Joose.A.each(this.results, function (result) {
                // check for class name for cross-context instances (happens during self-testing)
                if ((result instanceof Siesta.Result.Assertion) || result.meta.name == 'Siesta.Result.Assertion') func.call(scope, result, index++)
            })
        },
        
        
        /**
         * This assertion passes when the supplied `value` evalutes to `true` and fails otherwise.
         *  
         * @param {Mixed} value The value, indicating wheter assertions passes or fails
         * @param {String} desc The description of the assertion
         */
        ok : function (value, desc) {
            if (value) 
                this.pass(desc)
            else 
                this.fail(desc, {
                    assertionName       : 'ok', 
                    got                 : value, 
                    annotation          : 'Need "truthy" value'
                })
        },
        
        
        notok : function () {
            this.notOk.apply(this, arguments)
        },
        
        /**
         * This assertion passes when the supplied `value` evalutes to `false` and fails otherwise.
         * 
         * It has a synonym - `notok`.
         *  
         * @param {Mixed} value The value, indicating wheter assertions passes or fails
         * @param {String} desc The description of the assertion
         */
        notOk : function (value, desc) {
            if (!value) 
                this.pass(desc)
            else 
                this.fail(desc, {
                    assertionName       : 'notOk', 
                    got                 : value, 
                    annotation          : 'Need "falsy" value'
                })
        },
        
        
        /**
         * This assertion passes when the comparison of 1st and 2nd arguments with `==` operator returns true and fails otherwise.
         * 
         * @param {Mixed} got The value "we have" - will be shown as "Got:" in case of failure
         * @param {Mixed} expected The value "we expect" - will be shown as "Need:" in case of failure
         * @param {String} desc The description of the assertion
         */
        is : function (got, expected, desc) {
            if (got instanceof this.global.Date) {
                this.isDateEqual(got, expected, desc);
            } else if (got == expected)
                this.pass(desc)
            else
                this.fail(desc, {
                    assertionName       : 'is', 
                    got                 : got, 
                    need                : expected 
                })
        },
        

        
        isnot : function () {
            this.isNot.apply(this, arguments)
        },

        isnt : function () {
            this.isNot.apply(this, arguments)
        },
        
        
        /**
         * This assertion passes when the comparison of 1st and 2nd arguments with `!=` operator returns true and fails otherwise.
         * It has synonyms - `isnot` and `isnt`.
         * 
         * @param {Mixed} got The value "we have" - will be shown as "Got:" in case of failure
         * @param {Mixed} expected The value "we expect" - will be shown as "Need:" in case of failure
         * @param {String} desc The description of the assertion
         */
        isNot : function (got, expected, desc) {
            if (got != expected)
                this.pass(desc)
            else
                this.fail(desc, {
                    assertionName       : 'isnt', 
                    got                 : got, 
                    need                : expected,
                    needDesc            : 'Need, not'
                })
        },
        

        /**
         * This assertion passes when the comparison of 1st and 2nd arguments with `===` operator returns true and fails otherwise.
         * 
         * @param {Mixed} got The value "we have" - will be shown as "Got:" in case of failure
         * @param {Mixed} expected The value "we expect" - will be shown as "Need:" in case of failure
         * @param {String} desc The description of the assertion
         */
        isStrict : function (got, expected, desc) {
            if (got === expected)
                this.pass(desc)
            else
                this.fail(desc, {
                    assertionName       : 'isStrict', 
                    got                 : got, 
                    need                : expected,
                    needDesc            : 'Need strictly'
                })
        },

        
        isntStrict : function () {
            this.isNotStrict.apply(this, arguments)
        },
        
        /**
         * This assertion passes when the comparison of 1st and 2nd arguments with `!==` operator returns true and fails otherwise.
         * It has synonyms - `isntStrict`.
         * 
         * @param {Mixed} got The value "we have" - will be shown as "Got:" in case of failure
         * @param {Mixed} expected The value "we expect" - will be shown as "Need:" in case of failure
         * @param {String} desc The description of the assertion
         */
        isNotStrict : function (got, expected, desc) {
            if (got !== expected)
                this.pass(desc)
            else
                this.fail(desc, {
                    assertionName       : 'isntStrict', 
                    got                 : got, 
                    need                : expected,
                    needDesc            : 'Need, strictly not'
                })
        },
        
        
        /**
         * This method starts the "asynchronous frame". The test will wait for all asynchronous frames to complete before it will finalize.
         * The frame can be finished with the {@link #endWait} call. Unlike the {@link #beginAsync}, this method requires you to provide
         * the unique id for the asynchronous frame. 
         * 
         * For example:
         * 
         *      t.wait("require")
         *      
         *      Ext.require('Some.Class', function () {
         *      
         *          t.ok(Some.Class, 'Some class was loaded')
         *          
         *          t.endWait("require")
         *      })
         * 
         * 
         * @param {String} title The unique id for the asynchronous frame.
         * @param {String} howLong The maximum time (in ms) to wait until force the finalization of this async frame. Optional. Default time is 15000 ms.
         */
        wait : function (title, howLong) {
            if (this.waitTitles.hasOwnProperty(title)) throw new Error("Already doing a `wait` with title [" + title + "]")
            
            return this.waitTitles[ title ] = this.beginAsync(howLong)
        },
        
        
        /**
         * This method finalize the "asynchronous frame" started with {@link #wait}.
         * 
         * @param {String} title The id of frame to finalize, which was previously passed to {@link #wait} method
         */
        endWait : function (title) {
            if (!this.waitTitles.hasOwnProperty(title)) throw new Error("There were no call to `wait` with title [" + title + "]")
            
            this.endAsync(this.waitTitles[ title ])
            
            delete this.waitTitles[ title ]
        },
        
        
        
        /**
         * This method starts the "asynchronous frame". The test will wait for all asynchronous frames to complete before it will finalize.
         * The frame can be finished with the {@link #endAsync} call.
         * 
         * For example:
         * 
         *      var async = t.beginAsync()
         *      
         *      Ext.require('Some.Class', function () {
         *      
         *          t.ok(Some.Class, 'Some class was loaded')
         *          
         *          t.endAsync(async)
         *      })
         * 
         * 
         * @param {Number} time The maximum time (in ms) to wait until force the finalization of this async frame. Optional. Default time is 15000 ms.
         * @return {Object} The frame object, which can be used in {@link #endAsync} call
         */
        beginAsync : function (time) {
            var me                      = this
            var originalSetTimeout      = this.originalSetTimeout
            
            // in NodeJS `setTimeout` returns an object and not a simple ID, so we try hard to store that object under unique index
            // also using `setTimeout` from the scope of test - as timeouts in different scopes in browsers are mis-synchronized
            // can't just use `this.originalSetTimeout` because of scoping issues
            var timeoutId = originalSetTimeout(function () {
                me.endAsync(index)
            }, time || this.defaultTimeout)
            
            var index = this.timeoutsCount++
            
            this.timeoutIds[ index ] = timeoutId
            
            return index
        },
        
        
        /**
         * This method finalize the "asynchronous frame" started with {@link #beginAsync}.
         * 
         * @param {Object} frame The frame to finalize (returned by {@link #beginAsync} method
         */
        endAsync : function (index) {
            var originalSetTimeout      = this.originalSetTimeout
            var originalClearTimeout    = this.originalClearTimeout || this.global.clearTimeout
            var counter = 0
            
            if (index == null) Joose.O.each(this.timeoutIds, function (timeoutId, indx) {
                index = indx
                if (counter++) throw new Error("Calls to endAsync without argument should only be performed if you have single beginAsync statement") 
            })
            
            var timeoutId               = this.timeoutIds[ index ]
            
            // need to call in this way for IE < 9
            originalClearTimeout(timeoutId)
            delete this.timeoutIds[ index ]
            
            var me = this
            
            if (this.processed && !this.isFinished())
                // to allow potential call to `done` after `endAsync`
                originalSetTimeout(function () {
                    me.finalize()
                }, 1)
        },
        
        
        clearTimeouts : function () {
            var me                      = this
            var originalClearTimeout    = this.originalClearTimeout
            
            Joose.O.each(this.timeoutIds, function (value, id) {
                originalClearTimeout(value)
            })
            
            this.timeoutIds = {}
        },
        
        
        // deprecated
        skipIf : function (condition, why, code, howMany) {
            howMany = howMany || 1
            
            if (condition) {
                
                for (var i = 1; i <= howMany; i++) this.addResult(new Siesta.Result.Assertion({
                    passed      : true,
                    isSkipped   : true,
                    
                    description : 'SKIPPED: ' + why
                }))    
                
            } else
                code()
        },
        
        
        // deprecated
        skip : function (why, code, howMany) {
            this.skipIf(true, why, code, howMany)
        },
        
        
        /**
         * With this method you can mark a group of assertions as "todo", assuming they most probably will fail, 
         * but its still worth to try run them.
         * The supplied `code` function will be run, it will receive a new test instance as the 1st argument,
         * which should be used for assertions checks (and not the primary test instance, received from `StartTest`).
         * 
         * Assertions, failed inside the `code` block will be still treated by harness as "green".
         * Assertions, passed inside the `code` block will be treated by harness as bonus ones and highlighted.
         *
         * See also {@link Siesta.Test.ExtJS#knownBugIn} method.
         *
         * For example:

    t.todo('Scheduled for 4.1.x release', function (todo) {
    
        var treePanel    = new Ext.tree.Panel()
    
        todo.is(treePanel.getView().store, treePanel.store, 'NodeStore and TreeStore have been merged and there's only 1 store now);
    })

         * @param {String} why The reason/description for the todo
         * @param {Function} code A function, wrapping the "todo" assertions. This function will receive a special test class instance
         * which should be used for assertions checks
         */
        todo : function (why, code) {
            if (this.typeOf(why) == 'Function') why = [ code, code = why ][ 0 ]
            
            var todo  = new this.constructor({
                trait       : Siesta.Test.Todo,
                
                parent      : this,
                
                global      : this.global,
                url         : this.url,
                harness     : this.harness,
                run         : function () {},
                
                overrideSetTimeout      : false,
                originalSetTimeout      : this.originalSetTimeout,
                originalClearTimeout    : this.originalClearTimeout
            })
            
            var exception = this.global.StartTest.exceptionCatcher(function(){
                code(todo)
            })
            
            if (exception !== undefined) this.diag("TODO section threw an exception: [" + exception + "]")
        },
        
        
        failWithException : function (e) {
            this.failed             = true
            this.failedException    = e
            
            this.harness.onTestFail(this, e, this.getStackTrace(e))
            
            /**
             * This event is fired when the individual test case has threw an exception. 
             * 
             * This event bubbles up to the {@link Siesta.Harness harness}, you can observe it on harness as well.
             * 
             * @event testfailedwithexception
             * @member Siesta.Test
             * @param {JooseX.Observable.Event} event The event instance
             * @param {Siesta.Test} test The test instance that just has threw an exception
             * @param {Object} exception The exception thrown
             */
            this.fireEvent('testfailedwithexception', this, e);
            
            this.finalize(true)
        },
        
        
        start : function (alreadyFailedWithException, startNote) {
            if (this.startDate) {
                throw 'Test has already been started';
            }
            this.startDate  = new Date()
            
            this.harness.onTestStart(this)
            
            /**
             * This event is fired when the individual test case starts. 
             * 
             * This event bubbles up to the {@link Siesta.Harness harness}, you can observe it on harness as well. 
             * 
             * @event teststart
             * @member Siesta.Test
             * @param {JooseX.Observable.Event} event The event instance
             * @param {Siesta.Test} test The test instance that just has started
             */
            this.fireEvent('teststart', this);
            
            if (alreadyFailedWithException) {
                this.failWithException(alreadyFailedWithException)
                
                return
            }
            
            if (startNote) this.diag(startNote)
            
            var me                      = this
            var global                  = this.global
            
            var originalSetTimeout      = this.originalSetTimeout
            var originalClearTimeout    = this.originalClearTimeout
            
            // this.overrideSetTimeout
            if (this.overrideSetTimeout) {
                // see http://www.adequatelygood.com/2011/4/Replacing-setTimeout-Globally
                this.scopeProvider.runCode('var setTimeout, clearTimeout;')
                
                global.setTimeout = function (func, delay) {
                    
                    var index = me.timeoutsCount++
                    
                    // in NodeJS `setTimeout` returns an object and not a simple ID, so we try hard to store that object under unique index
                    // also using `setTimeout` from the scope of test - as timeouts in different scopes in browsers are mis-synchronized
                    var timeoutId = originalSetTimeout(function () {
                        originalClearTimeout(timeoutId)
                        delete me.timeoutIds[ index ]
                        
                        // if the test func has been executed, but the test was not finalized yet - then we should try to finalize it
                        if (me.processed && !me.isFinished())
                            // we are doing that after slight delay, potentially allowing to setup some other async frames in the "func" below
                            originalSetTimeout(function () {
                                me.finalize()
                            }, 1)
                        
                        func()
                        
                    }, delay)
    
                    // in NodeJS saves the index of the timeout descriptor to the descriptor
                    if (typeof timeoutId == 'object') 
                        timeoutId.__index = index
                    else
                        // in browser (where `timeoutId` is a number) - to the `idsToIndex` hash
                        me.idsToIndex[ timeoutId ] = index
                    
                    return me.timeoutIds[ index ] = timeoutId
                }
                
                global.clearTimeout = function (id) {
                    if (id == null) return
                    
                    var index
                    
                    // in NodeJS `setTimeout` returns an object and not a simple ID
                    if (typeof id == 'object') {
                        index       = id.__index
                        if (me.timeoutIds[ index ] != id) throw "Incorrect state"
                    } else {
                        index       = me.idsToIndex[ id ]
                        
                        delete me.idsToIndex[ id ]
                    }
                    
                    originalClearTimeout(id)
                    
                    if (index != null) delete me.timeoutIds[ index ]
                    
                    // if the test func has been executed, but the test was not finalized yet - then we should try to finalize it
                    if (me.processed && !me.isFinished())
                        // we are doing that after slight delay, potentially allowing to setup some other async frames after the "clearTimeout" will complete
                        originalSetTimeout(function () {
                            me.finalize()
                        }, 1)
                }
            }
            // eof this.overrideSetTimeout
            
            // we only don't need to cleanup up when doing a self-testing
            if (this.needToCleanup) this.scopeProvider.cleanupCallback = function () {
                if (me.overrideSetTimeout) {
                    global.setTimeout       = originalSetTimeout
                    global.clearTimeout     = originalClearTimeout
                }
                
                originalSetTimeout          = me.originalSetTimeout       = null
                originalClearTimeout        = me.originalClearTimeout     = null
                
                me.global                   = global = null
            }
            
            var run     = this.run
            
            if (this.transparentEx)
                run(me)
            else 
                var e = global.StartTest.exceptionCatcher(function(){
                    run(me)
                })
            
            if (e) {
                this.failWithException(e)
                
                return
            } 
            
            this.finalize()
        },
        
        
        finalize : function (force) {
            if (this.isFinished()) return
            
            this.processed = true
            
            if (force) this.clearTimeouts()
            
            if (!Joose.O.isEmpty(this.timeoutIds)) return
            
            if (!this.needDone && !this.isDone) {
                this.fireEvent('beforetestfinalizeearly')
                
                /**
                 * This event is fired before the individual test case ends (no any corresponded harness actions will be run yet).
                 * 
                 * This event bubbles up to the {@link Siesta.Harness harness}, you can observe it on harness as well.
                 * 
                 * @event beforetestfinalize
                 * @member Siesta.Test
                 * @param {JooseX.Observable.Event} event The event instance
                 * @param {Siesta.Test} test The test instance that is about to finalize
                 */
                this.fireEvent('beforetestfinalize');
            }
            
            this.endDate = new Date()

            this.harness.onTestEnd(this)
            
            /**
             * This event is fired when the individual test case ends (either because it has completed correctly and threw an exception).
             * 
             * This event bubbles up to the {@link Siesta.Harness harness}, you can observe it on harness as well.
             * 
             * @event testfinalize
             * @member Siesta.Test
             * @param {JooseX.Observable.Event} event The event instance
             * @param {Siesta.Test} test The test instance that just has completed
             */
            this.fireEvent('testfinalize', this);
            
            this.callback && this.callback()
            
//            // attempting to clear all references to scope, but with delay, to allow
//            // other potentially delayed actions to access `global` 
//            var me = this
//            
//            var originalSetTimeout          = me.originalSetTimeout
//            
//            // setTimeout from the scope of harness
//            originalSetTimeout(function () {
//                if (me.overrideSetTimeout) {
//                    me.global.setTimeout    = me.originalSetTimeout
//                    me.global.clearTimeout  = me.originalClearTimeout
//                }
//                
//                originalSetTimeout          = me.originalSetTimeout       = null
//                me.originalClearTimeout     = null
//                
//                me.global                   = null
//            }, 700)
        },
        
        
        getSummaryMessage : function (lineBreaks) {
            var res = []
            
            var passCount       = this.getPassCount()
            var failCount       = this.getFailCount()
            var assertPlanned   = this.assertPlanned
            var total           = failCount + passCount
            
            res.push('Passed: ' + passCount)
            res.push('Failed: ' + failCount)
            
            if (!this.failed) {
                // there was a t.plan() call
                if (assertPlanned != null) {
                    if (total < assertPlanned) 
                        res.push('Looks like you planned ' + assertPlanned + ' tests, but ran only ' + total)
                        
                    if (total > assertPlanned) 
                        res.push('Looks like you planned ' + assertPlanned + ' tests, but ran ' +  (total - assertPlanned) + ' extra tests, ' + total + ' total.')
                    
                    if (total == assertPlanned && !failCount) res.push('All tests passed')
                } else {
                    if (!this.isDoneCorrectly()) res.push('Test has completed, but there were no `t.done()` call. Add it at the bottom, or use `t.beginAsync()` for asynchronous code')
                    
                    if (this.isDoneCorrectly() && !failCount) res.push('All tests passed')
                }
                
            } else {
                var stack = this.getStackTrace(this.failedException)
                if (stack)
                    res.push.apply(res, [ 'Test suite threw an exception: ' + this.failedException].concat(stack))
                else
                    res.push('Test suite threw an exception: ' + this.failedException)
            }
            
            return res.join(lineBreaks || '\n')
        },
        
        
        /**
         * This method indicates that test has completed at the expected point and no more assertions are planned. Adding assertions after the call to `done`
         * will add a failing assertion "Adding assertion after test completion".
         * 
         * @param {Number} delay Optional. When provided, the test will not complete right away, but will wait for `delay` milliseconds for additional assertions. 
         */
        done : function (delay) {
            var me      = this
            
            if (delay) {
                var async = this.beginAsync()
                
                var originalSetTimeout = this.originalSetTimeout
                
                originalSetTimeout(function () {
                    
                    me.endAsync(async)
                    me.done() 
                
                }, delay)
                
            } else {
                this.fireEvent('beforetestfinalizeearly')
                this.fireEvent('beforetestfinalize');
                
                this.isDone = true
                
                if (this.processed) this.finalize()
            }
        },
        
        // `isDoneCorrectly` means that either test does not need the call to `done`
        // or the call to `done` has been already made
        isDoneCorrectly : function () {
            return !this.needDone || this.isDone
        },
        
        
        getPassCount : function () {
            var passCount = 0
            
            this.eachAssertion(function (assertion) {
                if (assertion.passed && !assertion.isTodo) passCount++
            })
            
            return passCount
        },

        getTodoPassCount : function () {
            var todoCount = 0;
            
            this.eachAssertion(function (assertion) {
                if (assertion.isTodo && assertion.passed) todoCount++;
            });
            
            return todoCount;
        },

        getTodoFailCount : function () {
            var todoCount = 0;
            
            this.eachAssertion(function (assertion) {
                if (assertion.isTodo && !assertion.passed) todoCount++;
            });
            
            return todoCount;
        },
        
        
        getFailCount : function () {
            var failCount = 0
            
            this.eachAssertion(function (assertion) {
                if (!assertion.passed && !assertion.isTodo) failCount++
            })
            
            return failCount
        },
        
        
        isPassed : function () {
            var passCount       = this.getPassCount()
            var failCount       = this.getFailCount()
            var assertPlanned   = this.assertPlanned
            
            return this.isFinished() && !this.failed && !failCount && (
                assertPlanned != null && passCount == assertPlanned
                    ||
                assertPlanned == null && this.isDoneCorrectly()
            )
        },
        
        
        isFailed : function () {
            var passCount       = this.getPassCount()
            var failCount       = this.getFailCount()
            var assertPlanned   = this.assertPlanned
            
            return this.failed || failCount || (
            
                this.isFinished() && ( 
                    assertPlanned != null && passCount != assertPlanned
                        ||
                    assertPlanned == null && !this.isDoneCorrectly()
                )
            )
        },
        
        
        isFailedWithException : function () {
            return this.failed
        },
        
        
        isStarted : function () {
            return this.startDate != null
        },
        
        
        isFinished : function () {
            return this.endDate != null
        },
        
        
        getDuration : function () {
            return this.endDate - this.startDate
        },
        
        getBubbleTarget : function () {
            return this.harness;
        }
    }
        
})
//eof Siesta.Test