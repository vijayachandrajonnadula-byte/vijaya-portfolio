/**
 * Figma page "Form Builder": ".Building Blocks/form-type" lists the field kinds
 * (Text Box, Label, Date, Radio Button, CheckBox, Section, Blank Space, Dropdown, Header Section,
 * Footer Section, Table, Text Area, Image, Page Break, Button).
 */
export type FormFieldType =
  | 'textBox'
  | 'textArea'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'label'
  | 'section'
  | 'blankSpace'
  | 'image'
  | 'pageBreak'
  | 'button'
  | 'headerSection'
  | 'footerSection'
  | 'table';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormBuilderField {
  id: string;
  type: FormFieldType;
  /** Visible label, or the text content of label / section / button fields. */
  label: string;
  /** Programmatic key. */
  name?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  /** Options for dropdown / radio / checkbox. */
  options?: FormFieldOption[];
}

export interface FieldTypeInfo {
  type: FormFieldType;
  label: string;
}

/** Palette contents in the order of ".Building Blocks/form-type" (the Figma "all Component list" is one flat list). */
export const FIELD_TYPES: FieldTypeInfo[] = [
  { type: 'textBox', label: 'Text Box' },
  { type: 'label', label: 'Label' },
  { type: 'date', label: 'Date' },
  { type: 'radio', label: 'Radio Button' },
  { type: 'checkbox', label: 'CheckBox' },
  { type: 'section', label: 'Section' },
  { type: 'blankSpace', label: 'Blank Space' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'headerSection', label: 'Header Section' },
  { type: 'footerSection', label: 'Footer Section' },
  { type: 'table', label: 'Table' },
  { type: 'textArea', label: 'Text Area' },
  { type: 'image', label: 'Image' },
  { type: 'pageBreak', label: 'Page Break' },
  { type: 'button', label: 'Button' },
];
export const fieldTypeLabel = (t: FormFieldType): string => FIELD_TYPES.find((f) => f.type === t)?.label ?? t;

/** Drag payload key for native drag and drop from the palette onto the canvas. */
export const PALETTE_MIME = 'application/x-pulse-form-field';
