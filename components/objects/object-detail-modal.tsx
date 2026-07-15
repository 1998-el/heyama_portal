"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { getObjectById, type ObjectItem } from "@/services/api";

interface ObjectDetailModalProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
}

export function ObjectDetailModal({ id, open, onClose }: ObjectDetailModalProps) {
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setObject(null);
      setError(null);
      return;
    }

    const objectId = id;
    let cancelled = false;

    async function loadObject() {
      try {
        setLoading(true);
        setError(null);
        const data = await getObjectById(objectId);
        if (!cancelled) {
          setObject(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Erreur lors du chargement";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadObject();

    return () => {
      cancelled = true;
    };
  }, [open, id]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Détails de l&apos;objet</h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && object && (
          <div className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-md border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={object.imageUrl}
                alt={object.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Titre
                </label>
                <p className="mt-1 text-sm font-medium text-card-foreground">
                  {object.title}
                </p>
              </div>

              {object.description && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-card-foreground whitespace-pre-wrap">
                    {object.description}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date de création
                </label>
                <p className="mt-1 text-sm text-card-foreground">
                  {new Date(object.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
