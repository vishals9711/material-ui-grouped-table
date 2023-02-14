import { Box, Checkbox, Skeleton, SxProps, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect } from 'react';
import ColumnFilterComponent from '../CommonComponents/ColumnFilterComponent';
import EnhancedTableHead from '../CommonComponents/EnhancedTableHead';
import { getArrayDepth, getComparator, getGroupedTableHeadAndColumnArray } from '../utils';
import { Column, Data, GroupedTableHead, GroupedTableProps, Order } from './GroupedTableComponent.types';

const GroupedColumnTableComponent = (props: GroupedTableProps): React.ReactElement => {
  const {
    rows,
    columns,
    enableSort = false,
    enableBorders = false,
    ellipsis = false,
    fixedHeight,
    enableFilters = false,
    filterChanges,
    enableCheckBox = false,
    checkBoxChange,
    checkboxSelector = 'id',
  } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [tableHeadArray, setTableHeadArray] = React.useState<GroupedTableHead>([]);
  const [columnArray, setColumnArray] = React.useState<Column[]>([]);

  const sxProps: SxProps = ellipsis
    ? {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      }
    : {
        whiteSpace: 'wrap',
        wordWrap: 'break-word',
        overflow: 'auto',
      };

  const stickyHeader: SxProps = fixedHeight
    ? {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }
    : {};

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (rows && rows.length && checkboxSelector) {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n[checkboxSelector].toString());
        setSelected(newSelected);
        checkBoxChange && checkBoxChange(newSelected);
        return;
      }
      checkBoxChange && checkBoxChange([]);
      setSelected([]);
    }
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    checkBoxChange && checkBoxChange(newSelected);
  };

  useEffect(() => {
    const { tableHeadArray, columnArray } = getGroupedTableHeadAndColumnArray(columns);
    setTableHeadArray([...tableHeadArray]);
    setColumnArray([...columnArray]);
  }, [columns]);

  return (
    <TableContainer sx={{ maxHeight: fixedHeight }}>
      <Table
        stickyHeader
        aria-label='sticky table'
        style={{ tableLayout: 'fixed' }}
        sx={{
          overflowX: 'auto',
        }}
      >
        <TableHead sx={stickyHeader}>
          {enableSort ? (
            <EnhancedTableHead
              headCells={tableHeadArray}
              order={order}
              orderBy={orderBy}
              enableBorders={enableBorders}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              enableCheckbox={enableCheckBox}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              sxProps={sxProps}
              maxDepth={getArrayDepth(columns)}
            />
          ) : (
            <>
              {tableHeadArray.map((data, tableHeadIndex) => {
                return (
                  <TableRow key={`table-head-${tableHeadIndex}`}>
                    {data.map((column, columnIndex) => {
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
                              ...sxProps,
                              ...column.columnSxProps,
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
                            sx={{
                              minWidth: column.minWidth,
                              color: 'rgba(0, 0, 0, 0.7)',
                              borderRight: enableBorders ? '1px solid #DDDDDD' : '',
                              borderLeft: enableBorders && tableHeadIndex === 0 && columnIndex === 0 ? '1px solid #DDDDDD' : '',
                              borderTop: enableBorders && tableHeadIndex === 0 ? '1px solid #DDDDDD' : '',
                              ...sxProps,
                              ...column.columnSxProps,
                            }}
                          >
                            {column.label}
                          </TableCell>
                        );
                    })}
                  </TableRow>
                );
              })}
            </>
          )}
          {enableFilters && (
            <ColumnFilterComponent
              columns={columns}
              sxProps={sxProps}
              enableBorders={enableBorders}
              filterChanges={filterChanges}
              enableCheckbox={enableCheckBox}
            />
          )}
        </TableHead>

        <TableBody>
          {rows ? (
            rows.length > 0 ? (
              (enableSort ? rows.sort(getComparator(order, orderBy)) : rows).map((row, index) => {
                return (
                  <TableRow hover key={index}>
                    {enableCheckBox && checkboxSelector && (
                      <TableCell padding='checkbox' onClick={() => enableCheckBox && handleClick(row[checkboxSelector].toString())} key={`checkbox-${index}`}>
                        <Checkbox
                          color='primary'
                          sx={{
                            zIndex: 1,
                          }}
                          checked={selected.indexOf(row[checkboxSelector].toString()) !== -1}
                          inputProps={{
                            'aria-labelledby': `enhanced-table-checkbox-${index}`,
                          }}
                        />
                      </TableCell>
                    )}
                    {columnArray.map((column, columnIndex) => {
                      return (
                        <TableCell
                          key={`${column.id}-${columnIndex}`}
                          align={column.align}
                          width={column.width}
                          sx={{
                            width: column.width,
                            color: column.color ? column.color(row) : '',
                            borderRight: enableBorders ? '1px solid #DDDDDD' : '',
                            borderLeft: enableBorders && columnIndex === 0 ? '1px solid #DDDDDD' : '',
                            ...sxProps,
                            ...column.columnSxProps,
                          }}
                          onClick={() => (enableCheckBox ? handleClick(row[checkboxSelector].toString()) : column.onClick && column.onClick(row))}
                        >
                          {column.format ? column.format(row) : column.id && row[column.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columnArray.length}>
                  <Box sx={{ height: '324px', display: 'flex', justifyContent: 'center' }}>
                    <Typography m={'auto'}>{'No Records to Show'}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )
          ) : (
            <>
              {new Array(3).fill(0).map((_row, index) => {
                return (
                  <TableRow hover key={index}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} align={column.align} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                          <Skeleton key={index} variant='rectangular' animation='wave' height={24} />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupedColumnTableComponent;
