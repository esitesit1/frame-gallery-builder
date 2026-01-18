import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PhotoSlot from './PhotoSlot.jsx'

function SortableSlot({ slot, index, frameColor, onUpload, onEdit, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slot.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <PhotoSlot
        index={index}
        imageUrl={slot.editedUrl || slot.originalUrl || null}
        hasSource={Boolean(slot.originalUrl)}
        frameColor={frameColor}
        onUpload={onUpload}
        onEdit={onEdit}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export default function GalleryGrid({ slots, setSlots, frameColor, onUploadForId, onEditId, onRemoveId }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setSlots((prev) => {
          const oldIndex = prev.findIndex((s) => s.id === active.id)
          const newIndex = prev.findIndex((s) => s.id === over.id)
          if (oldIndex === -1 || newIndex === -1) return prev
          return arrayMove(prev, oldIndex, newIndex)
        })
      }}
    >
      <SortableContext items={slots.map((s) => s.id)}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot, index) => (
            <SortableSlot
              key={slot.id}
              slot={slot}
              index={index}
              frameColor={frameColor}
              onUpload={(file) => onUploadForId(slot.id, file)}
              onEdit={() => onEditId(slot.id)}
              onRemove={() => onRemoveId(slot.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
