'use client';

import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import React, { useRef } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ListItem } from '@/models';
import { updateListItems } from '@/app/lists/actions/list';

import SortableList from '@/components/molecules/sortableList/SortableList';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { useOptimistic } from 'react';

export default function List({
  list,
  listId
}: {
  list: ListItem[];
  listId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticListItems, addOptimisticListItem] = useOptimistic(
    list,
    (
      state: ListItem[],
      updateListAction: {
        action: 'ADD' | 'SELECT';
        item: ListItem;
      }
    ) => {
      if (updateListAction.action === 'ADD') {
        return [updateListAction.item, ...state];
      }

      if (updateListAction.action === 'SELECT') {
        return state.map((item) => {
          if (item.uuid === updateListAction.item.uuid) {
            return {
              ...item,
              selected: !item.selected
            };
          }
          return item;
        });
      }
      return list;
    }
  );

  const addListItem = async (formData: FormData) => {
    const itemName = formData.get('itemName');
    const item: ListItem = {
      uuid: uuidv4(),
      name: itemName as string,
      selected: false
    };

    formRef.current?.reset();
    formRef.current?.focus();

    const newList = [item, ...optimisticListItems];
    addOptimisticListItem({
      item,
      action: 'ADD'
    });
    await updateListItems(listId, newList);
  };

  const selectItem = async (item: ListItem) => {
    const updatedList = optimisticListItems.map((el) => {
      if (el.uuid === item.uuid) {
        return { ...el, selected: !el.selected };
      }

      return el;
    });

    addOptimisticListItem({
      item,
      action: 'SELECT'
    });

    await updateListItems(listId, updatedList);
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
              value={listId}
            />
            <Button variant="outline">Add</Button>
          </div>
        </form>

        <div>
          <SortableList list={list}>
            {(item: ListItem) => (
              <div
                className={cn('border cursor-pointer flex items-center p-4')}
                onClick={() => {
                  // selectItem(item);
                }}
              >
                <div className={'flex pr-6'}>
                  <Checkbox checked={item.selected} />
                </div>

                <div className="font-medium">{item.name}</div>
              </div>
            )}
          </SortableList>
        </div>
      </main>
    </div>
  );
}
