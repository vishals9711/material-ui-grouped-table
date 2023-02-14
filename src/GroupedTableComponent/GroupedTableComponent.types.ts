import { SxProps } from '@mui/material/styles';

export type Order = 'asc' | 'desc';

export interface IGenericObject<T> {
  [key: string]: T;
}

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
  color?: (value: any) => string;
  onClick?: (value: any) => void;
  navigateTo?: (value: any) => string;
  width?: string | number;
  columnSxProps?: SxProps;
}

export interface Data {
  [key: string]: any;
}

export interface GroupedColumn {
  label: string;
  id?: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
  color?: (value: any) => string;
  onClick?: (value: any) => void;
  navigateTo?: (value: any) => string;
  width?: string | number;
  children?: GroupedColumn[];
  columnSxProps?: SxProps;
}

export type GroupedTableHead = FlattenedColumn[][];

export interface FlattenedColumn extends GroupedColumn {
  rowSpan: number;
  hasChildren: boolean;
  colSpan?: number;
}

export interface GroupedTableProps {
  rows: Data[] | null | undefined;
  columns: GroupedColumn[];
  onClick?: (value: any) => void;
  navigateTo?: (value: any) => string;
  onClickColumn?: string;
  enableSort?: boolean;
  enableBorders?: boolean;
  ellipsis?: boolean;
  fixedHeight?: number;
  enableFilters?: boolean;
  filterChanges?: (value: IGenericObject<any>) => void;
  enableCheckBox?: boolean;
  checkBoxChange?: (data: readonly string[]) => void;
  checkboxSelector?: string;
}