import { Box, Checkbox, SxProps, TableCell, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { Data, GroupedTableHead, Order } from '../GroupedTableComponent/GroupedTableComponent.types';

interface EnhancedTableProps {
  onRequestSort: (property: keyof Data) => void;
  order: Order;
  orderBy: string | number;
  headCells: GroupedTableHead;
  enableBorders?: boolean;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  enableCheckbox?: boolean;
  numSelected?: number;
  rowCount: number | undefined;
  sxProps?: SxProps;
  maxDepth?: number;
  enableSort?: boolean;
}

const EnhancedTableHead = (props: EnhancedTableProps): React.ReactElement => {
  const {
    order,
    orderBy,
    onRequestSort,
    headCells,
    enableBorders,
    onSelectAllClick,
    enableCheckbox = false,
    numSelected,
    rowCount,
    sxProps = {},
    maxDepth = 0,
    enableSort = false,
  } = props;
  const createSortHandler = (property: keyof Data) => {
    onRequestSort(property);
  };
  return (
    <>
      {headCells.map((data, tableHeadIndex) => {
        return (
          <TableRow key={`table-head-${tableHeadIndex}`}>
            <>
              {enableCheckbox && typeof rowCount !== 'undefined' && typeof numSelected !== 'undefined' && tableHeadIndex === 0 && (
                <TableCell
                  padding='checkbox'
                  scope={'col'}
                  rowSpan={maxDepth}
                  key={`table-colspan-enhanced-checkbox`}
                  sx={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    borderLeft: enableBorders && tableHeadIndex === 0 ? '1px solid #DDDDDD' : '',
                    borderTop: enableBorders && tableHeadIndex === 0 ? '1px solid #DDDDDD' : '',
                  }}
                >
                  <Checkbox
                    color='primary'
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all',
                    }}
                  />
                </TableCell>
              )}

              {data.map((column, columnIndex) => {
                const newSxProps = {
                  ...column.columnSxProps,
                  ...sxProps,
                };
                if (column.hasChildren)
                  return (
                    <TableCell
                      scope={'colgroup'}
                      colSpan={column.colSpan}
                      key={`table-head-${column.id}-${tableHeadIndex}-${columnIndex}`}
                      align={column.align}
                      style={{
                        width: column.width,
                      }}
                      sx={{
                        minWidth: column.minWidth,
                        color: 'rgba(0, 0, 0, 0.7)',
                        borderRight: enableBorders ? '1px solid #DDDDDD' : '',
                        borderLeft: enableBorders && tableHeadIndex === 0 && columnIndex === 0 ? '1px solid #DDDDDD' : '',
                        borderTop: enableBorders && tableHeadIndex === 0 ? '1px solid #DDDDDD' : '',
                        ...newSxProps,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  );
                else
                  return (
                    <TableCell
                      scope={'col'}
                      rowSpan={column.rowSpan}
                      key={`table-colspan-${column.id}-${tableHeadIndex}-${columnIndex}`}
                      align={column.align}
                      style={{
                        width: column.width,
                      }}
                      sortDirection={orderBy === column.id ? order : false}
                      sx={{
                        minWidth: column.minWidth,
                        color: 'rgba(0, 0, 0, 0.7)',
                        borderRight: enableBorders ? '1px solid #DDDDDD' : '',
                        borderLeft: enableBorders && tableHeadIndex === 0 && columnIndex === 0 ? '1px solid #DDDDDD' : '',
                        borderTop: enableBorders && tableHeadIndex === 0 ? '1px solid #DDDDDD' : '',
                        ...newSxProps,
                      }}
                    >
                      {enableSort ? (
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => column.id && createSortHandler(column.id)}
                        >
                          {column.label}
                          {orderBy === column.id ? (
                            <Box component='span' sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  );
              })}
            </>
          </TableRow>
        );
      })}
    </>
  );
};

export default EnhancedTableHead;
