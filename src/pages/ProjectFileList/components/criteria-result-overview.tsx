import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Badge, Space } from "antd";
import { FC, ReactNode } from "react";
export interface CriteriaResultOverviewProps {
  children?: ReactNode;
}
const CriteriaResultOverview: FC<CriteriaResultOverviewProps> = ({
  children,
}) => {
  const color = {
    Affirmative: "green",
    Negative: "red",
    Uncertain: "yellow",
    NA: "gray",
  };
  return (
    <Popover placement="bottom">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-large font-semibold text-center mb-2">
            Criteria Result Overview
          </div>
          <Space className="mb-2">
            <div className="flex gap-1 items-center">
              <div className="bg-red-500 h-3 w-3 rounded-full" />
              Affirmative
            </div>
            <div className="flex gap-1 items-center">
              <div className="bg-green-500 h-3 w-3 rounded-full" />
              Negative
            </div>
            <div className="flex gap-1 items-center">
              <div className="bg-yellow-500 h-3 w-3 rounded-full" />
              Uncertain
            </div>
            <div className="flex gap-1 items-center">
              <div className="bg-gray-500 h-3 w-3 rounded-full" />
              NA
            </div>
          </Space>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CriteriaResultOverview;
