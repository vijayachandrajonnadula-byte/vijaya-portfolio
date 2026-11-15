/**
 * NOT FROM FIGMA. Sample SOP page shown in the evidence pane's "View" split (reference kind=sop, S\ref\overlays\spec.md
 * "sop-split"): a grey viewer holding two white Calibri pages. The text is generic sample content, not a real procedure.
 */
import type { ReactNode } from 'react';
import { Box } from '../../../components/mui';
import { panelRole } from '../../../theme/typography';
import { fonts, ref } from '../refTheme';
import { ev } from './evRef';

const page = {
  boxSizing: 'border-box', p: '26px 28px 30px', mb: '16px', border: `1px solid ${ref.pageBorder}`, background: ref.white, boxShadow: '0 2px 12px rgba(0,0,0,.14)', position: 'relative',
  fontFamily: fonts.word, color: ev.sopText,
  '& h4': { m: '13px 0 5px', fontSize: 11.5, lineHeight: '17.825px', fontWeight: panelRole.heavy, color: ref.blue3 },
  '& p': { m: '0 0 8px', fontSize: 12, lineHeight: '18.6px', fontWeight: panelRole.regular },
  '& ol': { m: '0 0 8px', p: '0 0 0 20px' },
  '& li': { m: '0 0 5px', fontSize: 12, lineHeight: '18.6px' },
} as const;

function Page({ doc, n, children }: { doc: string; n: number; children: ReactNode }) {
  return (
    <Box sx={page}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: '0 0 6px', m: '0 0 12px', borderBottom: `1px solid ${ev.sopRule}`, fontSize: 9.5, lineHeight: '14.725px', color: ev.sopSmall }}>
        <span>{doc}</span>
        <span>Controlled Copy</span>
      </Box>
      {children}
      <Box sx={{ p: '8px 0 0', m: '16px 0 0', borderTop: `1px solid ${ev.sopFoot}`, fontSize: 9, lineHeight: '13.95px', color: ev.sopFoot, textAlign: 'center' }}>Page {n} of 2</Box>
    </Box>
  );
}

export default function SopPage({ title }: { title: string }) {
  return (
    <>
      <Page doc={title} n={1}>
        <Box component="h3" sx={{ m: '0 0 10px', fontSize: 16, lineHeight: '24.8px', fontWeight: panelRole.strong, color: ev.sopHead, fontFamily: fonts.word }}>
          {title}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', p: '10px 12px', m: '0 0 6px', borderRadius: '8px', background: ref.tint2, fontSize: 11, lineHeight: '17.05px' }}>
          {[
            ['Document No.', 'SOP-001'],
            ['Version', 'Rev 02'],
            ['Effective', '12-Jan-2026'],
          ].map(([k, v]) => (
            <span key={k}>
              <Box component="b" sx={{ fontWeight: panelRole.strong, color: ref.ink }}>{k}</Box> <Box component="span" sx={{ color: ref.muted }}>{v}</Box>
            </span>
          ))}
        </Box>
        <h4>1. Purpose</h4>
        <p>Define the requirement and acceptance criteria for blender speed verification of the V-cone blender.</p>
        <h4>2. Scope</h4>
        <p>Applies to OQ speed verification at set-points 5, 10 and 20 RPM with a tolerance of ±5%.</p>
        <h4>3. Responsibilities</h4>
        <p>The Executor performs the procedure and records results in the electronic record; the Verifier confirms compliance with this SOP; QA reviews and approves the completed record.</p>
      </Page>
      <Page doc={title} n={2}>
        <h4>4. Procedure</h4>
        <ol>
          <li>Confirm the equipment is clean and released for OQ.</li>
          <li>Verify the tachometer calibration is within its due date.</li>
          <li>Set each target RPM and allow a 2-minute stabilisation.</li>
          <li>Record the observed RPM and compare against the acceptance band.</li>
        </ol>
        <h4>5. Acceptance Criteria</h4>
        <p>Observed speed is within ±5% of the set-point for every run, and no alarm is active during the run.</p>
        <h4>6. References</h4>
        <p>Sample content for the prototype.</p>
      </Page>
    </>
  );
}
