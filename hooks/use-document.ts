"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function useDocuments() {
  return useQuery<{ documents: Document[] }>({
    queryKey: ["documents"],
    queryFn: () => fetch("/api/documents").then((r) => r.json()),
  });
}

export function useDocument(id: string) {
  return useQuery<{ document: Document }>({
    queryKey: ["documents", id],
    queryFn: () => fetch(`/api/documents/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; content?: string }) =>
      fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useUpdateDocument(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; content?: string }) =>
      fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["documents", id] });
    },
  });
}
