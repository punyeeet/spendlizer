import { Tag } from "@/archetypes/Transaction"
import { memo } from "react"

interface TagProps {
    tag: Tag
}
const TagComponent = ({ tag }: TagProps) => {

    return (

        <div className="h-7 border border-slate-400 rounded-lg inline-flex flex-row px-2 m-1 shadow-lg">
            <div className=" h-4 w-4 rounded-full border self-center mr-1" style={{
                backgroundColor: tag.color,
            }} />

            <span>{tag.tag}</span>

        </div>

    )
}

export const TagUI = memo(TagComponent);