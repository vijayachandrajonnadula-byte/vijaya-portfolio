/**
 * Figma page "Form Builder": the "Additional Settings" sections of the Field Settings panel (each 256px wide).
 *   ToggleSwitchButton (State = Default | Active)               28x16 small Switch
 *   Vertification Required [sic] (Unselected | Selected)        toggle row + option group + field
 *   Hyperlink (Selected | Unselected)                           toggle row + 2 text fields + outlined small button + uploaded list
 *   Attachment (Selected | Unselected)                          toggle row + outlined small button + helper text + uploaded list
 *   Tags (Selected | Unselected)                                toggle row + text field
 *   Password (Selected | Unselected)                            toggle row + 2 text fields + radio group
 *   System Value (system value off | on - dynamic | on - static)  toggle row + option group + 4 text fields (or Add/Remove Rows + datagrid)
 * Rows are 18px high: textLabel (flex 1) + Switch. Sections are stacked by AdditionalSettings.
 */
import { fw } from '../../../theme/typography';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Button } from '../../actions/Button/Button';
import { RadioGroup } from '../../form/Choice/Choice';
import { Switch } from '../../form/Switch/Switch';
import { TallyCounter } from '../../form/TallyCounter/TallyCounter';
import { TextField } from '../../form/TextField/TextField';
import { ToggleButtonGroup } from '../../form/ToggleButtonGroup/ToggleButtonGroup';
import { UploadFileList } from '../../form/FileUploader/UploadFileList';
import { PanelSection } from './FieldPalette';
import { pt } from '../../../theme/pulseTokens';

const label = { fontSize: 12, lineHeight: '18px', fontWeight: fw.medium, color: pt.colors.neutral[900] } as const;

export interface ToggleSwitchButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

/** Figma ToggleSwitchButton: the small Switch (28x16) in Default (off) / Active (on). */
export function ToggleSwitchButton({ checked = false, onChange, disabled, ariaLabel }: ToggleSwitchButtonProps) {
  return <Switch size="small" checked={checked} disabled={disabled} onChange={(_, v) => onChange?.(v)} slotProps={{ input: { 'aria-label': ariaLabel } }} />;
}

export interface SettingToggleRowProps extends ToggleSwitchButtonProps {
  label: ReactNode;
}

/** 18px row: label + switch. */
export function SettingToggleRow({ label: text, checked, onChange, disabled }: SettingToggleRowProps) {
  return (
    <Box data-spec="setting-toggle-row" sx={{ display: 'flex', alignItems: 'center', gap: '10px', height: 18, width: '100%' }}>
      <Box sx={{ flex: 1, minWidth: 0, ...label }}>{text}</Box>
      <ToggleSwitchButton checked={checked} onChange={onChange} disabled={disabled} ariaLabel={typeof text === 'string' ? text : undefined} />
    </Box>
  );
}

const stack = { display: 'flex', flexDirection: 'column', gap: '16px', width: 256 } as const;

interface SectionBase {
  /** Off by default (Unselected). */
  defaultOn?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
function useToggle({ defaultOn = false, checked, onChange }: SectionBase) {
  const [inner, setInner] = useState(defaultOn);
  const on = checked ?? inner;
  return { on, set: (v: boolean) => { setInner(v); onChange?.(v); } };
}

/** "Vertification Required" (spelling kept from the Figma layer): toggle + option group + a field. */
export function VerificationRequired(props: SectionBase) {
  const { on, set } = useToggle(props);
  const [opt, setOpt] = useState<string | null>('1');
  return (
    <Box data-spec={`verification ${on ? 'selected' : 'unselected'}`} sx={stack}>
      <SettingToggleRow label="Verification Required" checked={on} onChange={set} />
      {on && (
        <>
          <ToggleButtonGroup exclusive size="small" label="Verification type" buttonList={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]} value={opt} onChange={(_, v) => setOpt(v)} />
          <TextField size="small" label="Verifier" placeholder="Select verifier" />
        </>
      )}
    </Box>
  );
}

const sampleFile = { id: 1, name: 'document.pdf', size: 245760, status: 'uploaded' as const };

/** Hyperlink: toggle + link text + URL + upload action + uploaded list. */
export function HyperlinkSetting(props: SectionBase) {
  const { on, set } = useToggle(props);
  return (
    <Box data-spec={`hyperlink ${on ? 'selected' : 'unselected'}`} sx={stack}>
      <SettingToggleRow label="Hyperlink Required" checked={on} onChange={set} />
      {on && (
        <>
          <TextField size="small" label="Display text" placeholder="Enter text" />
          <TextField size="small" label="Link" placeholder="https://" />
          <Box><Button size="small" variant="outlined">Upload</Button></Box>
          <UploadFileList files={[sampleFile]} />
        </>
      )}
    </Box>
  );
}

