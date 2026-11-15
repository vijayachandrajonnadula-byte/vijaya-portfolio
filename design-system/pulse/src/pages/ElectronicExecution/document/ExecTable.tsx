import type { ReactNode } from 'react';
import { getPlainTextFromRTE } from '../../../components/form/RichTextEditor/RichTextEditor';
import { AiMagicIcon, CheckmarkCircle01Icon, EsignIcon, PencilEdit01Icon, ValidationApprovalIcon } from '../../../icons';
import type { ExecState, ProtocolTable, Step, Verdict } from '../model';
import { ControlInput, selectStepGuarded } from '../ExecutionPanel';
import { executionActions } from '../store';
import { ui } from '../ui';
import { shortWhen } from './content';

/** Column widths in percent (reference: 5/18/15/6/21/13/8/14, and 5/22/18/6/27/9/13 for the sign-off table). */
const COLS_STD = [5, 18, 15, 6, 21, 13, 8, 14];
const COLS_SIGNOFF = [5, 22, 18, 6, 27, 9, 13];

/* ---------- rich text of the panel editor, reduced to a few safe tags ---------- */

const ALLOWED = new Set(['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li']);
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function walk(n: Node): string {
  if (n.nodeType === 3) return esc(n.textContent ?? '');
  if (n.nodeType !== 1) return '';
  const el = n as Element;
  const tag = el.tagName.toLowerCase();
  const inner = Array.from(el.childNodes).map(walk).join('');
  if (!ALLOWED.has(tag)) return inner;
  return tag === 'br' ? '<br>' : `<${tag}>${inner}</${tag}>`;
}

/** Keeps only b, strong, i, em, u, br, p, ul, ol and li (no attributes) of an HTML string. */
export function safeHtml(html: string): string {
  if (!/<[a-z]/i.test(html)) return esc(html);
  return Array.from(new DOMParser().parseFromString(html, 'text/html').body.childNodes).map(walk).join('');
}

const plain = (html: string): string => (/<[a-z]/i.test(html) ? getPlainTextFromRTE(html).trim() : html);

/* ---------- cells ---------- */

function ActualCell({ step, inline, editable, locked }: { step: Step; inline: boolean; editable: boolean; locked: boolean }) {
  const value = plain(step.actual);

  if (inline && editable && step.control) return <ControlInput step={step} />;
  if (inline && editable) {
    return (
      <textarea
        className="irte"
        rows={1}
        aria-label={`Actual result, step ${step.id}`}
        value={value}
        onChange={(e) => {
          const r = executionActions.setActual(step.id, e.target.value);
          if (!r.ok) ui.toast('error', r.errors[0] ?? 'Could not change the result.');
        }}
        onFocus={() => selectStepGuarded(step.id)}
      />
    );
  }
  const cls = inline || locked ? 'irte locked' : 'irte readonly';
  return <div className={cls} dangerouslySetInnerHTML={{ __html: safeHtml(step.actual) || '&nbsp;' }} />;
}

function EvidenceCell({ s, step, inline, editable }: { s: ExecState; step: Step; inline: boolean; editable: boolean }) {
  if (step.evidence === null) return <span className="ev-na">NA</span>;
  const items = step.evidence.flatMap((id) => {
    const e = s.evidence.find((x) => x.id === id);
    return e ? [e] : [];
  });
  const pills = (
    <div className="ev-pills">
      {items.map((e) => (
        <button
          key={e.id}
          type="button"
          className="ev-pill"
          onClick={(ev) => {
            ev.stopPropagation();
            ui.open('evidenceViewer', { evidenceId: e.id });
          }}
        >
          {e.name}
        </button>
      ))}
    </div>
  );
  if (!(inline && editable)) return pills;
  const open = () => ui.open('evidence', { stepId: step.id });
  return (
    <div
      className="evi-inline-zone"
      role="button"
      tabIndex={0}
      aria-label={`Evidence for step ${step.id}: ${items.length}. Open evidence`}
      onFocus={() => selectStepGuarded(step.id)}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      {pills}
    </div>
  );
}

const verdictText: Record<Exclude<Verdict, null>, string> = { pass: 'Pass', fail: 'Fail', na: 'N/A' };

