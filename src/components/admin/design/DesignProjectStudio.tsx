"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiArrowLeft,
  HiBars3,
  HiChevronDown,
  HiChevronUp,
  HiCog6Tooth,
  HiEye,
  HiEyeSlash,
  HiPaperClip,
  HiPlus,
  HiSwatch,
  HiTrash,
  HiXMark,
} from "react-icons/hi2";
import type { PortfolioItem } from "@/types";
import type { DesignBlock, DesignBlockType } from "@/types/design-blocks";
import { DesignBlockEditor } from "@/components/admin/design/DesignBlockEditor";
import { DesignBlocksRenderer } from "@/components/design/DesignBlocksRenderer";
import { BLOCK_TYPE_LABELS, STUDIO_TILES } from "@/lib/design-studio-tiles";
import {
  COVER_RATIO_LABEL,
  COVER_SIZE_HINT,
  THUMB_RATIO_LABEL,
  THUMB_SIZE_HINT,
  createBlock,
  readImageFile,
} from "@/lib/portfolio-blocks";
import { NEW_PROJECT_SLUG } from "@/lib/design-admin";
import { reorderList } from "@/lib/link-groups-order";
import { cn } from "@/lib/utils";

type SidebarPanel = "settings" | "styles" | "custom" | "assets" | null;

type Props = {
  item: PortfolioItem;
  projectIndex: number;
  onChange: (item: PortfolioItem) => void;
  onClose: () => void;
  onDelete: () => void;
};

function StudioTileButton({
  label,
  subtitle,
  icon: Icon,
  onClick,
}: {
  label: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="behance-studio-tile group"
      title={label}
    >
      <span className="behance-studio-tile__icon">
        <Icon className="h-6 w-6" />
      </span>
      <span className="behance-studio-tile__label">{label}</span>
      {subtitle ? <span className="behance-studio-tile__sub">{subtitle}</span> : null}
    </button>
  );
}

