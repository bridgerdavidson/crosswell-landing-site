import { Fragment, type ReactNode } from "react";

/* A sentence edge never strands a word: a sentence's first two words and
   its last two words are each held together (no break between them), so no
   line ends on the first word of a sentence and no line begins with its
   last. The text itself is unchanged: the held pairs are spans that do not
   wrap, joined by ordinary spaces. A sentence ends at . ! ? : or ; */
const END = /[.!?:;]["'’)]*$/;

export function tie(text: string): ReactNode {
  const words = text.split(" ").filter((w) => w.length > 0);
  if (words.length < 2) return text;
  // held[i]: the space after word i does not break
  const held = new Array(words.length).fill(false);
  let start = 0;
  words.forEach((word, i) => {
    const last = i === words.length - 1;
    if (!END.test(word) && !last) return;
    const end = i;
    if (end > start) {
      held[start] = true; // the first two words
      held[end - 1] = true; // the last two words
    }
    start = i + 1;
  });

  const runs: string[] = [];
  let run = words[0];
  for (let i = 1; i < words.length; i++) {
    if (held[i - 1]) run += " " + words[i];
    else {
      runs.push(run);
      run = words[i];
    }
  }
  runs.push(run);

  return runs.map((r, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {r.includes(" ") ? <span className="whitespace-nowrap">{r}</span> : r}
    </Fragment>
  ));
}
