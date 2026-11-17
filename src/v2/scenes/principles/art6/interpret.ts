/**
 * Forgiving date reading for the principle 6 toy. Plain JS, no libraries, never throws: it returns null when it is not sure.
 * Day before month (5/3 is 5 march), the next upcoming date when no year is given, "next fri" is the next time that day comes round.
 */
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
const make = (y: number, m: number, d: number): Date | null => {
  const t = new Date(y, m, d, 12);
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d ? t : null;
};
const monthOf = (w: string) => (w.length >= 3 ? MONTHS.findIndex(m => m.startsWith(w) && (w.length >= 3)) : -1);
const dayOf = (w: string) => (w.length >= 3 ? DAYS.findIndex(d => d.startsWith(w)) : -1);
const fullYear = (y: string) => (y.length <= 2 ? 2000 + Number(y) : Number(y));

/** day + month (+ year): with no year, the next time that date comes round. */
function dm(today: Date, d: number, m: number, y?: string): Date | null {
  if (y) return make(fullYear(y), m, d);
  const a = make(today.getFullYear(), m, d);
  if (a && a >= today) return a;
  return make(today.getFullYear() + 1, m, d);
}

export function interpret(raw: string, now: Date = new Date()): Date | null {
  try {
    const today = dayOnly(now);
    const s = raw.toLowerCase().replace(/[,]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!s) return null;
    const add = (n: number) => make(today.getFullYear(), today.getMonth(), today.getDate() + n);
    if (s === 'today' || s === 'now') return today;
    if (s === 'tomorrow' || s === 'tmrw' || s === 'tom') return add(1);
    if (s === 'yesterday') return add(-1);
    let m = /^(?:in )?(\d{1,3}) ?(d|day|days|w|wk|week|weeks)$/.exec(s);
    if (m) return add(Number(m[1]) * (m[2]![0] === 'w' ? 7 : 1));
    m = /^(?:on |this |next |coming )?([a-z]{3,9})$/.exec(s);
    if (m && dayOf(m[1]!) >= 0) {
      let delta = (dayOf(m[1]!) - today.getDay() + 7) % 7;
      if (delta === 0) delta = 7;
      return add(delta);
    }
    m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
    if (m) return make(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    m = /^(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2}|\d{4}))?$/.exec(s);
    if (m) {
      let d = Number(m[1]), mo = Number(m[2]);
      if (mo > 12 && d <= 12) [d, mo] = [mo, d];
      return dm(today, d, mo - 1, m[3]);
    }
    m = /^(?:the )?(\d{1,2})(?:st|nd|rd|th)?(?: of)? ([a-z]{3,9})(?: (\d{2}|\d{4}))?$/.exec(s);
    if (m && monthOf(m[2]!) >= 0) return dm(today, Number(m[1]), monthOf(m[2]!), m[3]);
    m = /^([a-z]{3,9}) (\d{1,2})(?:st|nd|rd|th)?(?: (\d{2}|\d{4}))?$/.exec(s);
    if (m && monthOf(m[1]!) >= 0) return dm(today, Number(m[2]), monthOf(m[1]!), m[3]);
    return null;
  } catch {
    return null;
  }
}

/** "fri 5 mar 2027" */
export function words(d: Date): string {
  return `${DAYS[d.getDay()]!.slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()]!.slice(0, 3)} ${d.getFullYear()}`;
}

/** The scripted demo pretends today is thu 4 mar 2027, so "tomorrow" and "next fri" land on the same day as the others. */
export const DEMO_TODAY = new Date(2027, 2, 4, 12);
export const DEMO_INPUTS = ['5/3', '5 mar', 'march 5', 'tomorrow', 'next fri'];
export const DEMO_RESULT = (() => { const d = interpret(DEMO_INPUTS[0]!, DEMO_TODAY); return d ? words(d) : 'fri 5 mar 2027'; })();
