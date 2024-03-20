'use client';

import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import React, { useRef } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { List as ListModel, ListItem } from '@/models';

import SortableList from '@/components/molecules/sortableList/SortableList';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { useOptimistic } from 'react';
import { updateListItems } from '@/actions/lists';
import { isObject } from 'lodash';

export default function List({
  list,
  listId,
  isReadOnly = false
}: {
  list: ListModel;
  listId: string;
  isReadOnly?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const items = list!.items as ListItem[];

  const [optimisticListItems, addOptimisticListItem] = useOptimistic(
    items,
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
          return item as ListItem;
        });
      }

      return list?.items as ListItem[];
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
    await updateListItems(listId, newList, isObject(list!.share));
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

    await updateListItems(listId, updatedList, isObject(list!.share));
  };

  return (
    <div className="flex flex-col mx-auto sm:border-0 md:border md:border-t-0 pb-2 md:border-slate-200 rounded-b-lg">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {!isReadOnly && (
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
        )}

        <div>
          <SortableList list={optimisticListItems}>
            {(item: ListItem) => (
              <div
                className={cn('border flex items-center p-4', {
                  'cursor-pointer': !isReadOnly
                })}
                onClick={() => {
                  if (isReadOnly) {
                    return;
                  }
                  selectItem(item);
                }}
              >
                <div className={'flex pr-6'}>
                  <Checkbox disabled={isReadOnly} checked={item.selected} />
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