export function DesignProjectStudio({ item, onChange, onClose, onDelete }: Props) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [sidebarPanel, setSidebarPanel] = useState<SidebarPanel>(null);
  const [dragBlockId, setDragBlockId] = useState<string | null>(null);

  const openPanel = (panel: SidebarPanel) => {
    setSidebarPanel(panel);
    setSelectedBlockId(null);
  };

  const blocks = item.blocks ?? [];
  const selectedIdx = selectedBlockId ? blocks.findIndex((b) => b.id === selectedBlockId) : -1;
  const selectedBlock = selectedIdx >= 0 ? blocks[selectedIdx] : null;

  const patch = useCallback(
    (patch: Partial<PortfolioItem>) => onChange({ ...item, ...patch }),
    [item, onChange]
  );

  const patchBlocks = useCallback(
    (next: DesignBlock[]) => patch({ blocks: next }),
    [patch]
  );

  const addBlock = (type: DesignBlockType) => {
    const block = createBlock(type);
    patchBlocks([...blocks, block]);
    setSelectedBlockId(block.id);
    setSidebarPanel(null);
  };

  const updateBlock = (idx: number, block: DesignBlock) => {
    const next = [...blocks];
    next[idx] = block;
    patchBlocks(next);
  };

  const deleteBlock = (idx: number) => {
    const block = blocks[idx];
    if (block && !window.confirm(`Delete this ${BLOCK_TYPE_LABELS[block.type]} block?`)) return;
    const next = blocks.filter((_, i) => i !== idx);
    patchBlocks(next);
    if (selectedBlockId === block?.id) setSelectedBlockId(null);
  };

  const moveBlock = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    patchBlocks(reorderList(blocks, from, to));
  };

  const onBlockDrop = (targetId: string) => {
    if (!dragBlockId || dragBlockId === targetId) return;
    const from = blocks.findIndex((b) => b.id === dragBlockId);
    const to = blocks.findIndex((b) => b.id === targetId);
    if (from < 0 || to < 0) return;
    moveBlock(from, to);
    setDragBlockId(null);
  };

  const attachments = item.attachments ?? [];
  const cta = item.cta ?? { label: "", url: "" };
  const styles = item.styleDefaults ?? {};

  return (
    <div className="behance-studio behance-studio--page" aria-label="Design project editor">
      <header className="behance-studio__header">
        <Link href="/admin/design/" className="behance-studio__back" aria-label="All projects">
          <HiArrowLeft className="h-5 w-5" />
        </Link>
        <input
          className="behance-studio__title-input"
          value={item.title}
          onChange={(e) => patch({ title: e.target.value })}
          aria-label="Project title"
        />
        <div className="behance-studio__header-actions">
          {item.slug !== NEW_PROJECT_SLUG ? (
            <Link href={`/designs/${item.slug}/`} className="behance-studio__link-preview" target="_blank">
              Preview
            </Link>
          ) : null}
        </div>
      </header>

      <div className="behance-studio__layout">
        <main className="behance-studio__canvas">
          {blocks.length === 0 ? (
            <div className="behance-studio__empty">
              <h2 className="behance-studio__empty-title">Start building your project:</h2>
              <div className="behance-studio__empty-tiles">
                {STUDIO_TILES.map((tile, i) => (
                  <StudioTileButton
                    key={tile.id}
                    label={tile.label}
                    subtitle={tile.subtitle}
                    icon={tile.icon}
                    onClick={() => addBlock(tile.type)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="behance-studio-preview">
              <div className="behance-studio-preview__inner">
                {blocks.map((block, bIdx) => {
                  const isSelected = block.id === selectedBlockId;
                  const blockHidden = block.hidden === true;
                  return (
                    <div
                      key={block.id}
                      className={cn(
                        "behance-studio-block",
                        isSelected && "behance-studio-block--selected",
                        blockHidden && "behance-studio-block--hidden"
                      )}
                      onClick={() => {
                        setSelectedBlockId(block.id);
                        setSidebarPanel(null);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onBlockDrop(block.id);
                      }}
                    >
                      {isSelected ? (
                        <div className="behance-studio-block__toolbar" onClick={(e) => e.stopPropagation()}>
                          <span className="behance-studio-block__type">{BLOCK_TYPE_LABELS[block.type]}</span>
                          <button
                            type="button"
                            className="behance-studio-block__handle"
                            draggable
                            aria-label="Drag to reorder"
                            onDragStart={() => setDragBlockId(block.id)}
                            onDragEnd={() => setDragBlockId(null)}
                          >
                            <HiBars3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="behance-studio-block__tool"
                            aria-label={blockHidden ? "Show block" : "Hide block"}
                            onClick={() => updateBlock(bIdx, { ...block, hidden: !blockHidden })}
                          >
                            {blockHidden ? <HiEyeSlash className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            className="behance-studio-block__tool"
                            aria-label="Move up"
                            disabled={bIdx === 0}
                            onClick={() => moveBlock(bIdx, bIdx - 1)}
                          >
                            <HiChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="behance-studio-block__tool"
                            aria-label="Move down"
                            disabled={bIdx === blocks.length - 1}
                            onClick={() => moveBlock(bIdx, bIdx + 1)}
                          >
                            <HiChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="behance-studio-block__tool behance-studio-block__tool--danger"
                            aria-label="Delete block"
                            onClick={() => deleteBlock(bIdx)}
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null}
                      <DesignBlocksRenderer blocks={[block]} mode="studio" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <aside className="behance-studio__sidebar">
          {sidebarPanel === "settings" ? (
            <div className="behance-studio-panel">
              <div className="behance-studio-panel__head">
                <h3 className="behance-studio-panel__title">Settings</h3>
                <button
                  type="button"
                  className="behance-studio-panel__close"
                  onClick={() => setSidebarPanel(null)}
                  aria-label="Close settings"
                >
                  <HiXMark className="h-4 w-4" />
                </button>
              </div>
              <div className="behance-studio-panel__body behance-studio-settings">
                <label className="behance-studio-field">
                  <span>Title</span>
                  <input value={item.title} onChange={(e) => patch({ title: e.target.value })} />
                </label>
                <label className="behance-studio-field">
                  <span>URL slug</span>
                  <input value={item.slug} onChange={(e) => patch({ slug: e.target.value })} />
                </label>
                <label className="behance-studio-field">
                  <span>Category</span>
                  <input value={item.category} onChange={(e) => patch({ category: e.target.value })} />
                </label>
                <label className="behance-studio-field">
                  <span>Year</span>
                  <input value={item.year ?? ""} onChange={(e) => patch({ year: e.target.value })} />
                </label>
                <label className="behance-studio-field">
                  <span>Tools (comma separated)</span>
                  <input
                    value={item.tools?.join(", ") ?? ""}
                    onChange={(e) =>
                      patch({
                        tools: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
                <label className="behance-studio-field">
                  <span>Short description</span>
                  <textarea
                    rows={3}
                    value={item.description ?? ""}
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </label>
                <label className="behance-studio-field">
                  <span>Role</span>
                  <input value={item.role ?? ""} onChange={(e) => patch({ role: e.target.value })} />
                </label>
                <div className="behance-studio-thumb">
                  <p className="behance-studio-thumb__label">
                    Thumbnail · {THUMB_RATIO_LABEL}
                  </p>
                  <p className="behance-studio-thumb__hint">{THUMB_SIZE_HINT}</p>
                  <div className="behance-studio-thumb__frame">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized={item.image.startsWith("data:")}
                      />
                    ) : null}
                    <span className="behance-studio-thumb__badge">{THUMB_RATIO_LABEL}</span>
                  </div>
                  <input
                    value={item.image}
                    onChange={(e) => patch({ image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <label className="behance-studio-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        patch({ image: await readImageFile(file) });
                      }}
                    />
                    Upload thumbnail
                  </label>
                </div>
                <p className="behance-studio-cover-hint">
                  Cover · {COVER_RATIO_LABEL} — {COVER_SIZE_HINT}. Add a full-width image block at the top
                  of the canvas for a hero cover.
                </p>
                <label className="behance-studio-field behance-studio-field--row">
                  <input
                    type="checkbox"
                    checked={item.hidden === true}
                    onChange={(e) => patch({ hidden: e.target.checked })}
                  />
                  <span>Hide project on site</span>
                </label>
                <button type="button" className="behance-studio-danger" onClick={onDelete}>
                  Delete project
                </button>
              </div>
            </div>
          ) : sidebarPanel === "styles" ? (
            <div className="behance-studio-panel">
              <div className="behance-studio-panel__head">
                <h3 className="behance-studio-panel__title">Styles</h3>
                <button
                  type="button"
                  className="behance-studio-panel__close"
                  onClick={() => setSidebarPanel(null)}
                  aria-label="Close styles"
                >
                  <HiXMark className="h-4 w-4" />
                </button>
              </div>
              <div className="behance-studio-panel__body behance-studio-settings">
                <p className="behance-studio-panel__hint">
                  Defaults for new text blocks. You can still change each block individually.
                </p>
                <label className="behance-studio-field">
                  <span>Default text color</span>
                  <input
                    type="color"
                    value={
                      styles.textColor?.startsWith("#")
                        ? styles.textColor
                        : "#ffffff"
                    }
                    onChange={(e) =>
                      patch({
                        styleDefaults: { ...styles, textColor: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="behance-studio-field">
                  <span>Page background</span>
                  <input
                    type="color"
                    value={
                      styles.pageBackground?.startsWith("#")
                        ? styles.pageBackground
                        : "#0a0a0a"
                    }
                    onChange={(e) =>
                      patch({
                        styleDefaults: { ...styles, pageBackground: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
            </div>
          ) : sidebarPanel === "custom" ? (
            <div className="behance-studio-panel">
              <div className="behance-studio-panel__head">
                <h3 className="behance-studio-panel__title">Custom button</h3>
                <button
                  type="button"
                  className="behance-studio-panel__close"
                  onClick={() => setSidebarPanel(null)}
                  aria-label="Close"
                >
                  <HiXMark className="h-4 w-4" />
                </button>
              </div>
              <div className="behance-studio-panel__body behance-studio-settings">
                <p className="behance-studio-panel__hint">
                  Customize the call to action on your project page.
                </p>
                <label className="behance-studio-field">
                  <span>Button label</span>
                  <input
                    value={cta.label}
                    placeholder="View case study"
                    onChange={(e) => patch({ cta: { ...cta, label: e.target.value } })}
                  />
                </label>
                <label className="behance-studio-field">
                  <span>Button URL</span>
                  <input
                    value={cta.url}
                    placeholder="https://…"
                    onChange={(e) => patch({ cta: { ...cta, url: e.target.value } })}
                  />
                </label>
              </div>
            </div>
          ) : sidebarPanel === "assets" ? (
            <div className="behance-studio-panel">
              <div className="behance-studio-panel__head">
                <h3 className="behance-studio-panel__title">Attach assets</h3>
                <button
                  type="button"
                  className="behance-studio-panel__close"
                  onClick={() => setSidebarPanel(null)}
                  aria-label="Close"
                >
                  <HiXMark className="h-4 w-4" />
                </button>
              </div>
              <div className="behance-studio-panel__body behance-studio-settings">
                <p className="behance-studio-panel__hint">
                  Add free downloads (fonts, zips, PDFs) via public URLs. Paid downloads are not
                  supported.
                </p>
                {attachments.map((file, i) => (
                  <div key={i} className="behance-studio-asset-row">
                    <input
                      placeholder="File name"
                      value={file.name}
                      onChange={(e) => {
                        const next = [...attachments];
                        next[i] = { ...file, name: e.target.value };
                        patch({ attachments: next });
                      }}
                    />
                    <input
                      placeholder="https://…"
                      value={file.url}
                      onChange={(e) => {
                        const next = [...attachments];
                        next[i] = { ...file, url: e.target.value };
                        patch({ attachments: next });
                      }}
                    />
                    <button
                      type="button"
                      className="behance-studio-asset-remove"
                      aria-label="Remove file"
                      onClick={() =>
                        patch({ attachments: attachments.filter((_, j) => j !== i) })
                      }
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="behance-studio-asset-add"
                  onClick={() =>
                    patch({ attachments: [...attachments, { name: "", url: "" }] })
                  }
                >
                  <HiPlus className="h-4 w-4" />
                  Add file
                </button>
              </div>
            </div>
          ) : selectedBlock ? (
            <div className="behance-studio-panel">
              <div className="behance-studio-panel__head">
                <h3 className="behance-studio-panel__title">{BLOCK_TYPE_LABELS[selectedBlock.type]}</h3>
                <button
                  type="button"
                  className="behance-studio-panel__close"
                  onClick={() => setSelectedBlockId(null)}
                  aria-label="Deselect block"
                >
                  <HiXMark className="h-4 w-4" />
                </button>
              </div>
              <div className="behance-studio-panel__body behance-studio-block-editor">
                <DesignBlockEditor
                  block={selectedBlock}
                  onChange={(next) => updateBlock(selectedIdx, next)}
                />
              </div>
            </div>
          ) : null}

          <section className="behance-studio-sidebar-section">
            <h3 className="behance-studio-sidebar-section__title">Add content</h3>
            <div className="behance-studio-sidebar-grid">
              {STUDIO_TILES.map((tile, i) => (
                <button
                  key={`side-${tile.id}`}
                  type="button"
                  className="behance-studio-sidebar-btn"
                  onClick={() => addBlock(tile.type)}
                >
                  <tile.icon className="h-5 w-5" />
                  <span>{tile.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="behance-studio-sidebar-section behance-studio-sidebar-section--compact">
            <h3 className="behance-studio-sidebar-section__title">Edit project</h3>
            <div className="behance-studio-edit-row">
              <button
                type="button"
                className={cn(
                  "behance-studio-edit-btn",
                  sidebarPanel === "styles" && "behance-studio-edit-btn--active"
                )}
                onClick={() => openPanel("styles")}
              >
                <HiSwatch className="h-5 w-5" />
                Styles
              </button>
              <button
                type="button"
                className={cn(
                  "behance-studio-edit-btn",
                  sidebarPanel === "settings" && "behance-studio-edit-btn--active"
                )}
                onClick={() => openPanel("settings")}
              >
                <HiCog6Tooth className="h-5 w-5" />
                Settings
              </button>
            </div>
          </section>

          <section className="behance-studio-sidebar-section behance-studio-sidebar-section--compact">
            <button
              type="button"
              className={cn(
                "behance-studio-sideblock",
                sidebarPanel === "custom" && "behance-studio-sideblock--active"
              )}
              onClick={() => openPanel("custom")}
            >
              <span className="behance-studio-sideblock__title">Custom button</span>
              <span className="behance-studio-sideblock__hint">
                Customize the call to action on your project.
              </span>
            </button>
          </section>

          <section className="behance-studio-sidebar-section behance-studio-sidebar-section--compact">
            <button
              type="button"
              className={cn(
                "behance-studio-sideblock behance-studio-sideblock--with-icon",
                sidebarPanel === "assets" && "behance-studio-sideblock--active"
              )}
              onClick={() => openPanel("assets")}
            >
              <HiPaperClip className="h-5 w-5 shrink-0 text-[#0057ff]" />
              <span>
                <span className="behance-studio-sideblock__title">Attach assets</span>
                <span className="behance-studio-sideblock__hint">
                  Free downloads only — fonts, zips, PDFs via URL.
                </span>
              </span>
            </button>
          </section>

          <footer className="behance-studio__footer">
            <button type="button" className="behance-studio-continue" onClick={onClose}>
              Continue
            </button>
          </footer>
        </aside>
      </div>
    </div>
  );
}
