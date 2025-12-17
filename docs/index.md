# Blog Plugin

## Basic usage

By default, the plugin looks for blog posts in a `posts` directory:

```{myst:demo}
:::{blog-posts}
:::
```

## Custom paths with glob patterns

The `:path:` option supports glob patterns, allowing you to organize posts in subfolders. For example, to include all markdown files in any subfolder:

```{myst:demo}
:::{blog-posts}
:path: posts/**/*.md
:::
```

This is useful when organizing posts by year or category:

```
posts/2024/post-one.md
posts/2025/post-two.md
```

## Limit the number of posts

You can limit the number of posts displayed:

```{myst:demo}
:::{blog-posts}
:limit: 1
:path: posts/**/*.md
:::
```
