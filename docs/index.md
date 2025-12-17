# Blog Plugin

## Basic usage

First, ensure your blog posts are defined in the table of contents of your `myst.yml` file:

```yaml
project:
  toc:
    - pattern: posts/**/*.md
```

List the blog posts in a folder with the following directive:

```{myst:demo}
% By default, the plugin looks for markdown files in a `posts` directory
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

## Table view

For blogs with many posts, you can use a more compact table layout instead of cards:

```{myst:demo}
:::{blog-posts}
:kind: table
:path: posts/**/*.md
:::
```

By default, the table displays `title` and `date` columns. The title column is automatically linked to the post.

## Custom table columns

You can customize which frontmatter fields to display as columns using the `:table-columns:` option:

```{myst:demo}
:::{blog-posts}
:kind: table
:table-columns: title, date, subtitle
:path: posts/**/*.md
:::
```

Or reverse the date:

```{myst:demo}
:::{blog-posts}
:kind: table
:table-columns: date, title, subtitle
:path: posts/**/*.md
:::
```

Any frontmatter field can be used as a column!

## Sorting posts

You can customize sorting with the `:sort:` option. This takes a form like:

```
:::{blog-posts]
:sort: [column]-[asc/desc]
:::
```

Where `[column]` is a field in each post's YAML metadata, and `asc/desc` corresponds to alphanumeric sort ascending or descending. Omitting the `-[asc/desc]` will default to `-asc`. For example:

```{myst:demo}
:::{blog-posts}
:sort: title
:kind: table
:path: posts/**/*.md
:::
```

```{myst:demo}
:::{blog-posts}
:sort: title-desc
:kind: table
:path: posts/**/*.md
:::
```

Posts with missing values for the sort field are placed at the end.
