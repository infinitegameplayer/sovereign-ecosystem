// local-date.mjs: the calendar day in the machine's own timezone, as YYYY-MM-DD.
//
// `new Date().toISOString().slice(0, 10)` is the UTC day, which west of Greenwich
// reads tomorrow in the evening. Use this wherever a date means "today" to you:
// a stamp written into a file, a filename, a day shown in a report. Keep UTC where
// UTC is the contract (an API window, a key matched against UTC data).
//
// No top-level side effects, safe to import anywhere.

export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
