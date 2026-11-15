import type { ReactElement } from 'react';
import TextFieldsRounded from '@mui/icons-material/TextFieldsRounded';
import NotesRounded from '@mui/icons-material/NotesRounded';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ArrowDropDownCircleOutlined from '@mui/icons-material/ArrowDropDownCircleOutlined';
import RadioButtonCheckedRounded from '@mui/icons-material/RadioButtonCheckedRounded';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import SmartButtonRounded from '@mui/icons-material/SmartButtonRounded';
import TitleRounded from '@mui/icons-material/TitleRounded';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import SpaceBarRounded from '@mui/icons-material/SpaceBarRounded';
import InsertPageBreakOutlined from '@mui/icons-material/InsertPageBreakOutlined';
import VerticalAlignTopRounded from '@mui/icons-material/VerticalAlignTopRounded';
import VerticalAlignBottomRounded from '@mui/icons-material/VerticalAlignBottomRounded';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import TableChartOutlined from '@mui/icons-material/TableChartOutlined';
import type { FormFieldType } from './types';

export const fieldIcons: Record<FormFieldType, ReactElement> = {
  textBox: <TextFieldsRounded />,
  textArea: <NotesRounded />,
  date: <CalendarMonthOutlined />,
  dropdown: <ArrowDropDownCircleOutlined />,
  radio: <RadioButtonCheckedRounded />,
  checkbox: <CheckBoxOutlined />,
  button: <SmartButtonRounded />,
  label: <TitleRounded />,
  section: <ViewAgendaOutlined />,
  blankSpace: <SpaceBarRounded />,
  pageBreak: <InsertPageBreakOutlined />,
  headerSection: <VerticalAlignTopRounded />,
  footerSection: <VerticalAlignBottomRounded />,
  image: <ImageOutlined />,
  table: <TableChartOutlined />,
};
