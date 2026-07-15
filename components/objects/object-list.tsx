"use client";

import { ObjectItem } from "@/services/api";
import { ObjectCard } from "./object-card";

interface ObjectListProps {
  items: ObjectItem[];
  onSelect: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function ObjectList({ items, onSelect, onDeleteRequest }: ObjectListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 py-16 text-center">
        <p className="text-sm text-muted-foreground">Aucun objet pour le moment</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={item.id || `object-${item.title || index}`} onClick={() => onSelect(item.id)} className="cursor-pointer">
          <ObjectCard item={item} onDelete={onDeleteRequest} />
        </div>
      ))}
    </div>
  );
}
