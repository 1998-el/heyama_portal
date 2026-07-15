"use client";

import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import type { ObjectItem } from "@/services/api";

interface ObjectCardProps {
  item: ObjectItem;
  onDelete: (id: string) => void;
}

export function ObjectCard({ item, onDelete }: ObjectCardProps) {
  return (
    <div
      className={cn(
        "group flex gap-4 rounded-lg border bg-card p-4 transition-colors",
        "border-border hover:border-primary/30"
      )}
    >
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString("fr-FR")}
          </time>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
              "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
