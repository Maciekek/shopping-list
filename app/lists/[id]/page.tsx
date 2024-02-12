'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getList, getSharedLists, updateListItems } from '@/app/api/list';
import { Checkbox } from '@/components/ui/checkbox';
import { List, ListItem } from '@/models';
import { Skeleton } from '@/components/ui/skeleton';

interface FormListElements extends HTMLFormControlsCollection {
  itemName: HTMLInputElement;
}

interface ListForm extends HTMLFormElement {
  readonly elements: FormListElements;
}

export default function List({ params }: { params: { id: number } }) {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [list, setList] = useState<ListItem[]>([]);

  useEffect(() => {
    getList(params.id).then((result) => {
      setList(result?.items);
      setStatus('ready');
    });
  }, []);

  const addListItem = (e: React.FormEvent<ListForm>) => {
    e.preventDefault();
    const listNameInput = e.currentTarget.elements.itemName;

    const item: ListItem = {
      uuid: (Math.random() * 1000000).toFixed(0),
      name: listNameInput.value,
      selected: false
    };

    const newList: ListItem[] = [item, ...list];
    setList(newList);

    updateListItems(params.id, newList);
    listNameInput.value = '';
  };

  const selectItem = (id: string) => {
    const updatedList = list.map((item) => {
      if (item.uuid === id) {
        return {
          ...item,
          selected: !item.selected
        };
      }

      return item;
    });

    setList(updatedList);

    updateListItems(params.id, updatedList);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <form onSubmit={addListItem} className={'w-1/1'}>
          <div className="flex items-center gap-4">
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
          </div>
        </form>

        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableBody>
              {status === 'loading' && (
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>
                </TableRow>
              )}

              {status === 'ready' &&
                list?.map((item: ListItem) => {
                  return (
                    <TableRow className={'cursor-pointer'} key={item.uuid} onClick={() => {
                      selectItem(item.uuid);
                    }}>
                      <TableCell className={'w-2'}>
                        <Checkbox
                          checked={item.selected}
                          onClick={() => {
                            selectItem(item.uuid);
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
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
