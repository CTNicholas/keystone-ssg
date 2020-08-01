![Keystone logo](https://github.com/CTNicholas/keystone-ssg/raw/master/keystone_logo_small.png)
# Why Keystone?
Keystone is a static-site generator ideal for quickly building small websites. No setup required, and a collection of handy features are enabled by default.
# Features
- Easy install & setup, one command and ready to go
- Auto-refresh development server
- Use templates and reusable partials/imports, with slots
- Automatic routing, just upload `/public` and you're ready to go
- Babel, SCSS, & Markdown support enabled by default, source maps in development mode
- JS & CSS minifying and bundling (with Rollup)
- Dynamic link loading (no page reload)
- Search index file generator, for easy website searching

# Getting Started
## Install
Create a new directory and run the following command to setup Keystone, package.json, & git. *Node 14.x.x required.*
```
$  npm install keystone-ssg
```
Great, you're installed!
## Development server
Start the Keystone development server, and then go to http://localhost:8080 to see the example website.
```
$ npm run dev
```
## Build project
The project is built within the `/public` folder after running the command, ready for upload.
```
$ npm run build
```
# Building your website
There are six important directories within a Keystone project, each with their own purpose:

## Pages
Every HTML `.html` & markdown `.md` file in the pages folder corresponds to a page on your website. There are two files in the example project in here, try opening `index.html`. The automatic routing will bundle the files to the `/public` folder upon running `npm run build` like so:
```
/pages/index.html   ->  /public/index.html
/pages/example.md ->  /public/example/index.html
```
You may have noticed that `index.html` has the following tag: `<_template basic.html />`. This places the contents of `index.html` inside the slotted template file at `/templates/basic.html`. This custom HTML tag format works inside `.md` files too.
## Templates
Templates can be used with `/pages` to provide a ready-made framework for your pages. Use a `<_slot />` tag within the template file to provide an entry point for your content. Open `/templates/basic.html` and look for:
```html
<_var title default="Keystone default title" />
```
This is a variable slot, named `title`, in a template file, with an optional default value. 

Using the following as a template tag inside of `/pages` will allow you to enter a custom value into the template, from a content page:
```html
<_template basic.html title="A custom title" />
```
## Components
The `/components` folder is simply used for reusable components. The `<_import>` tag is used to import components into other HTML files, an example of which is inside `/templates/basic.html`.
```html
<_import header.html />
```
The `<_import>` tag can also be used to import the contents of any other kind of file (JS, SCSS etc), after first bundling the source.
## Src
Place Javascript files within the `/src` folder. The following tag will be converted to a regular `<script>` import tag, linking to your file `/src/main.js`:
```html
<_script main.js />
```
ES6 imports are fully supported, and the resulting file will be transpiled with Babel, bundled with Rollup, and minified.
## Styles
The `/styles` folder is used for your CSS/SCSS. The following tag will be converted to a regular `<link>` css import tag, linking to your compiled `/styles/main.scss` file:
```html
<_style main.scss />
```
All `node-sass` features are fully supported, including `@import`.
## Assets
Static assets are placed here, ie fonts, images, icons. Everything here will be transferred to it's corresponding folder in the root directory, for example:
```
/assets/favicon.ico -> /public/favicon.ico
/assets/fonts/fontname.ttf -> /public/fonts/fontname.ttf
```
# Notes
## Keystone HTML tags
- Every custom Keystone HTML tag can be used *anywhere* within an HTML file, even within other HTML attributes, apart from in other Keystone tags.
- For all custom Keystone tags, alternatively, you can use a src attribute to target a file in any folder: `<_template src='myfolder/myfile.html' />`. 
- All paths are relative to the folder containing `package.json`, do not use an initial slash unless you'd like to access a file outside of the project.
- Keystone HTML tag attributes can use 'single' "double" or \`backtick\` quote marks.
## Dynamic loading
- Dynamic loading fetches the local website link and replaces the content of the current page with the new page, without reloading and switching pages.
- While dynamic loading is enabled, page state (eg input values, scroll position) is not saved when using the back button.
- When a link is clicked, the `.keystone-page-loading` class is set to `display: block`. If the class is set to `display: none` in the CSS, this can be used to create a loading indicator.
- Disable dynamic loading in keystone.config.js.
## Search index generator
- The search index generator generates a file, `search.json`, in the root directory This is a JSON array containing an object for each page, listing the text content, title, and path of the page.
- All HTML tags are stripped from the page, and only the text is kept and stored.
- This file can be fetched and queried be a website search function, to easily find which page contains which content.
- Disable the search bar helper in keystone.config.js.
## Miscellaneous
- The `public` folder is ignored by Git, remove the `public` line from `.gitignore` should you wish to use to commit it to Git.

# API
## Tags
Tag | Description | Attributes
-|-|-
`<_template>` | Imports the current file into a `<_slot>` within the template file | [file name], [variable name], src
`<_slot>` | Used within a template file as an entry point for the imported file | *None*
`<_var>` | Used within a template file to be replaced by a variable taken from `<_template>` | [variable name], default
`<_import>` | Imports a component | [file name], src
`<_script>` | Creates a `<script>` tag linking to the bundled script | [file name], src
`<_style>` | Creates a `<link>` tag linking to the bundled css file | [file name], src

## NPM Commands
Command | Description | Output differences
-|-|-
`npm run dev` | Builds the website for development, then starts the Keystone development server. | <ul><li>Inline source maps are generated.</li><li>Development server script is injected.</li></ul>
`npm run build` | Builds the website for production. | <ul><li>Bundle is compacted & minified.</li></ul>

## Config file
The config file is `keystone.config.js`
Option | Description | Default
-|-|-
dynamicLinks | Enables dynamically loaded local links on your Keystone website, no refresh needed | true
searchFile | Generates `search.json` in the root directory | true
indexPath | The root directory of your website | '/'
port | The dev server port, localhost:**8080** | 8080
portWs | A second port used for the dev server | 8081
devServerIp | The location of the dev server, **localhost**:8080. Replace with your device's local IP to view dev server on local devices (example: '192.168.1.103'). | 'localhost'
watched | The directories watched by the Keystone dev server, that will force a recompilation and page refresh when files are edited | ['templates', 'pages', 'assets', 'components', 'src', 'styles']
build | The content page directory | 'pages'
served | The directory containing the generated website | 'public'

## Default directory layout
```
| empty-keystone-project
--| .git/
--| assets/
--| components/
--| pages/
--| src/
--| styles/
--| templates/
--| keystone.config.js
--| package.json
--| package-lock.json
```
















