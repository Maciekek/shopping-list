import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapArrayToObject<T, K extends keyof T>(array: T[], key: K): Record<string, T> {
  return array.reduce((acc: Record<string, T>, item: T) => {
    return {
      ...acc,
      [String(item[key])]: item
    };
  }, {});
}


export function mapObjectToArray<T>(object: {[key: string]: T}): T[] {
  return Object.keys(object).map((key) => object[key])
}

//
// export function debounce(callback: () => void, delay: number = 500) {
//   let timeoutId: NodeJS.Timeout;
//
//   return function() {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(callback, delay);
//   }
// }
