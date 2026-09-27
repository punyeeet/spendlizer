import { Tag } from "@/archetypes/Transaction";
import { memo } from "react";

interface TagProps {
  tag: Tag;
}

const TagComponent = ({ tag }: TagProps) => {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-100 transition-colors m-0.5"
    >
      <span
        className="h-2 w-2 rounded-full ring-1 ring-black/10 shrink-0"
        style={{ backgroundColor: tag.color || '#6366f1' }}
      />
      <span className="truncate max-w-[120px]">{tag.tag}</span>
    </span>
  );
};

export const TagUI = memo(TagComponent);
export default TagUI;
