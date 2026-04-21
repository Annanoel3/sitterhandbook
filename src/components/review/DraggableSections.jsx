import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import CategorySection from './CategorySection';

export default function DraggableSections({ orderedKeys, categoryConfig, data, onUpdate, onReorder }) {
  const onDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const newOrder = Array.from(orderedKeys);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    onReorder(newOrder);
  };

  // Only show keys that have content
  const activeKeys = orderedKeys.filter(k => data[k] && !k.startsWith('_'));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {activeKeys.map((key, index) => {
              const config = categoryConfig[key];
              if (!config) return null;
              return (
                <Draggable key={key} draggableId={key} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20 rounded-2xl' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {/* Drag handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="mt-4 p-1.5 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing rounded-lg hover:bg-muted transition-colors"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <CategorySection
                            icon={config.icon}
                            title={config.title}
                            color={config.color}
                            content={data[key]}
                            onUpdate={(val) => onUpdate(key, val)}
                          />
                        </div>
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