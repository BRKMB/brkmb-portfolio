import type { DesignBlockType } from "@/types/design-blocks";
import type { IconType } from "react-icons";
import {
  HiPhoto,
  HiDocumentText,
  HiSquares2X2,
  HiPlayCircle,
  HiCodeBracket,
  HiViewColumns,
  HiArrowsUpDown,
} from "react-icons/hi2";

export type StudioTile = {
  id: string;
  type: DesignBlockType;
  label: string;
  subtitle?: string;
  icon: IconType;
};

/** Free blocks only — Behance paid integrations (Lightroom, 3D, etc.) are intentionally omitted. */
export const STUDIO_TILES: StudioTile[] = [
  { id: "image", type: "image", label: "Image", icon: HiPhoto },
  { id: "text", type: "text", label: "Text", icon: HiDocumentText },
  { id: "grid", type: "grid", label: "Photo grid", icon: HiSquares2X2 },
  { id: "embed-video", type: "embed", label: "Video & audio", icon: HiPlayCircle },
  { id: "embed-code", type: "embed", label: "Embed", icon: HiCodeBracket },
  { id: "split", type: "split", label: "Two columns", subtitle: "Text + image", icon: HiViewColumns },
  { id: "spacer", type: "spacer", label: "Spacer", icon: HiArrowsUpDown },
];

export const BLOCK_TYPE_LABELS: Record<DesignBlockType, string> = {
  image: "Image",
  text: "Text",
  grid: "Photo grid",
  split: "Two columns",
  embed: "Embed",
  spacer: "Spacer",
};
