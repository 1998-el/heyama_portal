"use client";

import { useEffect, useState, useCallback } from "react";
import { getObjects, createObject, deleteObject, type ObjectItem } from "@/services/api";
import { onObjectCreated, onObjectDeleted } from "@/services/socket";
import { toast } from "sonner";

export function useObjects() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getObjects();
      setObjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchObjects();
  }, [fetchObjects]);

  useEffect(() => {
    const unsubCreated = onObjectCreated((obj) => {
      setObjects((prev) => [obj, ...prev]);
      toast.success("Nouvel objet ajouté");
    });
    const unsubDeleted = onObjectDeleted((id) => {
      setObjects((prev) => prev.filter((o) => o.id !== id));
      toast.success("Objet supprimé");
    });
    return () => {
      unsubCreated();
      unsubDeleted();
    };
  }, []);

  const handleCreate = useCallback(
    async (title: string, description: string, imageFile: File) => {
      const newObj = await createObject(title, description, imageFile);
      setObjects((prev) => [newObj, ...prev]);
      toast.success("Objet créé avec succès");
      return newObj;
    },
    []
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteObject(id);
      setObjects((prev) => prev.filter((o) => o.id !== id));
    },
    []
  );

  return { objects, loading, error, handleCreate, handleDelete, refetch: fetchObjects };
}
