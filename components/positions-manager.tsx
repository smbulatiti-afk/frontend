"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BriefcaseBusiness,
  CircleAlert,
  Eye,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createPosition,
  deletePosition,
  getPositions,
  updatePosition,
  type Position,
  type PositionInput,
} from "@/lib/api";

const emptyForm: PositionInput = { positionCode: "", positionName: "" };

type PositionDialog =
  | { type: "create" }
  | { type: "view" | "edit" | "delete"; position: Position };

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function PositionsManager({ enabled }: { enabled: boolean }) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [form, setForm] = useState<PositionInput>(emptyForm);
  const [dialog, setDialog] = useState<PositionDialog | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Position["id"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const filteredPositions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) {
      return positions;
    }

    return positions.filter((position) =>
      `${position.positionCode} ${position.positionName}`.toLocaleLowerCase().includes(query),
    );
  }, [positions, search]);

  const loadPositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPositions(await getPositions());
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load positions."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    getPositions()
      .then((items) => {
        if (active) {
          setPositions(items);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(getErrorMessage(loadError, "Unable to load positions."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  const resetForm = () => {
    setForm(emptyForm);
  };

  const openCreateDialog = () => {
    resetForm();
    setError(null);
    setDialog({ type: "create" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (dialog?.type !== "create" && dialog?.type !== "edit") {
      return;
    }

    const payload = {
      positionCode: form.positionCode.trim(),
      positionName: form.positionName.trim(),
    };
    if (!payload.positionCode || !payload.positionName) {
      setError("Position code and position name are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (dialog.type === "create") {
        await createPosition(payload);
      } else {
        await updatePosition(dialog.position.id, payload);
      }

      resetForm();
      setDialog(null);
      await loadPositions();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save this position."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (position: Position) => {
    setForm({
      positionCode: position.positionCode,
      positionName: position.positionName,
    });
    setError(null);
    setDialog({ type: "edit", position });
  };

  const handleDelete = async () => {
    if (dialog?.type !== "delete") {
      return;
    }

    const position = dialog.position;
    setDeletingId(position.id);
    setError(null);
    try {
      await deletePosition(position.id);
      setPositions((current) => current.filter((item) => item.id !== position.id));
      setDialog(null);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete this position."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog.Root
      open={dialog !== null}
      onOpenChange={(open) => {
        if (!open && !saving && deletingId === null) {
          setDialog(null);
          setError(null);
        }
      }}
      disablePointerDismissal={saving || deletingId !== null}
    >
      <Card className="gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-0 shadow-sm shadow-slate-900/[0.03]">
        <CardHeader className="flex flex-col gap-5 border-b border-slate-100 bg-white px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-indigo-200 shadow-lg shadow-indigo-950/15">
              <BriefcaseBusiness className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Organization
              </p>
              <CardTitle className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Positions
              </CardTitle>
              <CardDescription className="mt-1">
                Manage position codes and titles in one place.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium text-slate-600">
              {positions.length} {positions.length === 1 ? "position" : "positions"}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadPositions()}
              disabled={!enabled || loading}
              className="h-10 gap-2 rounded-xl border-slate-200 bg-white/80 px-3"
            >
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh
            </Button>
            <Button
              type="button"
              onClick={openCreateDialog}
              disabled={!enabled}
              className="h-10 gap-2 rounded-xl bg-indigo-600 px-4 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Plus className="size-4" />
              Add position
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Position directory</p>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredPositions.length} of {positions.length} records
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Search positions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search code or name..."
                className="h-10 rounded-xl border-slate-200 bg-white pl-9 shadow-sm shadow-slate-900/[0.02] focus-visible:border-indigo-300 focus-visible:ring-indigo-500/20"
              />
            </div>
          </div>

          {error && !dialog ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-slate-200/80">
            <Table>
              <TableHeader className="bg-slate-50/90">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="w-20 px-4 text-xs uppercase tracking-wide text-slate-500">
                    ID
                  </TableHead>
                  <TableHead className="px-4 text-xs uppercase tracking-wide text-slate-500">
                    Position code
                  </TableHead>
                  <TableHead className="px-4 text-xs uppercase tracking-wide text-slate-500">
                    Position name
                  </TableHead>
                  <TableHead className="px-4 text-xs uppercase tracking-wide text-slate-500">
                    Created at
                  </TableHead>
                  <TableHead className="w-32 px-4 text-right text-xs uppercase tracking-wide text-slate-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position) => (
                  <TableRow
                    key={position.id}
                    className="border-slate-100 transition-colors hover:bg-indigo-50/35"
                  >
                    <TableCell className="px-4 py-3.5 text-xs font-medium text-slate-400">
                      {position.id}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span className="inline-flex rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {position.positionCode}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-medium text-slate-900">
                      {position.positionName}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-sm text-slate-500">
                      {formatCreatedAt(position.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setError(null);
                            setDialog({ type: "view", position });
                          }}
                          disabled={deletingId !== null}
                          aria-label={`View ${position.positionName}`}
                          title="View details"
                          className="text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(position)}
                          disabled={saving || deletingId !== null}
                          aria-label={`Edit ${position.positionName}`}
                          title="Edit position"
                          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setError(null);
                            setDialog({ type: "delete", position });
                          }}
                          disabled={saving || deletingId !== null}
                          aria-label={`Delete ${position.positionName}`}
                          title="Delete position"
                          className="text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filteredPositions.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="px-4 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          {search ? <Search className="size-5" /> : <BriefcaseBusiness className="size-5" />}
                        </div>
                        <p className="font-semibold text-slate-900">
                          {search ? "No matching positions" : "No positions yet"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {search
                            ? "Try another code or position name."
                            : "Add a position to get started."}
                        </p>
                        {!search ? (
                          <Button
                            type="button"
                            onClick={openCreateDialog}
                            disabled={!enabled}
                            className="mt-4 gap-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <Plus className="size-4" />
                            Add your first position
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="px-4 py-14 text-center text-slate-500">
                      <span className="inline-flex items-center gap-2 text-sm">
                        <LoaderCircle className="size-4 animate-spin text-indigo-600" />
                        Loading positions...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-950/25 outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          {dialog?.type === "view" ? (
            <>
              <div className="flex items-start gap-4 border-b border-slate-100 p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Eye className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
                    Position details
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-500">
                    Review the saved position information.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close position details"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  <X className="size-4" />
                </Dialog.Close>
              </div>
              <dl className="grid gap-3 p-6 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">ID</dt>
                  <dd className="mt-2 break-all font-semibold text-slate-900">{dialog.position.id}</dd>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                    Position code
                  </dt>
                  <dd className="mt-2 break-words font-semibold text-indigo-900">
                    {dialog.position.positionCode}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Position name
                  </dt>
                  <dd className="mt-2 break-words font-semibold text-slate-900">
                    {dialog.position.positionName}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Created at
                  </dt>
                  <dd className="mt-2 break-words font-medium text-slate-700">
                    {formatCreatedAt(dialog.position.createdAt)}
                  </dd>
                </div>
              </dl>
              <div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                <Dialog.Close className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">
                  Close
                </Dialog.Close>
              </div>
            </>
          ) : null}

          {dialog?.type === "create" || dialog?.type === "edit" ? (
            <>
              <div className="flex items-start gap-4 border-b border-slate-100 p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  {dialog.type === "create" ? <Plus className="size-5" /> : <Pencil className="size-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
                    {dialog.type === "create" ? "Add a position" : "Edit position"}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-500">
                    {dialog.type === "create"
                      ? "Enter the code and name for this position."
                      : `Update the details for ${dialog.position.positionName}.`}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close position form"
                  disabled={saving}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  <X className="size-4" />
                </Dialog.Close>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="position-code">Position code</Label>
                    <Input
                      id="position-code"
                      value={form.positionCode}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, positionCode: event.target.value }))
                      }
                      placeholder="e.g. ENG-01"
                      autoComplete="off"
                      required
                      disabled={!enabled || saving}
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position-name">Position name</Label>
                    <Input
                      id="position-name"
                      value={form.positionName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, positionName: event.target.value }))
                      }
                      placeholder="e.g. Software Engineer"
                      autoComplete="off"
                      required
                      disabled={!enabled || saving}
                      className="h-11 rounded-xl border-slate-200"
                    />
                  </div>
                  {error ? (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
                    >
                      <CircleAlert className="mt-0.5 size-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                  <Dialog.Close
                    disabled={saving}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    Cancel
                  </Dialog.Close>
                  <Button
                    type="submit"
                    disabled={!enabled || saving}
                    className="h-10 gap-2 rounded-xl bg-indigo-600 px-4 text-white hover:bg-indigo-700"
                  >
                    {saving ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : dialog.type === "create" ? (
                      <Plus className="size-4" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                    {saving ? "Saving..." : dialog.type === "create" ? "Create position" : "Save changes"}
                  </Button>
                </div>
              </form>
            </>
          ) : null}

          {dialog?.type === "delete" ? (
            <>
              <div className="flex items-start gap-4 p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <CircleAlert className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
                    Delete this position?
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm leading-6 text-slate-500">
                    This will permanently remove the position. This action cannot be undone.
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close delete confirmation"
                  disabled={deletingId !== null}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  <X className="size-4" />
                </Dialog.Close>
              </div>
              <div className="mx-6 mb-5 rounded-xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="font-semibold text-slate-900">{dialog.position.positionName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Position code: <span className="font-medium">{dialog.position.positionCode}</span>
                </p>
              </div>
              {error ? (
                <div
                  role="alert"
                  className="mx-6 mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              ) : null}
              <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                <Dialog.Close
                  disabled={deletingId !== null}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  Cancel
                </Dialog.Close>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void handleDelete()}
                  disabled={deletingId !== null}
                  className="h-10 gap-2 rounded-xl px-4"
                >
                  {deletingId !== null ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  {deletingId !== null ? "Deleting..." : "Delete position"}
                </Button>
              </div>
            </>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
