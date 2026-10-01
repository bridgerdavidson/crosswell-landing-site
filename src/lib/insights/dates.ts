/* a post's dates are calendar days: read and written in UTC, so a build
   anywhere prints the day the author typed */
const day = (d: string) => new Date(`${d}T00:00:00Z`);

export const formatDate = (d: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(day(d));

export const formatMonth = (d: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(day(d));
