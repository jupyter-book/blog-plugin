/**
 * Renders blog posts as a table with configurable columns
 */
export function renderTable(posts: any[], columns: string[]) {
  // Create header row
  const headerRow = {
    type: "tableRow",
    children: columns.map(col => ({
      type: "tableCell",
      header: true,
      children: [{ type: "text", value: col.charAt(0).toUpperCase() + col.slice(1) }],
    })),
  };

  // Create data rows - table cells are plain text for simplicity
  const dataRows = posts.map(post => ({
    type: "tableRow",
    children: columns.map(col => {
      const value = post.frontmatter[col as keyof typeof post.frontmatter];
      const textValue = value ? String(value) : "";

      // Wrap title column in link
      const content = col === "title"
        ? [{ type: "link", url: post.url, children: [{ type: "text", value: textValue }] }]
        : [{ type: "text", value: textValue }];

      return { type: "tableCell", children: content };
    }),
  }));

  return [{
    type: "table",
    class: "blog-posts",
    children: [headerRow, ...dataRows],
  }];
}