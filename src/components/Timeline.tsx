import classNames from "classnames";
import { FC } from "react"
import TimelineItem, { ITimelineItem } from "./TimelineItem";

export interface ITimeline {
  className?: 'string',
  data: ITimelineItem[],
}

const Timeline: FC<ITimeline> = (props: ITimeline) => {
  return (
    <div className={ classNames("w-full px-20 py-8 bg-gray-200 overflow-hidden", props.className) }>
      <ul className="list-none">
        {
          props.data.map((item) => {
            return (
              <TimelineItem time={item.time} content={item.content} />
            )
          })
        }
      </ul>
    </div>
  )
}

export default Timeline;
