'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteList } from '@/app/api/list';

export default function DropdownAction({id}: any) {
  return <DropdownMenuItem onClick={() => deleteList(id)}>Delete</DropdownMenuItem>;
};
