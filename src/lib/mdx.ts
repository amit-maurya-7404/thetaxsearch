export async function getPosts() {
  // Mock blog posts - in production, read from content/posts/*.mdx
  return [
    {
      slug: "gst-compliance-guide",
      title: "Complete Guide to GST Compliance in 2024",
      description:
        "Everything you need to know about GST registration, filing returns, and maintaining compliance...",
      date: "Nov 15, 2024",
      tags: ["GST", "Compliance", "2024"],
      readingTime: 8,
      content: "GST compliance guide content...",
    },
    {
      slug: "income-tax-new-regime",
      title: "New vs Old Income Tax Regime: Which One is Better?",
      description:
        "A detailed comparison between the new and old tax regimes with real examples to help you decide...",
      date: "Nov 10, 2024",
      tags: ["Income Tax", "Tax Planning"],
      readingTime: 10,
      content: "Income tax regime comparison...",
    },
    {
      slug: "hra-exemption-rules",
      title: "Complete Guide to HRA Exemption Rules",
      description:
        "Understand HRA exemption limits, conditions, and how to maximize tax savings on house rent...",
      date: "Nov 5, 2024",
      tags: ["HRA", "Tax Savings", "Deductions"],
      readingTime: 6,
      content: "HRA exemption rules...",
    },
  ]
}

export async function getPost(slug: string) {
  const posts = await getPosts()
  return posts.find((post) => post.slug === slug)
}

export async function getPostsByTag(tag: string) {
  const posts = await getPosts()
  return posts.filter((post) => post.tags.includes(tag))
}
