/**
 * For now this is a super minimal test suite to just make sure it builds!
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

// Assumes that we've already built the docs for this
const buildPath = 'docs/_build/site/content/index.json';

function findBlogPostNodes(node: any): any[] {
  let results: any[] = [];
  if (node?.class === 'blog-posts') results.push(node);
  if (node?.children) {
    for (const child of node.children) {
      results = results.concat(findBlogPostNodes(child));
    }
  }
  return results;
}

describe('blog-posts plugin', () => {
  it('renders blog-posts nodes', () => {
    const ast = JSON.parse(readFileSync(buildPath, 'utf-8')).mdast;
    const nodes = findBlogPostNodes(ast);

    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.some((n: any) => n.type === 'card')).toBe(true);
    expect(nodes.some((n: any) => n.type === 'table')).toBe(true);
  });

  it('sorts posts by title', () => {
    const ast = JSON.parse(readFileSync(buildPath, 'utf-8')).mdast;
    const tables = findBlogPostNodes(ast).filter((n: any) => n.type === 'table');

    expect(tables.length).toBeGreaterThan(0);

    // Find a table and extract titles
    const getTitles = (table: any) => table.children
      .slice(1) // Skip header row
      .map((row: any) => row.children[0].children[0].children[0].value);

    // Last two tables should be the sort examples (title asc, title desc)
    const lastTwoTables = tables.slice(-2);
    expect(lastTwoTables.length).toBe(2);

    const ascTitles = getTitles(lastTwoTables[0]);
    const descTitles = getTitles(lastTwoTables[1]);

    // Verify they're sorted
    expect(ascTitles).toEqual([...ascTitles].sort());
    expect(descTitles).toEqual([...descTitles].sort().reverse());
  });
});
