export type KnowledgeChunkInput = {
  domain: string;
  source: string;
  ref?: string;
  priority: number;
  tags: string[];
  content: string;
  rules?: Record<string, string[] | string>;
};

export const knowledgeChunks: KnowledgeChunkInput[] = [
  {
    domain: "coparenting",
    source: "Two Decades of Coparenting Research: A Scoping Review",
    priority: 1,
    tags: ["coparenting", "child_outcomes", "conflict"],
    content:
      "Consistently cooperative, low-undermining coparenting is associated with better child outcomes."
  },
  {
    domain: "attachment",
    source: "Adult Attachment Theory Overview",
    priority: 1,
    tags: ["attachment", "relationship_patterns"],
    content:
      "Attachment patterns influence conflict response and closeness; secure patterns support stable resolution."
  }
];
