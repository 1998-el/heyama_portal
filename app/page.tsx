"use client";

import { useState } from "react";
import { useObjects } from "@/hooks/use-objects";
import { CreateObjectForm } from "@/components/forms/create-object-form";
import { ObjectList } from "@/components/objects/object-list";
import { ObjectDetailModal } from "@/components/objects/object-detail-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function Home() {
  const { objects, loading, error, handleCreate, handleDelete } = useObjects();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setDeleting(true);
      await handleDelete(pendingDeleteId);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-5xl px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-card-foreground">
              Heyama
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {objects.length} {objects.length <= 1 ? "objet" : "objets"}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-4">
              <div className="sticky top-8 space-y-1.5 mb-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Nouvel objet
                </h2>
                <p className="text-xs text-muted-foreground">
                  Créez un objet avec titre, description et image.
                </p>
              </div>
              <CreateObjectForm onSubmit={handleCreate} />
            </section>

            <section className="lg:col-span-8">
              <div className="mb-4 space-y-1.5">
                <h2 className="text-sm font-semibold text-foreground">
                  Liste des objets
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 py-16">
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <ObjectList
                  items={objects}
                  onSelect={setSelectedId}
                  onDeleteRequest={setPendingDeleteId}
                />
              )}
            </section>
          </div>
        </div>
      </main>

      <ObjectDetailModal
        id={selectedId}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Supprimer l'objet"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer cet objet ?"
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
