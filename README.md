# Project course Software development

Android app, built using Sencha JavaScript library.

App folder contains the actual code, other folders just contain prototypes and the like.

Structure of app:

* App ->
	* controllers ->
		* AnalyticsController.js
	* lib ->
		* charts ->
			* touch-charts.js
		* touch ->
			* sencha-touch.css
			* sencha-touch.js
		* json2.js
		* parsecsv.js
	* models ->
		* GraphModel.js 
		* NoteModel.js
	* stores ->
		* AnalyticStore.js
		* GraphStore.js
	* views ->
		* AnalyticsImportView.js
		* DefaultView.js
		* MainView.js
		* NoteEditorView.js
		* NotesListView.js
	* app.css
	* app.js
	* index.html
	
	
## Documentation:

We use docco for our documentation

### Resources:

Docco can be found here: http://jashkenas.github.com/docco/

It is preferable to install using node.js package manager npm (else get it from github)

### Installation:

Install from npm: `npm -g install docco`

### Usage:

Use markup style to write documentation. Markdown syntax can be found here: http://daringfireball.net/projects/markdown/syntax

To generate documentation navigate to app/ and call:  

`docco app.js controllers/*.js models/*.js stores/*.js views/*.js `  

this will generate html files in `doc/`