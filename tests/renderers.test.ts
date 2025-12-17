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
});
