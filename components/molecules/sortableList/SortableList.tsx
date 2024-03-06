import { Reorder, useDragControls } from 'framer-motion';
import { Checkbox } from '@/components/atoms/Checkbox';
import React, { useEffect } from 'react';
import SortableListItem from '@/components/molecules/sortableList/SortableListItem';

interface SortableListProps<T> {
  list: Array<T & { uuid: string }>;
  children: (listItem: T, index: number) => React.ReactNode;
}

export default function SortableList<T>({
  list,
  children
}: SortableListProps<T>) {
  const [items, setItems] = React.useState(list);
  useEffect(() => {
    setItems(list);
  }, [list]);

  return (
    <div>
      <Reorder.Group axis="y" values={list} onReorder={() => {}}>
        {list.map((item, index: number) => {
          return (
            <SortableListItem key={item.uuid} item={item}>
              {() => children(item, index)}
            </SortableListItem>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
