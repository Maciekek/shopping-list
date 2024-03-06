'use client';

import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ListItem } from '@/models';
import { getList, updateListItems } from '@/app/lists/actions/list';
import { useDebouncedCallback } from 'use-debounce';

import SortableList from '@/components/molecules/sortableList/SortableList';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';


export default function List({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [list, setList] = useState<ListItem[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getList(params.id).then((result) => {
      const listItems = result?.items as unknown as ListItem[];
      setList(listItems);

      setStatus('ready');
    });
  }, []);

  const addListItem = async (formData: FormData) => {
    const itemName = formData.get('itemName');
    const item: ListItem = {
      uuid: uuidv4(),
      name: itemName as string,
      selected: false
    };

    formRef.current?.reset();
    formRef.current?.focus()

    const newList = [item, ...list];

    setList(newList);
    await updateListItems(params.id, newList);
  };

  const sortList = async () => {
    const updatedList = list.reduce(
      (acc: { active: ListItem[]; finished: ListItem[] }, item) => {
        if (item.selected) {
          return { ...acc, finished: [...acc.finished, item] };
        }

        return { ...acc, active: [...acc.active, item] };
      },
      { active: [], finished: [] }
    );

    setList([...updatedList.active, ...updatedList.finished]);
    await updateListItems(params.id, [
      ...updatedList.active,
      ...updatedList.finished
    ]);
  };

  const sortListDebounced = useDebouncedCallback(sortList, 500);

  const selectItem = (id: string) => {
    const updatedList = list.map((item) => {
      if (item.uuid === id) {
        return { ...item, selected: !item.selected };
      }

      return item;
    });

    setList(updatedList);
    sortListDebounced();
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <form ref={formRef} action={addListItem} className={'w-1/1'}>
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

        <div>
          {status === 'ready' && (
            <SortableList list={list}>
              {(item: ListItem) => (
                <div
                  className={cn('border cursor-pointer flex items-center p-4')}
                  onClick={() => {
                    selectItem(item.uuid);
                  }}
                >
                  <div className={'flex pr-6'}>
                    <Checkbox checked={item.selected} />
                  </div>

                  <div className="font-medium">{item.name}</div>
                </div>
              )}
            </SortableList>
          )}
        </div>
      </main>
    </div>
  );
}
