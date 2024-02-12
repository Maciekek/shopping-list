'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getList, updateList } from '../../api/list';
import { Checkbox } from '@/components/ui/checkbox';

export default function List({ params }: { params: { id: number } }) {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [list, setList] = useState<{ name: string; items: string[] }>();

  useEffect(() => {
    getList(params.id).then((result) => {
      setList({ name: result.name, items: result.items });
      setStatus('ready');
    });
  }, []);

  const addListItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    const listNameInput = e.target.elements.itemName;

    const newList = {
      name: list!.name,
      items: [...list!.items, listNameInput.value]
    };

    setList(newList);
    // @ts-ignore
    updateList(params.id, newList);
    listNameInput.value = '';
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <form onSubmit={addListItem} className={'w-1/1'}>
            <Input
              name={'itemName'}
              className="flex-1"
              placeholder="Add new item"
            />
            <Input
              name={'listId'}
              className="flex-1 hidden"
              readOnly
              value={params.id}
            />
            <Button variant="outline">Add</Button>
          </form>
        </div>
        <div className="border shadow-sm rounded-lg">
          {status === 'loading' && <div>loading</div>}
          <Table>
            <TableBody>
              {status === 'ready' &&
                list!.items.map((item) => {
                  return (
                    <TableRow key={item}>
                      <TableCell className={'w-2'}>
                        <Checkbox id="select-1" />
                      </TableCell>
                      <TableCell className="font-medium">{item}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
