const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://heyama-h7gwjo6l6-charly-pierre-mounkams-projects.vercel.app";

export interface ObjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

function transformObject(obj: Record<string, unknown>): ObjectItem {
  return {
    id: (obj._id as string) || (obj.id as string),
    title: obj.title as string,
    description: (obj.description as string) || "",
    imageUrl: obj.imageUrl as string,
    createdAt: obj.createdAt as string,
  };
}

export async function getObjects(): Promise<ObjectItem[]> {
  const res = await fetch(`${API_URL}/objects`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch objects");
  }
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data.map(transformObject);
}

export async function createObject(
  title: string,
  description: string,
  imageFile: File
): Promise<ObjectItem> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("image", imageFile);

  const res = await fetch(`${API_URL}/objects`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Failed to create object" }));
    throw new Error(error.message || "Failed to create object");
  }
  const data = await res.json();
  return transformObject(data);
}

export async function deleteObject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/objects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete object");
  }
}

export async function getObjectById(id: string): Promise<ObjectItem> {
  const res = await fetch(`${API_URL}/objects/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch object");
  }
  const data = await res.json();
  return transformObject(data);
}
