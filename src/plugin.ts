import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { getFrontmatter } from "myst-transforms";
import { validatePageFrontmatter } from "myst-frontmatter";
import { fileError, fileWarn, RuleId } from "myst-common";
import type { DirectiveSpec } from "myst-common";
import { renderCards } from "./renderers/card.js";
import { renderTable } from "./renderers/table.js";

const blogPostsDirective: DirectiveSpec = {
  name: "blog-posts",
  doc: "Display preview cards for documents.",
  options: {
    limit: { type: Number, doc: "Number of posts." },
    path: { type: String, doc: "Path to posts. Supports glob patterns like 'posts/**/*.md' to include subfolders." },
    "default-title": { type: String, doc: "Default title if none given." },
    kind: { type: String, doc: "Display style: 'card' or 'table'. Default is 'card'." },
    "table-columns": { type: String, doc: "Comma-separated list of frontmatter fields to display as table columns. Default is 'title,date'." },
    sort: { type: String, doc: "Sort posts by field. Format: 'field-asc', 'field-desc', or just 'field' (defaults to asc). Default is 'date-desc'." },
  },
  run(data, vfile, ctx) {
    const size = (data.options?.limit as number | undefined) ?? 10;
    const searchPath = (data.options?.path as string | undefined) ?? "posts";
    const defaultTitle =
      (data.options?.["default-title"] as string | undefined) ??
      "<Untitled Post>";
    const kind = (data.options?.kind as string | undefined) ?? "card";

    // Support glob patterns in the path parameter
    // If the path contains glob patterns (*, ?, [, or **), use it directly
    // Otherwise, append *.md to match all markdown files in that directory
    const globPattern = /[*?\[]|\*\*/;
    const searchPattern = globPattern.test(searchPath)
      ? searchPath
      : join(searchPath, "*.md");

    const paths = globSync(searchPattern);

    // Collect post data from all files
    const posts = paths.map((path) => {
      const ext = extname(path);
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

      return {
        path,
        url: `/${path.toString().slice(0, -ext.length)}`,
        frontmatter: {
          ...frontmatter,
          title: frontmatter.title ?? defaultTitle,
        },
      };
    });

    // Sort posts (default: date-desc)
    const sortOption = (data.options?.sort as string | undefined) ?? "date-desc";
    const [field, order = 'asc'] = sortOption.split('-');
    const ascending = order === 'asc';

    posts.sort((a, b) => {
      const aValue = a.frontmatter[field as keyof typeof a.frontmatter];
      const bValue = b.frontmatter[field as keyof typeof b.frontmatter];

      // Empty values go at the end
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      // Alphanumeric comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr, undefined, { numeric: true });

      return ascending ? comparison : -comparison;
    });

    // Apply limit after sorting
    const limitedPosts = posts.slice(0, size);

    // Render as table or cards based on kind
    if (kind === "table") {
      const tableColumns = ((data.options?.["table-columns"] as string | undefined) ?? "title,date")
        .split(",")
        .map(c => c.trim())
        .filter(c => c.length > 0);
      return renderTable(limitedPosts, tableColumns);
    } else {
      return renderCards(limitedPosts, ctx);
    }
  },
};

const plugin = { name: "Blog posts", directives: [blogPostsDirective] };

export default plugin;
