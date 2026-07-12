import Image from "next/image";
import type { LinkGroup } from "@/types";
import { getLinkGroupLogo } from "@/lib/link-group-logo";
import { cn } from "@/lib/utils";

export function LinkGroupLogo({ group }: { group: LinkGroup }) {
  const logo = getLinkGroupLogo(group);

  if (logo.kind === "letter") {
    return (
      <span className="link-group-logo link-group-logo--letter" aria-hidden>
        <span className="font-display text-title-3">{logo.letter}</span>
      </span>
    );
  }

  return (
    <span className="link-group-logo" aria-hidden>
      <Image
        src={logo.src}
        alt=""
        width={40}
        height={40}
        className={cn(
          "link-group-logo__img",
          logo.invert && "link-group-logo__img--invert"
        )}
      />
    </span>
  );
}
