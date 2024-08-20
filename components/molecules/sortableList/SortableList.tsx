import React, { ReactNode, useMemo, useState } from 'react';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/molecules/sortableList/SortableListItem';
import {
  Active,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor, Over,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core/dist/types';

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

  const [active, setActive] = useState<any | null>(null);
  const activeItem  = useMemo(
    () => list.find((item) => item.uuid === active?.id),
    [active, list]
  );

  const onChange = (newArray: Array<T & { uuid: string }>) => {
    onOrderChange(newArray);
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }: {active: Active}) => {
          setActive(active);
        }}
        onDragEnd={({ active, over }: DragEndEvent) => {
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
