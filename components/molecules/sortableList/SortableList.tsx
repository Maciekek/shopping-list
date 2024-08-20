import React, { CSSProperties, ReactNode, useMemo, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';

import {
  AnimateLayoutChanges,
  arrayMove,
  NewIndexGetter,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Container } from '@react-email/components';
import { SortableItem } from '@/components/molecules/sortableList/SortableListItem';
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { UserIcon } from '@/components/atoms/Icons';

interface SortableListProps<T> {
  list: Array<T & { uuid: string }>;
  children: (listItem: T, dragHandleElement: ReactNode) => React.ReactNode;
  onOrderChange: (newArray: Array<T & { uuid: string }>) => void;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
};

export default function SortableList<T>({
  list,
  children,
  onOrderChange
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  // const [listTemp, setItems] = useState(list);

  const [active, setActive] = useState<any | null>(null);
  const activeItem: any = useMemo(
    () => list.find((item) => item.uuid === active?.id),
    [active, list]
  );

  const onChange = (newArray: any) => {
    // setItems([...newArray]);
    onOrderChange(newArray);
  };
  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => {
          setActive(active);
        }}
        onDragEnd={({ active, over }: any) => {
          if (over && active.id !== over?.id) {
            const activeIndex = list.findIndex(
              ({ uuid }) => uuid === active.id
            );
            const overIndex = list.findIndex(
              ({ uuid }) => uuid === over.id
            );

            onChange(arrayMove(list, activeIndex, overIndex));
          }
          setActive(null);
        }}
        onDragCancel={() => {
          setActive(null);
        }}
      >
        <SortableContext
          items={list.map((item) => item.uuid)}
          strategy={verticalListSortingStrategy}
        >
          {list.map((item) => {
            return (
              <SortableItem
                key={item.uuid}
                item={item}
                id={item.uuid}
                value={item.uuid}
                handle
              >
                {(dragHandleElement: ReactNode) => children(item, dragHandleElement)}
              </SortableItem>
            );
          })}
        </SortableContext>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeItem && children(activeItem, null)}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
