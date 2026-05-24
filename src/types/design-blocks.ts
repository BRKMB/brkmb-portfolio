export type DesignBlockType = "image" | "text" | "split" | "embed" | "spacer";

export type TextAlign = "left" | "center" | "right";
export type TextSize = "sm" | "md" | "lg";

export interface DesignBlockBase {
  id: string;
  type: DesignBlockType;
  hidden?: boolean;
}

export interface DesignImageBlock extends DesignBlockBase {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
}

export interface DesignTextBlock extends DesignBlockBase {
  type: "text";
  content: string;
  align?: TextAlign;
  color?: string;
  fontSize?: TextSize;
}

export interface DesignSplitBlock extends DesignBlockBase {
  type: "split";
  /** text-left = copy on left, image on right */
  layout: "text-left" | "text-right";
  text: string;
  textColor?: string;
  textAlign?: TextAlign;
  image: string;
  alt?: string;
}

export interface DesignEmbedBlock extends DesignBlockBase {
  type: "embed";
  url: string;
  caption?: string;
}

export interface DesignSpacerBlock extends DesignBlockBase {
  type: "spacer";
  size?: "sm" | "md" | "lg";
}

export type DesignBlock =
  | DesignImageBlock
  | DesignTextBlock
  | DesignSplitBlock
  | DesignEmbedBlock
  | DesignSpacerBlock;
