# MyST Blog Plugin

A MyST plugin load blog posts from a file system and display them as a listing.

## Basic usage

See the [documentation](https://jupyter-book.github.io/blog-plugin) for more usage.

```md
:::{blog-posts}
:::
```

## Repository structure

- `docs/` - project documentation, written as a MyST site
- `src/` - plugin source-code
- `noxfile.py` - several commands that we use to automate docs preview and building
- `github` - workflows to build and publish this plugin to GitHub Pages and make releases.

## Build the bundle

The `esbuild` tool takes `plugin.ts` and its dependencies as inputs, and generates a `dist/plugin.mjs` bundle. This bundle can be directly loaded by MyST without requiring a build or install step.

The `build` script defined in `package.json` shows an example of using `esbuild` to generate an `mjs` module. It can be invoked by running

```shell
npm run build
```

## Using the bundled plugin

The output MyST plugin can be loaded into a MyST project in several ways. The user may wish to download the plugin to their local filesystem, and write the following `myst.yml`:

```yaml
project:
  plugins:
    - /path/to/plugin.mjs
```

Alternatively, you can use the published (released) plugin bundle directly from GitHub. Here's an example of pulling in the _latest_ release:

```yaml
project:
  plugins:
    - https://github.com/jupyter-book/blog-plugin/releases/latest/download/plugin.mjs
```
