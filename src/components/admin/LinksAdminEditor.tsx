"use client";

import { useCallback, useState, type DragEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiEye,
  HiEyeSlash,
  HiTrash,
} from "react-icons/hi2";
import type { LinkGroup, LinkItem } from "@/types";
import { reorderList } from "@/lib/link-groups-order";
import { cn } from "@/lib/utils";

type Props = {
  groups: LinkGroup[];
  onChange: (groups: LinkGroup[]) => void;
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
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn("admin-icon-btn", className)}
    >
      {children}
    </button>
  );
}

export function LinksAdminEditor({ groups, onChange }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, true]))
  );
  const [dragGroupId, setDragGroupId] = useState<string | null>(null);
  const [dragLink, setDragLink] = useState<{ groupId: string; linkId: string } | null>(null);

  const setExpandedAll = (open: boolean) => {
    setExpanded(Object.fromEntries(groups.map((g) => [g.id, open])));
  };

  const patchGroups = useCallback(
    (next: LinkGroup[]) => onChange(next),
    [onChange]
  );

  const patchGroup = (gIdx: number, patch: Partial<LinkGroup>) => {
    const next = [...groups];
    next[gIdx] = { ...next[gIdx], ...patch };
    patchGroups(next);
  };

  const patchLink = (gIdx: number, lIdx: number, patch: Partial<LinkItem>) => {
    const next = [...groups];
    const links = [...next[gIdx].links];
    links[lIdx] = { ...links[lIdx], ...patch };
    next[gIdx] = { ...next[gIdx], links };
    patchGroups(next);
  };

  const moveGroup = (from: number, to: number) => {
    patchGroups(reorderList(groups, from, to));
  };

  const moveLink = (gIdx: number, from: number, to: number) => {
    const next = [...groups];
    next[gIdx] = {
      ...next[gIdx],
      links: reorderList(next[gIdx].links, from, to),
    };
    patchGroups(next);
  };

  const addGroup = () => {
    const id = `group-${Date.now()}`;
    patchGroups([
      ...groups,
      {
        id,
        title: "New group",
        subtitle: "",
        hidden: false,
        links: [],
      },
    ]);
    setExpanded((prev) => ({ ...prev, [id]: true }));
  };

  const addLink = (gIdx: number) => {
    const next = [...groups];
    next[gIdx] = {
      ...next[gIdx],
      links: [
        ...next[gIdx].links,
        {
          id: `link-${Date.now()}`,
          label: "New link",
          description: "",
          href: "https://",
          platform: "website",
          hidden: false,
        },
      ],
    };
    patchGroups(next);
  };

  const deleteGroup = (gIdx: number) => {
    const group = groups[gIdx];
    if (!window.confirm(`Delete "${group.title}" permanently?`)) return;
    patchGroups(groups.filter((_, i) => i !== gIdx));
  };

  const deleteLink = (gIdx: number, lIdx: number) => {
    const link = groups[gIdx].links[lIdx];
    if (!window.confirm(`Delete "${link.label}" permanently?`)) return;
    const next = [...groups];
    next[gIdx] = {
      ...next[gIdx],
      links: next[gIdx].links.filter((_, i) => i !== lIdx),
    };
    patchGroups(next);
  };

  const onGroupDrop = (targetId: string) => {
    if (!dragGroupId || dragGroupId === targetId) return;
    const from = groups.findIndex((g) => g.id === dragGroupId);
    const to = groups.findIndex((g) => g.id === targetId);
    if (from < 0 || to < 0) return;
    moveGroup(from, to);
    setDragGroupId(null);
  };

  const onLinkDrop = (groupId: string, targetLinkId: string) => {
    if (!dragLink || dragLink.groupId !== groupId) return;
    const gIdx = groups.findIndex((g) => g.id === groupId);
    if (gIdx < 0) return;
    const links = groups[gIdx].links;
    const from = links.findIndex((l) => l.id === dragLink.linkId);
    const to = links.findIndex((l) => l.id === targetLinkId);
    if (from < 0 || to < 0) return;
    moveLink(gIdx, from, to);
    setDragLink(null);
  };

  const visibleCount = groups.filter((g) => !g.hidden).length;
  const hiddenGroupCount = groups.length - visibleCount;

  return (
    <div className="admin-links mt-8">
      <div className="admin-links-toolbar glass-card flex flex-wrap items-center gap-2 p-4">
        <button type="button" className="btn-primary text-subheadline px-4 py-2" onClick={addGroup}>
          + New dropdown
        </button>
        <button type="button" className="chip-glass text-subheadline px-4 py-2" onClick={() => setExpandedAll(true)}>
          Expand all
        </button>
        <button type="button" className="chip-glass text-subheadline px-4 py-2" onClick={() => setExpandedAll(false)}>
          Collapse all
        </button>
        <Link href="/links/" className="chip-glass text-subheadline px-4 py-2">
          Preview /links
        </Link>
        <p className="text-footnote ml-auto v-tertiary">
          {visibleCount} visible · {hiddenGroupCount} hidden groups · drag ☰ to reorder
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {groups.map((group, gIdx) => {
          const isOpen = expanded[group.id] !== false;
          const groupHidden = group.hidden === true;

          return (
            <article
              key={group.id}
              className={cn(
                "admin-links-group glass-card overflow-hidden",
                groupHidden && "admin-links-group--hidden",
                dragGroupId === group.id && "admin-links-group--dragging"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                onGroupDrop(group.id);
              }}
            >
              <header className="admin-links-group__head flex items-center gap-2 border-b border-white/8 p-3">
                <button
                  type="button"
                  className="admin-drag-handle"
                  draggable
                  aria-label="Drag to reorder group"
                  onDragStart={(e: DragEvent) => {
                    setDragGroupId(group.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDragGroupId(null)}
                >
                  <HiBars3 className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  className="admin-links-group__toggle flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setExpanded((p) => ({ ...p, [group.id]: !isOpen }))}
                >
                  <HiChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                  />
                  <span className="min-w-0">
                    <span className="text-subheadline block font-medium v-primary">{group.title}</span>
                    <span className="text-caption block truncate v-tertiary">
                      {group.links.length} links
                      {groupHidden ? " · hidden on site" : " · live on site"}
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <IconBtn
                    label={groupHidden ? "Show group on site" : "Hide group on site"}
                    onClick={() => patchGroup(gIdx, { hidden: !groupHidden })}
                    className={groupHidden ? "admin-icon-btn--active" : undefined}
                  >
                    {groupHidden ? <HiEyeSlash className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                  </IconBtn>
                  <IconBtn
                    label="Move group up"
                    onClick={() => gIdx > 0 && moveGroup(gIdx, gIdx - 1)}
                    className={gIdx === 0 ? "opacity-30 pointer-events-none" : undefined}
                  >
                    <HiChevronUp className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    label="Move group down"
                    onClick={() => gIdx < groups.length - 1 && moveGroup(gIdx, gIdx + 1)}
                    className={gIdx === groups.length - 1 ? "opacity-30 pointer-events-none" : undefined}
                  >
                    <HiChevronDown className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    label="Delete group permanently"
                    onClick={() => deleteGroup(gIdx)}
                    className="admin-icon-btn--danger"
                  >
                    <HiTrash className="h-4 w-4" />
                  </IconBtn>
                </div>
              </header>

              {isOpen ? (
                <div className="space-y-4 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">Title</span>
                      <input
                        className="admin-input w-full"
                        value={group.title}
                        onChange={(e) => patchGroup(gIdx, { title: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">Subtitle</span>
                      <input
                        className="admin-input w-full"
                        value={group.subtitle ?? ""}
                        onChange={(e) => patchGroup(gIdx, { subtitle: e.target.value })}
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-caption mb-1 block v-tertiary">Logo path (optional)</span>
                      <input
                        className="admin-input w-full"
                        value={group.logoImage ?? ""}
                        onChange={(e) => patchGroup(gIdx, { logoImage: e.target.value || undefined })}
                        placeholder="/images/projects/..."
                      />
                    </label>
                    <label className="block">
                      <span className="text-caption mb-1 block v-tertiary">Accent color</span>
                      <input
                        className="admin-input w-full"
                        value={group.accent ?? ""}
                        onChange={(e) => patchGroup(gIdx, { accent: e.target.value || undefined })}
                        placeholder="#c9f31d"
                      />
                    </label>
                  </div>

                  <div className="space-y-2 border-t border-white/8 pt-4">
                    <p className="text-caption v-tertiary uppercase tracking-wide">Links in this dropdown</p>

                    {group.links.map((link, lIdx) => {
                      const linkHidden = link.hidden === true;
                      return (
                        <div
                          key={link.id}
                          className={cn(
                            "admin-links-row",
                            linkHidden && "admin-links-row--hidden",
                            dragLink?.linkId === link.id && "admin-links-row--dragging"
                          )}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onLinkDrop(group.id, link.id);
                          }}
                        >
                          <div className="admin-links-row__tools">
                            <button
                              type="button"
                              className="admin-drag-handle"
                              draggable
                              aria-label="Drag to reorder link"
                              onDragStart={(e: DragEvent) => {
                                setDragLink({ groupId: group.id, linkId: link.id });
                                e.dataTransfer.effectAllowed = "move";
                                e.stopPropagation();
                              }}
                              onDragEnd={() => setDragLink(null)}
                            >
                              <HiBars3 className="h-4 w-4" />
                            </button>
                            <IconBtn
                              label={linkHidden ? "Show link on site" : "Hide link on site"}
                              onClick={() => patchLink(gIdx, lIdx, { hidden: !linkHidden })}
                              className={linkHidden ? "admin-icon-btn--active" : undefined}
                            >
                              {linkHidden ? (
                                <HiEyeSlash className="h-4 w-4" />
                              ) : (
                                <HiEye className="h-4 w-4" />
                              )}
                            </IconBtn>
                            <IconBtn
                              label="Move link up"
                              onClick={() => lIdx > 0 && moveLink(gIdx, lIdx, lIdx - 1)}
                              className={lIdx === 0 ? "opacity-30 pointer-events-none" : undefined}
                            >
                              <HiChevronUp className="h-3.5 w-3.5" />
                            </IconBtn>
                            <IconBtn
                              label="Move link down"
                              onClick={() =>
                                lIdx < group.links.length - 1 && moveLink(gIdx, lIdx, lIdx + 1)
                              }
                              className={
                                lIdx === group.links.length - 1 ? "opacity-30 pointer-events-none" : undefined
                              }
                            >
                              <HiChevronDown className="h-3.5 w-3.5" />
                            </IconBtn>
                            <IconBtn
                              label="Delete link permanently"
                              onClick={() => deleteLink(gIdx, lIdx)}
                              className="admin-icon-btn--danger"
                            >
                              <HiTrash className="h-4 w-4" />
                            </IconBtn>
                          </div>

                          <div className="admin-links-row__fields grid gap-2 sm:grid-cols-2">
                            <input
                              className="admin-input w-full"
                              value={link.label}
                              placeholder="Label"
                              onChange={(e) => patchLink(gIdx, lIdx, { label: e.target.value })}
                            />
                            <input
                              className="admin-input w-full"
                              value={link.platform}
                              placeholder="Platform (instagram, website…)"
                              onChange={(e) => patchLink(gIdx, lIdx, { platform: e.target.value })}
                            />
                            <input
                              className="admin-input w-full sm:col-span-2"
                              value={link.href}
                              placeholder="URL"
                              onChange={(e) => patchLink(gIdx, lIdx, { href: e.target.value })}
                            />
                            <input
                              className="admin-input w-full sm:col-span-2"
                              value={link.description}
                              placeholder="Description"
                              onChange={(e) => patchLink(gIdx, lIdx, { description: e.target.value })}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className="chip-glass text-subheadline mt-2 w-full px-4 py-2.5"
                      onClick={() => addLink(gIdx)}
                    >
                      + Add link to {group.title}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
