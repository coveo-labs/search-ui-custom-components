# search-ui-custom-components

UI components extending Coveo's Search UI components.

All Custom components are located under the folder `src/components/`

### Installation

```
npm install
```

### Usage

```
npm run build
```

This will builds the entire project (CSS, TypeScript, etc.) and generate its output in the `./bin` folder. If you want to choose which component to compile, you can modify the file `./src/Components.ts`.

## Dev Server

```
npm run dev
```

This will start a webpack-dev-server instance (see Webpack Dev Server).

You can now load [localhost:8080](http://localhost:8080) in a web browser.

Any time you hit Save in a source file, the Coveo static resources will be recompiled by webpack and can be accessible through the `public/` route.

If you need to modify the content of the search page (i.e., the markup itself, not the TypeScript code), modify the index.ejs page under `./views`, then reload your browser.
