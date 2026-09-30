/** One chart block, checked (spec section 3, Charts). */
export type ChartSpec = {
  type: "line" | "bar";
  title: string;
  unit: string;
  source: string;
  sourceUrl: string;
  /** in the order the author wrote them */
  data: { label: string; value: number }[];
};

/**
 * Everything wrong with one or more post files. Each problem reads
 * "<file>: <field>: <what is wrong>. <how to fix it>." (spec section 4).
 */
export class InsightError extends Error {
  readonly problems: string[];

  constructor(problems: string[]) {
    super(problems.join("\n"));
    this.name = "InsightError";
    this.problems = problems;
  }
}
