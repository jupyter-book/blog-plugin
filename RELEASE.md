# To make a release

1. **Create a new GitHub release**
   - Go to https://github.com/jupyter-book/blog-plugin/releases/new
   - Create a new tag (e.g., `v2.0.0`)
   - Click "Publish"

2. **Automatic build**
   - The `.github/workflows/release.yml` workflow will automatically:
     - Build the plugin (`npm run build`)
     - Attach `dist/plugin.mjs` to the release

3. **Users can then reference the release**
   ```yaml
   # In myst.yml
   project:
     plugins:
       - https://github.com/jupyter-book/blog-plugin/releases/latest/download/plugin.mjs
   ```