function VerdictCell({ step, inline, editable, noNa }: { step: Step; inline: boolean; editable: boolean; noNa: boolean }) {
  if (!(inline && editable)) return <div className="pf-cell pf-locked">{step.verdict ? <span className="pf-flat">{verdictText[step.verdict]}</span> : null}</div>;
  const opts: Exclude<Verdict, null>[] = noNa ? ['pass', 'fail'] : ['pass', 'fail', 'na'];
  return (
    <div className="pf-cell">
      <div className="pf-radios" role="radiogroup" aria-label={`Pass or fail, step ${step.id}`}>
        {opts.map((v) => (
          <label key={v} className="pf-opt">
            <input
              type="radio"
              name={`pf-${step.id}`}
              checked={step.verdict === v}
              onFocus={() => selectStepGuarded(step.id)}
              onChange={() => {
                if (v === 'na') {
                  ui.open('markNA', { stepIds: [step.id] });
                  return;
                }
                const r = executionActions.setVerdict(step.id, v);
                if (!r.ok) ui.toast('error', r.errors[0] ?? 'Could not set the verdict.');
              }}
            />
            <span>{verdictText[v]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SigCell({ step }: { step: Step }) {
  const sg = step.signature;
  if (!sg || step.state !== 'recorded') return <div className="sig-cell" />;
  return (
    <div className="sig-cell sig-done">
      <div className="who">{sg.who}</div>
      <div className="when">{shortWhen(sg.when)}</div>
      <div className="badge">{sg.by === 'ai' ? 'eSigned (AI assisted)' : sg.by === 'na' ? 'eSigned (N/A)' : 'eSigned'}</div>
    </div>
  );
}

function StatusIcons({ step, verified }: { step: Step; verified: boolean }) {
  const icons: ReactNode[] = [];
  if (step.editUnlocked) icons.push(<span key="x" className="step-status ss-xreason" title="Unlocked for edit"><PencilEdit01Icon size={10} /></span>);
  if (step.signature && step.state === 'recorded') {
    icons.push(
      step.signature.by === 'ai' ? (
        <span key="a" className="step-status ss-ai" title="Signed with AI assistance"><AiMagicIcon size={10} /></span>
      ) : (
        <span key="e" className="step-status ss-esign" title="Electronically signed"><EsignIcon size={10} /></span>
      ),
    );
  } else if (step.state === 'aiFilled') {
    icons.push(<span key="a" className="step-status ss-ai" title="Filled by the AI agent"><AiMagicIcon size={10} /></span>);
  }
  if (verified && step.state === 'recorded') icons.push(<span key="v" className="step-status ss-verified" title="Table verified"><ValidationApprovalIcon size={10} /></span>);
  if (icons.length === 0) return null;
  return <div className="step-status-row">{icons}</div>;
}

/* ---------- table ---------- */

export interface ExecTableProps {
  s: ExecState;
  table: ProtocolTable;
  steps: Step[];
  inline: boolean;
  spectator: boolean;
  gated: boolean;
  verified: boolean;
  /** Called on a row click. */
  onSelect: (id: string) => void;
}

/** The execution table of one section: eight columns (seven for the sign-off table), one row per step. */
export function ExecTable({ s, table: t, steps, inline, spectator, gated, verified, onSelect }: ExecTableProps) {
  const signoff = t.signoff;
  const widths = signoff ? COLS_SIGNOFF : COLS_STD;
  const heads = signoff
    ? ['Step', 'Sign-off Activity', 'Criteria', 'Ref', 'Comments', 'Status', 'Action']
    : ['Step', 'Instructions', 'Expected Results', 'Ref', 'Actual Result', 'Evidence', 'P/F', 'Signature'];
  const recordedAll = t.stepIds.every((id) => s.protocol.steps[id]?.state === 'recorded');
  const ver = s.verifications[t.n];
  const verifyOff = spectator || !recordedAll;

  return (
    <table className="exec-tbl" id={`tbl-${t.n}`}>
      <thead>
        <tr>
          {heads.map((h, i) => (
            <th key={h} style={{ width: `${widths[i]}%` }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {steps.map((st) => {
          const recorded = st.state === 'recorded';
          const editable = !spectator && !recorded && !gated;
          const cls = [st.id === s.selectedStepId ? 'selected' : '', recorded ? 'completed' : '', st.state === 'aiFilled' ? 'ai-filled' : ''].filter(Boolean).join(' ');
          return (
            <tr key={st.id} className={cls} data-r={st.row} onClick={() => onSelect(st.id)} aria-selected={st.id === s.selectedStepId}>
              <td className="snum">
                <StatusIcons step={st} verified={verified} />
                <div className="step-pick">
                  <span className="n" id={`ee-step-${st.id}`} style={{ scrollMarginTop: 56 }}>
                    {st.row}
                  </span>
                </div>
              </td>
              <td>{st.instructions}</td>
              <td>{st.expected}</td>
              <td className="ref-cell">{st.reference}</td>
              <td className="ce">
                <ActualCell step={st} inline={inline} editable={editable} locked={recorded || spectator || gated} />
              </td>
              {!signoff && (
                <td className="ce">
                  <EvidenceCell s={s} step={st} inline={inline} editable={editable} />
                </td>
              )}
              <td className="ce">
                <VerdictCell step={st} inline={inline} editable={editable} noNa={signoff} />
              </td>
              <td className="ce" style={signoff ? { verticalAlign: 'middle' } : undefined}>
                <SigCell step={st} />
              </td>
            </tr>
          );
        })}
        {!signoff && (
          <tr className="tbl-verify-row">
            <td colSpan={heads.length}>
              <div className="tbl-verify">
                {ver ? (
                  <div className="tv-done" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                    <span className="tv-badge">
                      <CheckmarkCircle01Icon size={11} /> Table verified
                    </span>
                    <span className="tv-lbl">
                      {ver.who} ({ver.role}), {shortWhen(ver.when)}
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="tv-lbl">Table Verification — provide after all steps are executed</span>
                    <button
                      type="button"
                      className="tv-btn"
                      disabled={verifyOff}
                      title={spectator ? 'Read-only: a spectator cannot verify' : recordedAll ? 'Verify this table' : 'Record every step of this table first'}
                      onClick={(e) => {
                        e.stopPropagation();
                        ui.open('verify', { table: t.n });
                      }}
                    >
                      <CheckmarkCircle01Icon size={12} />
                      Verify Table
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
