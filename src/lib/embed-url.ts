export type ParsedEmbed = {
  src: string;
  /** Shorter player (Spotify, SoundCloud, etc.) */
  compact?: boolean;
};

function extractIframeSrc(html: string): string | null {
  const m = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

/** Free embed sources only — no paid Adobe / 3D hosts. */
export function parseEmbedUrl(raw: string): ParsedEmbed | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fromIframe = extractIframeSrc(trimmed);
  if (fromIframe) return parseEmbedUrl(fromIframe);

  const yt = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]+)/i
  );
  if (yt) return { src: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo[1]}` };

  const loom = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  if (loom) return { src: `https://www.loom.com/embed/${loom[1]}` };

  const spotify = trimmed.match(
    /open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/i
  );
  if (spotify) {
    return {
      src: `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}?utm_source=generator`,
      compact: true,
    };
  }

  if (/soundcloud\.com\//i.test(trimmed) && !trimmed.includes("w.soundcloud.com")) {
    return {
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%230057ff`,
      compact: true,
    };
  }

  const codepen = trimmed.match(/codepen\.io\/([^/]+)\/(?:pen|details)\/([^/?#]+)/i);
  if (codepen) {
    return { src: `https://codepen.io/${codepen[1]}/embed/${codepen[2]}?default-tab=result`, compact: true };
  }

  if (/figma\.com\/(file|design|proto)\//i.test(trimmed)) {
    return {
      src: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(trimmed.split("?")[0])}`,
    };
  }

  const dailymotion = trimmed.match(/dailymotion\.com\/video\/([^_/?#]+)/i);
  if (dailymotion) return { src: `https://www.dailymotion.com/embed/video/${dailymotion[1]}` };

  const tiktok = trimmed.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/i);
  if (tiktok) return { src: `https://www.tiktok.com/embed/v2/${tiktok[1]}` };

  if (/vm\.tiktok\.com\//i.test(trimmed)) {
    return { src: trimmed, compact: true };
  }

  if (/^https?:\/\//i.test(trimmed) && (trimmed.includes("embed") || trimmed.includes("player"))) {
    const compact =
      /spotify\.com|soundcloud\.com|bandcamp\.com/i.test(trimmed) && !trimmed.includes("youtube");
    return { src: trimmed, compact };
  }

  return null;
}

export function getEmbedIframeSrc(url: string): string | null {
  return parseEmbedUrl(url)?.src ?? null;
}

export function isCompactEmbed(url: string): boolean {
  return parseEmbedUrl(url)?.compact === true;
}
