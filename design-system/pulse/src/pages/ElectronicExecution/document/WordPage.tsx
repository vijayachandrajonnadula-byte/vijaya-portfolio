import { useState } from 'react';
import { Box } from '../../../components/mui';
import { SquareLock01Icon } from '../../../icons';
import type { ExecState, ProtocolTable, Step } from '../model';
import type { FitMode } from '../refTheme';
import { ExecTable } from './ExecTable';
import { FIGURES, PURPOSE, docStatus, infoRows, prerequisites } from './content';
import { Figure } from './Figure';
import { wordPageSx } from './wordPageSx';

export interface WordPageProps {
  s: ExecState;
  fit: FitMode;
  /** Table view: only this table (with its heading) is shown. */
  tableView: number | null;
  sections: { table: ProtocolTable; steps: Step[] }[];
  gated: (t: ProtocolTable) => boolean;
  inline: boolean;
  spectator: boolean;
  percentRecorded: number;
  recorded: number;
  onSelect: (id: string) => void;
}

/** An inline fill-in blank; it turns green once something is typed. */
function Blank({ label }: { label: string }) {
  const [filled, setFilled] = useState(false);
  return (
    <span
      className={`doc-blank${filled ? ' filled' : ''}`}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={label}
      onInput={(e) => setFilled((e.currentTarget.textContent ?? '').trim().length > 0)}
    />
  );
}

const Tag = ({ name }: { name: string }) => <span className="doc-tag">{`{{${name}}}`}</span>;

/** The 840px Word-style page: running header, title, information table, contents, two text sections, then one section per table. */
export function WordPage({ s, fit, tableView, sections, gated, inline, spectator, percentRecorded, recorded, onSelect }: WordPageProps) {
  const p = s.protocol;
  const tv = tableView !== null;
  const prereq = prerequisites(p.equipmentId, p.equipment);
  const shown = sections.filter((x) => (tv ? x.table.n === tableView : true));
  const tocTitles = ['1.0 Purpose & Scope', '2.0 Execution Record', ...p.tables.map((t) => `${t.num} ${t.title} — Table ${t.n}`)];
  // the reference lists 1.0, then 3.0 to 8.0; keep the same seven lines (the sample protocol has six tables)
  return (
    <Box id="wordPage" className="word-page" sx={wordPageSx(fit, tv)}>
      {!tv && (
        <>
          <div className="page-hdr">
            <span>{p.docNumber} · Operational Qualification</span>
            <span aria-hidden>{p.site} · Confidential</span>
          </div>
          <h1>Operational Qualification</h1>
          <p className="sub">
            {p.equipment} {p.equipmentId} · Speed Verification &amp; Performance Test · Rev 02
          </p>
          <table className="word-info-tbl">
            <tbody>
              {infoRows(s, docStatus(percentRecorded, recorded)).map((r) => (
                <tr key={r[0]}>
                  <td className="k">{r[0]}</td>
                  <td className="v" colSpan={r[2] ? 1 : 3}>{r[1]}</td>
                  {r[2] && <td className="k">{r[2]}</td>}
                  {r[2] && <td className="v">{r[3]}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="toc-mini" role="list" aria-label="Contents">
            {tocTitles.map((t, i) => (
              <Box
                key={t}
                component="span"
                role="listitem"
                className="t"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => document.getElementById(i < 2 ? 'ee-intro' : `sec-${i - 1}`)?.scrollIntoView({ block: 'start' })}
              >
                {t}
              </Box>
            ))}
          </div>

          <h2 id="ee-intro">
            <span className="num">1.0</span>Purpose &amp; Scope
          </h2>
          <p>
            {PURPOSE.before}
            <b>{p.equipmentId}</b>
            {PURPOSE.after}
          </p>

          <h2>
            <span className="num">2.0</span>Execution Record
          </h2>
          <p>
            This qualification was executed by <Tag name="operator" /> on <Tag name="exec_date" />.
          </p>
          <p>
            The V-cone blender was run at the validated set-point and the observed speed was recorded as <Tag name="rpm" /> RPM.
          </p>
          <p>
            Batch / Lot No. <Blank label="Batch or lot number" /> was processed. Ambient conditions were recorded as <Blank label="Ambient temperature" /> °C and <Blank label="Relative humidity" /> % RH. Instrument used:{' '}
            <Blank label="Instrument used" />.
          </p>
          <p>
            Additional remarks: <Blank label="Additional remarks" />
          </p>
        </>
      )}

      <div id="tableSections">
        {shown.map(({ table: t, steps }) => {
          const locked = gated(t);
          const fig = FIGURES[(t.n - 1) % FIGURES.length] as (typeof FIGURES)[number];
          return (
            <section key={t.n} id={`sec-${t.n}`} className={`tbl-sec${locked ? ' tbl-locked' : ''}`} aria-label={`${t.num} ${t.title}`}>
              {!tv && <div className="tbl-sec-lbl">▸ Table {t.n} of {p.tables.length}</div>}
              <h2>
                <span className="num">{t.num}</span>
                {t.title} — Table {t.n}
              </h2>
              {!tv && (
                <>
                  <p>{t.intro}</p>
                  <div className="word-prereq">
                    <div className="wp-h">Prerequisites — read before executing {t.title}</div>
                    <ul>
                      {prereq.map((l, i) => (
                        <li key={i}>
                          {l.parts.map((x, j) => (x.bold ? <b key={j}>{x.text}</b> : <span key={j}>{x.text}</span>))}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="word-fig">
                    <Figure kind={fig.kind} label={`Figure ${t.n}. ${fig.caption}`} />
                    <div className="cap">
                      Figure {t.n}. {fig.caption}
                    </div>
                  </div>
                </>
              )}
              {locked && (
                <div className="tbl-locked-banner" role="status">
                  <SquareLock01Icon size={14} />
                  This table is locked until table 2 is verified — read-only
                </div>
              )}
              <ExecTable s={s} table={t} steps={steps} inline={inline} spectator={spectator} gated={locked} verified={!!s.verifications[t.n]} onSelect={onSelect} />
            </section>
          );
        })}
      </div>
    </Box>
  );
}
