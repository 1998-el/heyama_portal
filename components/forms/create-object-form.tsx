"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DropZone } from "@/components/ui/drop-zone";
import type { ObjectItem } from "@/services/api";

interface CreateObjectFormProps {
  onSubmit: (title: string, description: string, imageFile: File) => Promise<ObjectItem>;
}

export function CreateObjectForm({ onSubmit }: CreateObjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        toast.error("Le titre est requis");
        return;
      }
      if (!imageFile) {
        toast.error("L'image est requise");
        return;
      }

      try {
        setSubmitting(true);
        await onSubmit(title.trim(), description.trim(), imageFile);
        toast.success("Objet créé avec succès");
        reset();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors de la création";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [title, description, imageFile, onSubmit, reset]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          placeholder="Ex: Mon nouveau produit"
          className={cn(
            "w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
            "border-border transition-colors",
            "focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          placeholder="Description optionnelle..."
          rows={3}
          className={cn(
            "w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
            "border-border transition-colors resize-none",
            "focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Image</label>
        <DropZone onFileSelect={handleFileSelect} disabled={submitting} />

        {imagePreview && (
      <div className="relative mt-3 h-40 w-full overflow-hidden rounded-md border border-border bg-muted">
        <Image
          src={imagePreview!}
          alt="Aperçu"
          fill
          className="object-contain"
        />
      </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Créer l&apos;objet
          </>
        )}
      </button>
    </form>
  );
}
