# MyST Blog Plugin

A MyST plugin load blog posts from a file system and display them as a listing.

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

Alternatively, you can publish the built plugin to a public artifact repository, and users can directly link to it in their `myst.yml`:

```yaml
project:
  plugins:
    - https://www.someone-elses-myst-plugins.com/plugin.mjs
```
