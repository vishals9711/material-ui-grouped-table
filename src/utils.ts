import { Column, GroupedColumn, GroupedTableHead, Order } from './GroupedTableComponent/GroupedTableComponent.types';

/**
 * Returns a comparator function based on the order and orderBy parameters.
 *
 * @template Key A key that exists in the object being compared.
 * @param order The order in which the objects should be sorted ('asc' or 'desc').
 * @param orderBy The key of the object to order by.
 * @returns A comparator function.
 */
export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Returns the count of leaf nodes in an array of grouped columns.
 *
 * @param columns An array of grouped columns.
 * @returns The count of leaf nodes.
 */
const getLeafNodeCount = (columns: GroupedColumn[]): number => {
  let count = 0;
  columns.forEach((column) => {
    if (!column.children) {
      count += 1;
    } else {
      count += getLeafNodeCount(column.children);
    }
  });
  return count;
};

/**
 * A comparator function that sorts values in descending order based on the specified key of an object.
 *
 * @template T The type of objects being compared.
 * @param a The first object to compare.
 * @param b The second object to compare.
 * @param orderBy The key of the objects to use for comparison.
 * @returns A number indicating the sort order of the objects.
 */
export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

/**
 * Returns the depth of an array of nested arrays and objects with children property.
 *
 * @param arr The input array.
 * @returns The depth of the array.
 */
export const getArrayDepth = (arr: any): number => {
  if (!Array.isArray(arr) && (!arr.children || !arr.children.length)) {
    return 0;
  }
  return 1 + Math.max(...(Array.isArray(arr) ? arr : arr.children).map(getArrayDepth));
};

/**
 * This function takes in an array of grouped columns and returns a grouped table head and an array of columns
 * @param columns - an array of grouped columns
 * @returns - an object with a grouped table head and an array of columns
 */
export const getGroupedTableHeadAndColumnArray = (columns: GroupedColumn[]): { tableHeadArray: GroupedTableHead; columnArray: Column[] } => {
  // Create an array to store the columns
  const columnArray: Column[] = [];

  // Get the maximum depth of the array
  const maxDepth = getArrayDepth(columns);

  // Create a queue to store the grouped columns
  const queue: any[] = columns;

  // Create an array to store the grouped table head
  const tableHeadArray: GroupedTableHead = [];

  // Initialize the current depth to 0
  let currentDepth = 0;

  // Loop through the queue until it is empty
  while (queue.length) {
    // Store the length of the queue for iteration
    const qLength = queue.length;

    // Create an array to store the current set of grouped columns
    const currentArray = [];

    // Loop through the queue
    for (let index = 0; index < qLength; index++) {
      // Get the next element in the queue
      const element = queue.shift();

      // If the element has children
      if (element && element?.children) {
        // Destructure the children property
        const { children, ...rest } = element;

        // Push the updated element to the current array
        currentArray.push({
          ...rest,
          hasChildren: true,
          rowSpan: maxDepth - currentDepth,
          colSpan: getLeafNodeCount([element]),
        });

        // Push the children to the queue
        queue.push(...children);
      }
      // If the element does not have children
      else if (element) {
        // Push the element to the current array
        currentArray.push({ ...element, rowSpan: maxDepth - currentDepth, hasChildren: false });

        // Push the element to the column array
        columnArray.push(element);
      }
    }

    // Increment the current depth
    currentDepth++;

    // Push the current array to the grouped table head array
    tableHeadArray.push(currentArray);
  }

  // Return the grouped table head array and the column array
  return { tableHeadArray, columnArray };
};
