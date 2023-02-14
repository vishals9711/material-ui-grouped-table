import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Data, GroupedColumn } from '../GroupedTableComponent/GroupedTableComponent.types';
import GroupedColumnTableComponent from '../GroupedTableComponent/GroupedTableComponent';

const MOCK_COLUMNS: GroupedColumn[] = [
  {
    label: 'Name',
    id: 'name',
    width: 100,
  },
  {
    label: 'Other',
    children: [
      {
        label: 'Age',
        id: 'age',
        width: 150,
      },
      {
        label: 'Address',
        children: [
          {
            label: 'Street',
            id: 'street',
            width: 150,
          },
          {
            label: 'Block',
            children: [
              {
                label: 'Building',
                id: 'building',
                width: 100,
              },
              {
                label: 'Door No.',
                id: 'doorNumber',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Company',
    children: [
      {
        label: 'Company Address',
        id: 'companyAddress',
        width: 200,
      },
      {
        label: 'Company Name',
        id: 'companyName',
      },
    ],
  },
  {
    label: 'Gender',
    id: 'gender',
    width: 80,
    align: 'right',
  },
];

const ExampleComponent = (): React.ReactElement => {
  const [MOCK_DATA, setMOCK_DATA] = React.useState<Data[]>([]);
  useEffect(() => {
    const arr: Data[] = [];
    for (let i = 0; i < 3; i++) {
      arr.push({
        "id": i + 1,
        "name": 'John Brown',
        "age": i + 1,
        "street": 'Lake Park',
        "building": 'C',
        "gender": 'M',

        "companyAddress": 'Lake Street 42',
        "companyName": 'SoftLake Co',
        "doorNumber": "2035",

      });
    };
    setMOCK_DATA([...arr]);
  }, []);

  return <Box padding={4}><GroupedColumnTableComponent columns={[...MOCK_COLUMNS]} rows={[...MOCK_DATA]} enableBorders enableCheckBox enableFilters /></Box>;
};

export default ExampleComponent;
