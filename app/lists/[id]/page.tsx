'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@/components/atoms/Table';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { ListItem } from '@/models';
import { Skeleton } from '@/components/atoms/Skeleton';
import { getList, updateListItems } from '@/app/lists/actions/list';
import { useDebouncedCallback } from 'use-debounce';
import { AnimatePresence, motion, Reorder } from 'framer-motion';

interface FormListElements extends HTMLFormControlsCollection {
  itemName: HTMLInputElement;
}

export default function List({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [list, setList] = useState<{
    active: ListItem[];
    finished: ListItem[];
  }>({
    active: [],
    finished: []
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getList(params.id).then((result) => {
      const listItems = result?.items as unknown as ListItem[];
      setList({
        active: listItems.filter((item: ListItem) => !item.selected),
        finished: listItems.filter((item: ListItem) => item.selected)
      });

      setStatus('ready');
    });
  }, []);

  const addListItem = async (formData: FormData) => {
    const itemName = formData.get('itemName');
    const item: ListItem = {
      uuid: (Math.random() * 1000000).toFixed(0),
      name: itemName as string,
      selected: false
    };
    const newList = {
      active: [item, ...list.active],
      finished: [...list.finished]
    };

    formRef.current?.reset();

    await updateListItems(params.id, [...newList.active, ...newList.finished]);

    setList(newList);
  };

  const sortList = async () => {
    const newActiveItemsList = list.active.filter((item) => !item.selected);
    const newFinishedItemsFromActiveList = list.active.filter(
      (item) => item.selected
    );

    const newFinishedItemsList = list.finished.filter((item) => item.selected);
    const newActiveItemsFromFinishedList = list.finished.filter(
      (item) => !item.selected
    );

    const sortedList = {
      active: [...newActiveItemsFromFinishedList, ...newActiveItemsList],
      finished: [...newFinishedItemsFromActiveList, ...newFinishedItemsList]
    };

    setList(sortedList);
    await updateListItems(params.id, [
      ...sortedList.active,
      ...sortedList.finished
    ]);
  };

  const sortListDebounced = useDebouncedCallback(sortList, 500);

  const selectItem = async (id: string, isSelected: boolean) => {
    const listToModify = isSelected ? list.finished : list.active;
    const updatedList = listToModify.map((item) => {
      if (item.uuid === id) {
        return { ...item, selected: !item.selected };
      }

      return item;
    });

    isSelected
      ? setList({ active: list.active, finished: updatedList })
      : setList({ active: updatedList, finished: list.finished });

    isSelected
      ? await updateListItems(params.id, [...updatedList, ...list.finished])
      : await updateListItems(params.id, [...list.active, ...updatedList]);

    sortListDebounced();
  };

  const wholeList = [...list.active, ...list.finished];

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

        <div className="border shadow-sm rounded-lg">
          <AnimatePresence>
          {status === 'ready' &&
            wholeList.map((item) => (
              <motion.div
                key={item.uuid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className={'cursor-pointer'}
                  key={item.uuid}
                  onClick={() => {
                    selectItem(item.uuid, item.selected);
                  }}
                >
                  <div className={'w-2'}>
                    <Checkbox
                      checked={item.selected}
                      onClick={() => {
                        selectItem(item.uuid, item.selected);
                      }}
                    />
                  </div>

                  <TableCell className="font-medium">{item.name}</TableCell>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
