import React, { CSSProperties } from 'react';
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIcon, UserIcon } from '@/components/atoms/Icons';

interface ISortableListItemProps<T> {
  item: T & { uuid: string };
  children: (listItem: T) => React.ReactNode;
}

// export default function SortableListItem<T>({
//   item,
//   children
// }: ISortableListItemProps<T>) {
//   return (
//     <div key={item.uuid}>
//       <div>{children(item)}</div>
//     </div>
//   );
// }

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging
}: any) => (isSorting || wasDragging ? false : true);

export function SortableItem({ id, value, item, children, ...props }: any) {
  const {
    setDroppableNodeRef,
    transition,
    setDraggableNodeRef,
    transform,
    attributes,
    isDragging,
    listeners
  } = useSortable({
    id,
    animateLayoutChanges
  });
  const handleProps = { ...attributes, ...listeners };
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined
  };

  const dragElement = (
    <div {...handleProps}>
      <DragIcon />
    </div>
  );

  return (
    <div style={style} ref={setDroppableNodeRef} {...props}>
      <div ref={setDraggableNodeRef}>
        <div key={item.uuid}>
          <div>{children(dragElement)}</div>
        </div>
      </div>
    </div>
  );
}
