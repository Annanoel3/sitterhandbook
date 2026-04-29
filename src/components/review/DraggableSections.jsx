import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import CategorySection from './CategorySection';

export default function DraggableSections({ orderedKeys, categoryConfig, data, onUpdate, onReorder, newKey, locked = false }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(orderedKeys);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    onReorder(newOrder);
  };

  // Show keys that have content OR are newly added
  const visibleKeys = orderedKeys.filter(k => data[k] || k === newKey);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
            {visibleKeys.map((key, i) => {
              const config = categoryConfig[key];
              if (!config) return null;
              return (
                <Draggable key={key} draggableId={key} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative transition-shadow ${snapshot.isDragging ? 'shadow-xl' : ''}`}
                    >
                      {/* Drag handle tab on the left */}
                      <div
                        {...provided.dragHandleProps}
                        className="absolute left-0 top-0 bottom-0 w-7 flex items-center justify-center text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing z-10 rounded-l-xl"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="pl-6">
                        <CategorySection
                          icon={config.icon}
                          title={config.title}
                          color={config.color}
                          content={data[key]}
                          onUpdate={(val) => onUpdate(key, val)}
                          autoEdit={key === newKey}
                          locked={locked}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}