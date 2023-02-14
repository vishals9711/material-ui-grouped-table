import { SxProps, TextField } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';
import { GroupedColumn, IGenericObject } from '../GroupedTableComponent/GroupedTableComponent.types';

interface IColumnFilterComponent {
  columns: GroupedColumn[];
  enableBorders?: boolean;
  sxProps: SxProps;
  filterChanges?: (value: IGenericObject<any>) => void;
  enableCheckbox: boolean;
}

const ColumnFilterComponent = (props: IColumnFilterComponent) => {
  const { columns, enableBorders, sxProps, filterChanges, enableCheckbox = false } = props;
  const [searchParams, setSearchParams] = useState<IGenericObject<any>>({});

  useEffect(() => {
    filterChanges && filterChanges(searchParams);
  }, [searchParams, filterChanges]);

  const returnSearchElement = (column: string) => {
    return (
      <TextField
        fullWidth
        size='small'
        onChange={(event) => {
          if (event.target.value === '') delete searchParams[column];
          else searchParams[column] = event.target.value;
          setSearchParams({ ...searchParams });
        }}
      />
    );
  };

  return (
    <TableRow>
      {enableCheckbox && (
        <TableCell
          key={'checkbox'}
          sx={{
            color: 'rgba(0, 0, 0, 0.7)',
            borderRight: enableBorders ? '1px solid #DDDDDD' : '',
            ...sxProps,
          }}
        ></TableCell>
      )}
      {columns.map((column, columnIndex) => (
        <TableCell
          key={column.id}
          align={column.align}
          width={column.width}
          sx={{
            minWidth: column.minWidth,
            color: 'rgba(0, 0, 0, 0.7)',
            borderRight: enableBorders ? (columnIndex + 1 !== columns.length ? '1px solid #DDDDDD' : '') : '',
            ...sxProps,
          }}
        >
          {column.id && returnSearchElement(column.id)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ColumnFilterComponent;
