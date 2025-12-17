import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { extname, basename, join } from "node:path";
import { getFrontmatter } from "myst-transforms";
import { validatePageFrontmatter } from "myst-frontmatter";
import { fileError, fileWarn, RuleId } from "myst-common";
import type { DirectiveSpec } from "myst-common";

const blogPostsDirective: DirectiveSpec = {
  name: "blog-posts",
  doc: "Display preview cards for documents.",
  options: {
    limit: { type: Number, doc: "Number of posts." },
    path: { type: String, doc: "Path to posts. Supports glob patterns like 'posts/**/*.md' to include subfolders." },
    "default-title": { type: String, doc: "Default title if none given." },
  },
  run(data, vfile, ctx) {
    const size = (data.options?.limit as number | undefined) ?? 3;
    const searchPath = (data.options?.path as string | undefined) ?? "posts";
    const defaultTitle =
      (data.options?.["default-title"] as string | undefined) ??
      "<Untitled Post>";

    // Support glob patterns in the path parameter
    // If the path contains glob patterns (*, ?, [, or **), use it directly
    // Otherwise, append *.md to match all markdown files in that directory
    const globPattern = /[*?\[]|\*\*/;
    const searchPattern = globPattern.test(searchPath)
      ? searchPath
      : join(searchPath, "*.md");

    const paths = globSync(searchPattern).sort().reverse(); // For now, string sort
    const nodes = paths.map((path) => {
      const ext = extname(path);
      const name = basename(path, ext);
      const content = readFileSync(path, { encoding: "utf-8" });
      const ast = ctx.parseMyst(content);
      const frontmatter = validatePageFrontmatter(
        getFrontmatter(vfile, ast).frontmatter,
        {
          property: "frontmatter",
          file: vfile.path,
          messages: {},
          errorLogFn: (message) => {
            fileError(vfile, message, {
              ruleId: RuleId.validPageFrontmatter,
            });
          },
          warningLogFn: (message) => {
            fileWarn(vfile, message, {
              ruleId: RuleId.validPageFrontmatter,
            });
          },
        },
      );
      const descriptionItems = frontmatter.description
        ? ctx.parseMyst(frontmatter.description).children
        : [];
      const subtitleItems = frontmatter.subtitle
        ? ctx.parseMyst(frontmatter.subtitle).children
        : [];
      const footerItems = frontmatter.date
        ? [
            {
              type: "footer",
              // Pull out the first child of `root` node.
              children: [
                ctx.parseMyst(`**Date**: ${frontmatter.date}`)["children"][0],
              ],
            },
          ]
        : [];
      return {
        type: "card",
        children: [
          {
            type: "cardTitle",
            children: ctx.parseMyst(frontmatter.title ?? defaultTitle).children,
          },
          ...subtitleItems,
          ...descriptionItems,
          ...footerItems,
        ],
        url: `/${path.toString().slice(0, -ext.length)}`,
      };
    });
    return Array.from(nodes).slice(0, size);
  },
};

const plugin = { name: "Blog posts", directives: [blogPostsDirective] };

export default plugin;
