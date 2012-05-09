Intro
---------

Running the test suite manually in browsers is very convenient as it allows you to easily debug your tests. However, when
setting up a continuous integration process, it quickly becomes time-consuming - ideally you need to run the test suite
in each and every browser after (or before) each and every commit.

This guide describes how you can automate the launching of a test suite.

**Please note:** This functionality is only available in Siesta Standard package.  


Running tests in PhantomJS
---------

With this option, your tests will run the in a headless Webkit browser. It's very suitable for Linux servers w/o any graphical interface and browsers installed. 

{@img images/phantomjs.png}

To launch the test suite in PhantomJS, run the following command.

On Linux:

    > __SIESTA__/bin/phantomjs http://yourproject/tests/index.html [--filter filter]
    
On Windows:

    > __SIESTA__\bin\phantomjs http://yourproject/tests/index.html [--filter filter]
    
Here, the `__SIESTA__` placeholder is the path to your siesta package. The launch script `bin/phantomjs` accepts 2 arguments - the URL to your html wrapper for the Siesta harness (`index.html`)
and an optional "filter" - to match the test URL against a regular expression. When provided, only the tests with urls matching this filter be executed. For example, to only run the tests with the "header" string in url:

    > __SIESTA__/bin/phantomjs http://yourproject/tests/index.html --filter "header"
    
In case of any failures in the test suite, the command will exit with a non-zero exit code.

Note, using PhantomJS on Linux systems w/o X server will require the `xvfb` package.  


Running tests in several browsers using Selenium
---------

You can automate the launching of your test suite in several browsers, using Selenium. Unlike PhantomJS, it requires the precense of actual browsers in the operation system.  

On Linux:

    > __SIESTA__/bin/selenium http://yourproject/tests/index.html [OPTIONS]
    
On Windows:

    > __SIESTA__\bin\selenium http://yourproject/tests/index.html [OPTIONS]
    
Here, the `__SIESTA__` placeholder is the path to your Siesta package. The launch script `bin/selenium` accepts the URL to your html wrapper for Siesta harness (`index.html`)
and several optional options.

Options should start with double minus, e.g: `--host 8081`:

- `browser browsername` - can be one of "firefoxproxy / googlechrome / iexploreproxy / safariproxy / opera"'. This option can be repeated several times. Default value is `*`, meaning all available browsers.
By default, all browsers will run the test suites simultaneously, you can disable this using `sequential` configuration option. 
- `host localhost`           - host for selenium server.
- `port 4444`                - port for selenium server. If server can not be found on the specified host/port, this command will try to launch it. 
- `filter filter_value`      - a text of regexp to filter the urls of tests
- `verbose` - will enable various diagnostic messages
- `sequential` - will enable the sequential execution mode - only one browser will be active at a time.

In case of any failures in the test suite the command will exit with non-zero exit code.


Running a distributed test suite using Selenium Grid
---------

You can also distribute the machines running your test suite across your network, using Selenium Grid. This will greatly speed up the tests execution. You will need:

1. Launch the Selenium Hub - central point managing all nodes.

2. Launch several Selenium RC nodes (possibly on different machines) and register them in the hub.

3. Use the same `bin/selenium` command to launch your test suite, specifying the `host` and `port` of the Hub.

Please refer to this manual: <http://code.google.com/p/selenium/wiki/Grid2>


Reporting the results of test suite execution in the structured format.
---------

You can also export the results of test suite execution in the structured format. To do that, provide the `--report-format` option to the phantomjs or selenium launcher.

Currently the only supported formats are "JSON" and "JUnit". JSON report will generate the JSON object of the following structure:

    {
        "testSuiteName": "Siesta self-hosting test suite",
        "startDate": 1328175530085,
        "endDate": 1328175531472,
        "status": "PASS",
        "testCases": [{
            "url": "010_sanity.t.js",
            "startDate": 1328175531445,
            "endDate": 1328175531452,
            "status": "PASS",
            "assertions": [{
                "status": "PASS",
                "description": "Siesta is here",
                "annotation": "",
                "isTodo": false
            }, {
                "status": "PASS",
                "description": "Siesta.Test is here",
                "annotation": "",
                "isTodo": false
            }, {
                "status": "PASS",
                "description": "Siesta.Harness is here",
                "annotation": "",
                "isTodo": false
            }]
        }]
    }

Obviously "JUnit" format will generate a report in the JUnit XML format.

When providing this option for phantomjs you will also need to provide the `--report-file` option, indicating the file, the report will be saved to.

When providing this option for selenium you will also need to provide the `--report-file-prefix` option. Its has slightly different meaning from PhantomJS, because Selenium launcher can run the
test suite in several browsers, effectively generating several reports. These reports will be saved into different files, first part of the file name will be specified with the `report-file-prefix`
option, and second - with the browser name. The value for this option may have an extension, which will be preserved.

For example, specifying: `--report-file-prefix=report_.json` will save the reports to: `report_firefoxproxy.json`, `report_iexploreproxy.json`, etc
 

Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>

Support
---------

Ask a question in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

Share your experience in our IRC channel: [#bryntum](http://webchat.freenode.net/?randomnick=1&channels=bryntum&prompt=1)

Please report any bugs through the web interface at <https://www.assembla.com/spaces/bryntum/support/tickets>


See also
---------

Web page of this product: <http://bryntum.com/products/siesta>

Other Bryntum products: <http://bryntum.com/products>


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2011, Bryntum AB & Nickolay Platonov

All rights reserved.