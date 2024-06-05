import * as lists from './lists'
import { createSafeActionClient } from 'next-safe-action';

export const db = {
  lists
}

export const action = createSafeActionClient();
