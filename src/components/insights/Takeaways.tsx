/* The box that opens a post's text: two to five lines, on the fern wash. */
export default function Takeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside aria-label="Key takeaways" className="rounded-2xl bg-fern-wash px-7 py-7 sm:px-8">
      <p className="type-label text-fern-deep">Key takeaways</p>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {items.map((t) => (
          <li key={t} className="type-text text-ink/85">
            {t}
          </li>
        ))}
      </ul>
    </aside>
  );
}
