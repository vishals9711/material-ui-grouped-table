
  

  

<span  align="center">

  

![NPM](https://img.shields.io/npm/l/react-search-box?style=for-the-badge) <a  href="https://codesandbox.io/s/material-ui-grouped-table-irlvos?file=/src/App.tsx"  target="_blank">![Edit on Codesandbox](https://img.shields.io/badge/demo-Edit%20on%20Codesandbox-2385f7?style=for-the-badge&logo=codesandbox)</a>

  

  

</span>

  

  

### Installation

  

  
# npm
```sh
npm i material-ui-grouped-table --save
```
# yarn
```sh
yarn add material-ui-grouped-table
```

  

  

### Usage

  

  

```js

import React from 'react';
import GroupedColumnTableComponent from "material-ui-grouped-table";

export default function App() {
  return (
    <div className="App">
      <GroupedColumnTableComponent rows={[]} columns={[]} />
    </div>
  );
}

```

## [Example Component](https://github.com/vishals9711/material-ui-grouped-table/blob/master/src/ExampleComponent/ExampleComponent.tsx)

## Data

The Data interface represents an object with dynamic keys and values, with the values being of any type. It has the following structure:

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| key | string | An object with dynamic keys and values. |

Note that the `key` in the interface definition represents any string key name that you might use to define properties in the object.


## GroupedColumn

The following properties can be passed to the GroupedColumn object:

| **Name** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| label | string |  | The display name for the column. |
| id | string | undefined | A unique identifier for the column. |
| minWidth | number | undefined | The minimum width for the column. |
| align | 'right' \| 'left' \| 'center' | 'left' | The alignment of the column content. |
| format | (value: any) => React.ReactNode | undefined | A function that formats the content of the column. |
| color | (value: any) => string | undefined | A function that returns the color of the column content. |
| onClick | (value: any) => void | undefined | A callback function triggered when a column is clicked. It passes the value of the clicked column as an argument. |
| navigateTo | (value: any) => string | undefined | A function that returns the URL to navigate to when a column is clicked. |
| width | string \| number | undefined | The width of the column. |
| children | GroupedColumn[] | undefined | An array of GroupedColumn objects representing child columns. |
| columnSxProps | [SxProps](https://mui.com/system/the-sx-prop/) | undefined | Sx Props for customizing the column. |
  

  

## GroupedTableProps

The following props can be passed to the GroupedTable component:

| **Name** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| rows | Data[] | null | Data for Table |
| columns | GroupedColumn[] | null | The Columns for the Table |
| onClick | (value: Data) => void | undefined | Callback function triggered when a row is clicked. It passes the value of the clicked row as an argument. |
| enableSort | boolean | undefined | Boolean indicating whether the table should be sortable. |
| enableBorders | boolean | undefined | Boolean indicating whether the table should have borders. |
| ellipsis | boolean | undefined | Boolean indicating whether text in the table should be truncated with an ellipsis. |
| fixedHeight | number | undefined | Number representing the height of the table. |
| enableFilters | boolean | undefined | Boolean indicating whether the table should display filtering options. |
| filterChanges | (value: IGenericObject<any>) => void | undefined | Callback function triggered when a filter is changed. It passes an object containing the current filter values as an argument. |
| enableCheckBox | boolean | undefined | Boolean indicating whether the table should display checkboxes. |
| checkBoxChange | (data: readonly string[]) => void | undefined | Callback function triggered when a checkbox is changed. It passes an array of the checked rows as an argument. |
| checkboxSelector | string | undefined | String representing the column to display checkboxes in. |


  

  

## Built With

  

  

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces

  

- [Material UI](https://mui.com/material-ui/getting-started/overview/) - Component Library for Material UI

  

  

## License

  

  

MIT Licensed. Copyright (c) Vishal Ramanand Sharma 2023.