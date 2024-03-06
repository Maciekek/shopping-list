import { Reorder, useDragControls, motion } from 'framer-motion';
import React from 'react';

interface ISortableListItemProps<T> {
  item: T & { uuid: string };
  children: (listItem: T) => React.ReactNode;
}

export default function SortableListItem<T>({
  item,
  children
}: ISortableListItemProps<T>) {
  return (
    <Reorder.Item key={item.uuid} value={item} dragListener={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1}}
      >
        {children(item)}
      </motion.div>
    </Reorder.Item>
  );
}
