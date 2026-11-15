import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { ZoomSelect } from './ZoomSelect';

const users = [
  { value: 'u1', label: 'Validation lead', meta: ['validation.lead', 'Admin'] },
  { value: 'u2', label: 'Reviewer A', meta: ['reviewer.a', 'Reviewer'] },
  { value: 'u3', label: 'QA author', meta: ['qa.author', 'Author'] },
];
const tree = [
  { id: 'g1', label: 'Quality', children: [{ id: 'g1a', label: 'Deviation' }, { id: 'g1b', label: 'CAPA' }] },
  { id: 'g2', label: 'Validation', children: [{ id: 'g2a', label: 'Protocols' }] },
];

/** ZoomSelect: label top / left, single, multi and tree panels (click a field to open its panel). */
export default function ZoomSelectDemo() {
  const [a, setA] = useState<string[]>(['u2']);
  const [b, setB] = useState<string[]>([]);
  const [c, setC] = useState<string[]>(['g1a']);
  const [d, setD] = useState<string[]>([]);
  return (
    <Stack spacing={3} sx={{ maxWidth: 480 }}>
      <ZoomSelect label="Owner" type="single" options={users} columns={['User ID', 'Role']} value={a} onChange={setA} helperText="Pick one user" />
      <ZoomSelect label="Reviewers" type="multi" options={users} columns={['User ID', 'Role']} value={b} onChange={setB} placeholder="Select reviewers" />
      <ZoomSelect label="Group" type="tree" treeItems={tree} value={c} onChange={setC} />
      <ZoomSelect label="Label left" labelPosition="left" type="single" options={users} value={d} onChange={setD} error helperText="Required" />
      <ZoomSelect label="Disabled" disabled options={users} value={[]} onChange={() => undefined} />
    </Stack>
  );
}
