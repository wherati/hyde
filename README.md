#  hyde

Stupid simple, node based, blog aware static site generator, similar in spirit to Jekyll - just in case you get tired of dealing with Ruby and think Gulp is great, like I did.

## Features
1. Markdown Blog Posts
    * supports syntax highlighting
    * front matter variables passed to templates
    * use your existing Jekyll posts immediately without change
    
2. Jade Templates
 	* create arbitrary number of templates with includes and mixins
 	* use them in pages directly or via Jade extension
 	* use them in posts via 'layout' of front-matter
 	* posts use a default layout if not defined in the front matter
 	* get any variables defined in post front-matter to the template
 	
 4. Sass
 	* What can I say? Sass is awesome.
 	
 3. Fast builds
 	* recompile only changed files
 	* in 'production' mode, build only posts marked 'status: published' in front-matter
 	    * this is what you sync to your live site
 	* live reload of browser in 'production' and 'development' modes
 		* includes dependency detection - change a layout and your posts update, live!
    
## Installation

The following will instal *hyde* and start your default browser to the default home page.

`git clone https://github.com/caasjj/hyde.git`

`cd hyde` 

`npm install`

`gulp`

## How to use

Directory `/src` is where the sources used to generate the site are stored.  This includes templates, styling, andy scripts and other assets.  

##### Create a page

1. create a directory with the resource name of the page
2. insert a `index.jade` file there.  
	* Any valid Jade goes here   
3. The page will automatically appear as a resource on your site.

For example, create `/src/pages/mypage` to `correspond http://myblog.com/mypage`

##### Create a post

1. Create a markedown file ending in `.md` (MUST end in `.md` or it will be ignored)
2. Add the front matter
	* title, summary are used by the default layout to display list of posts
	* if absent, post will be displayed with 'Untitled Post' and a note that no summary is available
	* to publish a post in production, add 'status: publish' (verbatim) to the front matter

##### Publish the site

Currently, the mode by which the site will be published is determined by an environment variable `SITE_BUILD_MODE`, which must be set to `production` to filter out all non-published posts.  But this is inconvenient, and will be moved to the command line in an upcoming update.

`gulp build` will create the production version of the site in the `/build` directory.  This directory can be published to any static server.
## Tech Used

* Node
* Gulp
* Jade
* BrowserSync

*I chose not to use ES6 because I thought the drawback of transpilation outweighed any benefits in a small, lightweight project like this.
At any rate, the whole project is essentially a handful of Gulp tasks, so it's a pretty simple to port.*