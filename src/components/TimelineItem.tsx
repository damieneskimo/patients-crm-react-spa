import { FC } from "react";

export interface ITimelineItem {
  time?: string,
  content: string,
}

const TimelineItem: FC<ITimelineItem> = (props) => {
  return (
    <li>
        <div className="flex items-center">
            <div className="border-r-2 border-green-400 py-8 px-4 h-full w-1/4 relative flex items-center justify-end">
                <p className="mr-5">{ props.time }</p>
                <div className="bg-green-500 rounded-full h-8 w-8 absolute -right-4"></div>
            </div>
            <div className="text-left w-3/4 ml-10">
                { props.content }
            </div>
        </div>
    </li>
  )
}

export default TimelineItem
