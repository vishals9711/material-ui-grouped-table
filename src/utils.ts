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
 * Given a grouped column, return an array of its lowermost labels (i.e., columns with no children).
 *
 * @param element - The grouped column to find the lowermost labels for.
 * @returns An array of lowermost labels.
 */
export const getLowermostLabels = (element: GroupedColumn): GroupedColumn[] => {
  if (element && !element.children) {
    // If the element has no children, return it as an array of one element.
    return [element];
  } else if (element?.children) {
    // If the element has children, recursively find lowermost labels for each child.
    const lowermost: GroupedColumn[] = [];
    for (const child of element.children) {
      const lowermostChild = getLowermostLabels(child);
      lowermost.push(...lowermostChild);
    }
    return lowermost;
  }
  // If the element is null or undefined or has no children, return an empty array.
  return [];
};

/**
 * Returns an array of table head groups and an array of lowermost labels from a given array of grouped columns.
 *
 * @param columns An array of GroupedColumn objects, where each object represents a column and may have children
 * @returns An object containing two arrays:
 * - tableHeadArray: A 2D array of GroupedTableHead objects, where each object represents a group of columns in a row of the table head
 * - columnArray: An array of lowermost labels (Column objects) that represent the columns in the table body
 */
export const getGroupedTableHeadAndColumnArray = (columns: GroupedColumn[]): { tableHeadArray: GroupedTableHead; columnArray: Column[] } => {
  const columnArray: Column[] = [];
  const maxDepth = getArrayDepth(columns);
  const queue: any[] = [...columns];
  const newArray: GroupedTableHead = [];
  const seenId = new Set<string>(); // Tracks the IDs of columns that have already been added to the columnArray
  let currentDepth = 0;
  while (queue.length) {
    const qLength = queue.length;
    const currentArray = [];
    for (let index = 0; index < qLength; index++) {
      const element = queue.shift();
      if (element && element?.children) {
        const { children, ...rest } = element;
        currentArray.push({
          ...rest,
          hasChildren: true,
          rowSpan: maxDepth - currentDepth,
          colSpan: getLeafNodeCount([element]),
        });
        queue.push(...children);
        if (!seenId.has(element.id)) {
          const lowermost = getLowermostLabels(element);
          lowermost.forEach((lower) => {
            const newLower = lower as Column;
            if (!seenId.has(newLower.id)) {
              columnArray.push(newLower);
              seenId.add(newLower.id);
            }
          });
        }
      } else if (element) {
        currentArray.push({ ...element, rowSpan: maxDepth - currentDepth, hasChildren: false });
        if (!seenId.has(element.id)) {
          columnArray.push(element);
          seenId.add(element.id);
        }
      }
    }
    currentDepth++;
    newArray.push(currentArray);
  }
  return { tableHeadArray: newArray, columnArray };
};