/** Attachment: toggle + upload button with helper text + uploaded list. */
export function AttachmentSetting(props: SectionBase) {
  const { on, set } = useToggle(props);
  return (
    <Box data-spec={`attachment ${on ? 'selected' : 'unselected'}`} sx={stack}>
      <SettingToggleRow label="Attachment Required" checked={on} onChange={set} />
      {on && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Button size="small" variant="outlined" fullWidth>Upload file</Button>
            <Box sx={{ fontSize: 12, lineHeight: '20px', color: pt.colors.neutral[500] }}>Maximum file size 10 MB</Box>
          </Box>
          <UploadFileList files={[sampleFile]} />
        </>
      )}
    </Box>
  );
}

/** Tags: toggle + a field. */
export function TagsSetting(props: SectionBase) {
  const { on, set } = useToggle(props);
  return (
    <Box data-spec={`tags ${on ? 'selected' : 'unselected'}`} sx={stack}>
      <SettingToggleRow label="Tag Required" checked={on} onChange={set} />
      {on && <TextField size="small" label="Tag" placeholder="Add a tag" />}
    </Box>
  );
}

/** Password: toggle + 2 fields + radio group. */
export function PasswordSetting(props: SectionBase) {
  const { on, set } = useToggle(props);
  const [v, setV] = useState('1');
  return (
    <Box data-spec={`password ${on ? 'selected' : 'unselected'}`} sx={stack}>
      <SettingToggleRow label="Password Protect" checked={on} onChange={set} />
      {on && (
        <>
          <TextField size="small" type="password" label="Password" placeholder="Enter password" />
          <TextField size="small" type="password" label="Confirm password" placeholder="Re-enter password" />
          <RadioGroup label="Applies to" options={[{ label: 'Whole form', value: '1' }, { label: 'This field', value: '2' }, { label: 'Section', value: '3' }]} value={v} onChange={(x) => setV(Array.isArray(x) ? (x[0] ?? '') : String(x))} />
        </>
      )}
    </Box>
  );
}

export type SystemValueState = 'off' | 'dynamic' | 'static';

export interface SystemValueSettingProps {
  /** Figma State = system value off | system value on - dynamic | system value on - static. @default "off" */
  state?: SystemValueState;
  onStateChange?: (state: SystemValueState) => void;
}

/** System Value: toggle that, when on, chooses dynamic (page numbering text fields) or static values. */
export function SystemValueSetting({ state = 'off', onStateChange }: SystemValueSettingProps) {
  const on = state !== 'off';
  const [rows, setRows] = useState(2);
  return (
    <Box data-spec={`system-value ${state}`} sx={stack}>
      <SettingToggleRow label="System Value" checked={on} onChange={(v) => onStateChange?.(v ? 'dynamic' : 'off')} />
      {!on && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', height: 40 }}>
            <Box sx={{ ...label, width: 70 }}>Add/Remove Rows</Box>
            <TallyCounter size="medium" value={rows} onChange={setRows} min={1} width={136} />
          </Box>
        </>
      )}
      {on && (
        <>
          <ToggleButtonGroup exclusive size="small" label="Value type" buttonList={[{ value: 'dynamic', label: 'Dynamic' }, { value: 'static', label: 'Static' }]} value={state} onChange={(_, v) => v && onStateChange?.(v as SystemValueState)} />
          <TextField size="small" label="Prefix" placeholder="Page 1 of 10" required />
          <TextField size="small" label="Suffix" placeholder="Page 1 of 10" required />
          {state === 'static' && <TextField size="small" label="Value" required />}
          <TextField size="small" label="Format" required />
        </>
      )}
    </Box>
  );
}

/** "Additional Settings" accordion that stacks the sections above (Figma .buildingblock/Additional Settings: State = Default | Filled). */
export function AdditionalSettings({ filled }: { /** Filled = every section switched on. */ filled?: boolean }) {
  return (
    <PanelSection title="Additional Settings">
      <Box data-spec={`additional-settings ${filled ? 'filled' : 'default'}`} sx={{ display: 'flex', flexDirection: 'column', gap: '16px', p: '16px', alignItems: 'center' }}>
        <VerificationRequired defaultOn={filled} />
        <HyperlinkSetting defaultOn={filled} />
        <AttachmentSetting defaultOn={filled} />
        <TagsSetting defaultOn={filled} />
        <PasswordSetting defaultOn={filled} />
      </Box>
    </PanelSection>
  );
}
