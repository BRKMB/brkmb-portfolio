"use client";

import { useCallback, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiEye,
  HiEyeSlash,
  HiTrash,
} from "react-icons/hi2";
import type { PortfolioItem } from "@/types";
import type { DesignBlock, DesignBlockType } from "@/types/design-blocks";
import { DesignBlockEditor, BLOCK_TYPE_LABELS } from "@/components/admin/design/DesignBlockEditor";
import {
  COVER_RATIO_LABEL,
  COVER_SIZE_HINT,
  THUMB_RATIO_LABEL,
  THUMB_SIZE_HINT,
  createBlock,
  readImageFile,
} from "@/lib/portfolio-blocks";
import { reorderList } from "@/lib/link-groups-order";
import { cn } from "@/lib/utils";

type Props = {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
};

function IconBtn({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cn("admin-icon-btn", className)}>
      {children}
    </button>
  );
}

export function DesignPortfolioAdmin({ items, onChange }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [dragProjectId, setDragProjectId] = useState<string | null>(null);
  const [dragBlock, setDragBlock] = useState<{ projectId: string; blockId: string } | null>(null);

  const patchItems = useCallback((next: PortfolioItem[]) => onChange(next), [onChange]);

  const patchItem = (idx: number, patch: Partial<PortfolioItem>) => {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    patchItems(next);
  };

  const patchBlock = (pIdx: number, bIdx: number, block: DesignBlock) => {
    const next = [...items];
    const blocks = [...(next[pIdx].blocks ?? [])];
    blocks[bIdx] = block;
    next[pIdx] = { ...next[pIdx], blocks };
    patchItems(next);
  };

  const addProject = () => {
    const id = `item-${Date.now()}`;
    const slug = `work-${Date.now()}`;
    patchItems([
      ...items,
      {
        id,
        slug,
        title: "New project",
        category: "Brand identity",
        image: "/images/placeholders/gallery-1.svg",
        description: "",
        blocks: [],
      },
    ]);
    setExpanded((p) => ({ ...p, [id]: true }));
  };

  const deleteProject = (idx: number) => {
    const item = items[idx];
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;
    patchItems(items.filter((_, i) => i !== idx));
  };

  const addBlock = (pIdx: number, type: DesignBlockType) => {
    const next = [...items];
    next[pIdx] = {
      ...next[pIdx],
      blocks: [...(next[pIdx].blocks ?? []), createBlock(type)],
    };
    patchItems(next);
  };

  const deleteBlock = (pIdx: number, bIdx: number) => {
    const block = items[pIdx].blocks?.[bIdx];
    if (block && !window.confirm(`Delete this ${BLOCK_TYPE_LABELS[block.type]} block?`)) return;
    const next = [...items];
    next[pIdx] = {
      ...next[pIdx],
      blocks: (next[pIdx].blocks ?? []).filter((_, i) => i !== bIdx),
    };
    patchItems(next);
  };

  const moveBlock = (pIdx: number, from: number, to: number) => {
    const next = [...items];
    next[pIdx] = {
      ...next[pIdx],
      blocks: reorderList(next[pIdx].blocks ?? [], from, to),
    };
    patchItems(next);
  };

  const onBlockDrop = (projectId: string, targetBlockId: string) => {
    if (!dragBlock || dragBlock.projectId !== projectId) return;
    const pIdx = items.findIndex((p) => p.id === projectId);
    if (pIdx < 0) return;
    const blocks = items[pIdx].blocks ?? [];
    const from = blocks.findIndex((b) => b.id === dragBlock.blockId);
    const to = blocks.findIndex((b) => b.id === targetBlockId);
    if (from < 0 || to < 0) return;
    moveBlock(pIdx, from, to);
    setDragBlock(null);
  };

  return (
    <div className="admin-design mt-8">
      <div className="glass-card flex flex-wrap items-center gap-2 p-4">
        <button type="button" className="btn-primary text-subheadline px-4 py-2" onClick={addProject}>
          + New Behance project
        </button>
        <Link href="/design/" className="chip-glass text-subheadline px-4 py-2">
          Preview grid
        </Link>
        <p className="text-footnote ml-auto v-tertiary">
          Thumbnail {THUMB_RATIO_LABEL} · Cover {COVER_RATIO_LABEL} · drag blocks to reorder
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, pIdx) => {
          const isOpen = expanded[item.id] !== false;
          const hidden = item.hidden === true;
          const blocks = item.blocks ?? [];

          return (
            <article
              key={item.id}
              className={cn("glass-card overflow-hidden", hidden && "opacity-60")}
            >
              <header className="flex items-center gap-2 border-b border-white/8 p-3">
                <button
                  type="button"
                  className="admin-drag-handle"
                  draggable
                  aria-label="Reorder project"
                  onDragStart={() => setDragProjectId(item.id)}
                  onDragEnd={() => setDragProjectId(null)}
                >
                  <HiBars3 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setExpanded((p) => ({ ...p, [item.id]: !isOpen }))}
                >
                  <HiChevronDown className={cn("h-4 w-4 shrink-0 transition", isOpen && "rotate-180")} />
                  <span className="relative h-10 w-[53px] shrink-0 overflow-hidden rounded bg-black/30">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized={item.image.startsWith("data:")}
                      />
                    ) : null}
                    <span className="admin-thumb-ratio-badge">{THUMB_RATIO_LABEL}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="text-subheadline block font-medium v-primary">{item.title}</span>
                    <span className="text-caption block truncate v-tertiary">
                      /design/{item.slug}/ · {blocks.length} blocks
                    </span>
                  </span>
                </button>
                <IconBtn
                  label={hidden ? "Show on site" : "Hide on site"}
                  onClick={() => patchItem(pIdx, { hidden: !hidden })}
                  className={hidden ? "admin-icon-btn--active" : undefined}
                >
                  {hidden ? <HiEyeSlash className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                </IconBtn>
                <IconBtn
                  label="Move up"
                  onClick={() => pIdx > 0 && patchItems(reorderList(items, pIdx, pIdx - 1))}
                  className={pIdx === 0 ? "pointer-events-none opacity-30" : undefined}
                >
                  <HiChevronUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="Move down"
                  onClick={() => pIdx < items.length - 1 && patchItems(reorderList(items, pIdx, pIdx + 1))}
                  className={pIdx === items.length - 1 ? "pointer-events-none opacity-30" : undefined}
                >
                  <HiChevronDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="Delete project" onClick={() => deleteProject(pIdx)} className="admin-icon-btn--danger">
                  <HiTrash className="h-4 w-4" />
                </IconBtn>
              </header>

              {isOpen ? (
                <div className="space-y-6 p-4 md:p-5">
                  <section className="grid gap-4 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="text-caption mb-1 block v-tertiary">Project title</span>
                      <input
                        className="admin-input w-full"
                        value={item.title}
                        onChange={(e) => patchItem(pIdx, { title: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">URL slug</span>
                      <input
                        className="admin-input w-full"
                        value={item.slug}
                        onChange={(e) => patchItem(pIdx, { slug: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">Category</span>
                      <input
                        className="admin-input w-full"
                        value={item.category}
                        onChange={(e) => patchItem(pIdx, { category: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">Year</span>
                      <input
                        className="admin-input w-full"
                        value={item.year ?? ""}
                        onChange={(e) => patchItem(pIdx, { year: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">Tools (comma separated)</span>
                      <input
                        className="admin-input w-full"
                        value={item.tools?.join(", ") ?? ""}
                        onChange={(e) =>
                          patchItem(pIdx, {
                            tools: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-caption mb-1 block v-tertiary">Short description (grid + header)</span>
                      <textarea
                        className="admin-input min-h-[72px] w-full"
                        value={item.description ?? ""}
                        onChange={(e) => patchItem(pIdx, { description: e.target.value })}
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-caption mb-1 block v-tertiary">Role</span>
                      <input
                        className="admin-input w-full"
                        value={item.role ?? ""}
                        onChange={(e) => patchItem(pIdx, { role: e.target.value })}
                      />
                    </label>
                  </section>

                  <section className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h3 className="text-subheadline font-medium v-primary">Thumbnail · {THUMB_RATIO_LABEL}</h3>
                      <p className="text-caption mt-1 v-tertiary">{THUMB_SIZE_HINT} — used on /design grid</p>
                      <div className="admin-thumb-frame mt-3">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized={item.image.startsWith("data:")}
                          />
                        ) : null}
                        <span className="admin-thumb-ratio-overlay">{THUMB_RATIO_LABEL}</span>
                      </div>
                      <input
                        className="admin-input mt-3 w-full"
                        value={item.image}
                        onChange={(e) => patchItem(pIdx, { image: e.target.value })}
                      />
                      <label className="mt-2 block">
                        <input
                          type="file"
                          accept="image/*"
                          className="text-footnote w-full"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            patchItem(pIdx, { image: await readImageFile(file) });
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-subheadline font-medium v-primary">Cover · {COVER_RATIO_LABEL}</h3>
                      <p className="text-caption mt-1 v-tertiary">{COVER_SIZE_HINT} — top of project page</p>
                      <p className="text-footnote mt-2 v-quaternary">
                        Uses the same image as thumbnail unless you add a full-width image block as the first
                        content block.
                      </p>
                    </div>
                  </section>

                  <section className="border-t border-white/8 pt-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-subheadline font-medium v-primary">Page content blocks</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(BLOCK_TYPE_LABELS) as DesignBlockType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            className="chip-glass text-caption px-3 py-1.5"
                            onClick={() => addBlock(pIdx, type)}
                          >
                            + {BLOCK_TYPE_LABELS[type]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {blocks.map((block, bIdx) => {
                        const blockHidden = block.hidden === true;
                        return (
                          <div
                            key={block.id}
                            className={cn(
                              "admin-links-row",
                              blockHidden && "admin-links-row--hidden",
                              dragBlock?.blockId === block.id && "admin-links-row--dragging"
                            )}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              onBlockDrop(item.id, block.id);
                            }}
                          >
                            <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-white/8 pb-3">
                              <button
                                type="button"
                                className="admin-drag-handle"
                                draggable
                                onDragStart={() => setDragBlock({ projectId: item.id, blockId: block.id })}
                                onDragEnd={() => setDragBlock(null)}
                              >
                                <HiBars3 className="h-4 w-4" />
                              </button>
                              <span className="text-caption text-accent">{BLOCK_TYPE_LABELS[block.type]}</span>
                              <div className="ml-auto flex gap-1">
                                <IconBtn
                                  label={blockHidden ? "Show block" : "Hide block"}
                                  onClick={() => patchBlock(pIdx, bIdx, { ...block, hidden: !blockHidden })}
                                  className={blockHidden ? "admin-icon-btn--active" : undefined}
                                >
                                  {blockHidden ? (
                                    <HiEyeSlash className="h-4 w-4" />
                                  ) : (
                                    <HiEye className="h-4 w-4" />
                                  )}
                                </IconBtn>
                                <IconBtn
                                  label="Move up"
                                  onClick={() => bIdx > 0 && moveBlock(pIdx, bIdx, bIdx - 1)}
                                  className={bIdx === 0 ? "pointer-events-none opacity-30" : undefined}
                                >
                                  <HiChevronUp className="h-3.5 w-3.5" />
                                </IconBtn>
                                <IconBtn
                                  label="Move down"
                                  onClick={() => bIdx < blocks.length - 1 && moveBlock(pIdx, bIdx, bIdx + 1)}
                                  className={
                                    bIdx === blocks.length - 1 ? "pointer-events-none opacity-30" : undefined
                                  }
                                >
                                  <HiChevronDown className="h-3.5 w-3.5" />
                                </IconBtn>
                                <IconBtn
                                  label="Delete block"
                                  onClick={() => deleteBlock(pIdx, bIdx)}
                                  className="admin-icon-btn--danger"
                                >
                                  <HiTrash className="h-4 w-4" />
                                </IconBtn>
                              </div>
                            </div>
                            <DesignBlockEditor
                              block={block}
                              onChange={(next) => patchBlock(pIdx, bIdx, next)}
                            />
                          </div>
                        );
                      })}
                      {blocks.length === 0 ? (
                        <p className="text-footnote rounded-xl border border-dashed border-white/15 p-6 text-center v-tertiary">
                          No blocks yet — add images, text columns, embeds, or split layouts above.
                        </p>
                      ) : null}
                    </div>
                  </section>

                  <Link
                    href={`/design/${item.slug}/`}
                    className="text-subheadline inline-flex text-accent hover:opacity-80"
                  >
                    Open project page preview →
                  </Link>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
