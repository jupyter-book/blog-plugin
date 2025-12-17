/**
 * Renders blog posts as cards with title, subtitle, description, and date
 */
export function renderCards(posts: any[], ctx: any) {
  return posts.map(post => {
    const descriptionItems = post.frontmatter.description
      ? ctx.parseMyst(post.frontmatter.description).children
      : [];
    const subtitleItems = post.frontmatter.subtitle
      ? ctx.parseMyst(post.frontmatter.subtitle).children
      : [];
    const footerItems = post.frontmatter.date
      ? [
          {
            type: "footer",
            children: [
              ctx.parseMyst(`**Date**: ${post.frontmatter.date}`)["children"][0],
            ],
          },
        ]
      : [];

    return {
      type: "card",
      class: "blog-posts",
      children: [
        {
          type: "cardTitle",
          children: ctx.parseMyst(post.frontmatter.title).children,
        },
        ...subtitleItems,
        ...descriptionItems,
        ...footerItems,
      ],
      url: post.url,
    };
  });
}
