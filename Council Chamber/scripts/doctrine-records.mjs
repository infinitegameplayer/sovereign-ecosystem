// Records-versus-doctrine boundary, stated once.
//
// Dated audit records, findings reports and one-time reviews can live under
// the doctrine tree but govern nothing. Every instrument that counts or checks
// doctrine imports this module, so they all measure the same population:
// doctrine-mass.mjs (growth) and doctrine-references.mjs (orphans). Two
// copies of a boundary drift apart, and the instrument holding the stale copy
// reports records as doctrine. Until v3.15.0 the orphan counter had no copy at
// all, so it offered dated records as retirement candidates while the mass
// counter left them out.
//
// Two exclusion mechanisms, because records take two shapes:
//   1. RECORD_DIRS, for whole folders of run artifacts. Ships empty. To add a
//      record folder, put its folder name in the list, for example
//      ['Audit Records']. Any path containing that folder name as a directory
//      segment is excluded.
//   2. `doctrine: false` in frontmatter, for individual dated reports sitting
//      beside real doctrine. An edit, never a move, so marking a file as a
//      record does not cross the Permanent Floor.
//
// Proven by doctrine-records-selftest.mjs, which plants a record in a fixture
// vault and requires both counters to drop it and agree on what remains.

export const RECORD_DIRS = [];

export function isRecordDir(p) {
  const n = p.split('\\').join('/');
  return RECORD_DIRS.some((d) => n.includes(`/${d}/`));
}

export function isMarkedRecord(content) {
  const m = content.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  if (!m) return false;
  return /^doctrine:\s*false\s*$/m.test(m[1]);
}
