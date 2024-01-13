/**
 * Filters an array to retain only distinct values, preserving the original order of appearance.
 *
 * @typeparam T - The type of elements in the array.
 * @param array - The array containing elements of type T.
 * @returns A new array containing only the distinct values from the input array.
 */
export const filterDistinctValues = <T>(array: T[]): T[] => {
    const distinctSet = new Set<T>();
    const result: T[] = [];
  
    for (const item of array) {
      if (!distinctSet.has(item)) {
        distinctSet.add(item);
        result.push(item);
      }
    }
  
    return result;
  }