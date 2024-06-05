import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResponseError } from '@/services/ListService';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isError = <T>(
  result: object | null
): result is ResponseError => {
  if (!result) {
    return false;
  }

  return 'hasError' in result && result.hasError === true;
}
