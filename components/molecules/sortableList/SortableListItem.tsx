import React, { CSSProperties } from 'react';
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIcon } from '@/components/atoms/Icons';

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
    opacity: isDragging ? 0.1 : undefined,
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
