export default function Bad() {
  return (
    <>
      <p className="uppercase">
        Your firm&apos;s brain {"—"} the mind of the business.
      </p>
      <p className="text-sm">The mind of the fund remembers everything.</p>
      <p className={`text-sm ${true ? "on" : ""}`}>Ask your mind.</p>
    </>
  );
}
