import { SolarCloseCircleBold } from "@/assets/icon";
import { Button, Card, CardBody, Tooltip } from "@nextui-org/react";
import React, { FC } from "react";
export type FileItem = {
  title: string;
};
export interface FileItemProps {
  data: FileItem;
  index: number;
}
const FileItem: FC<FileItemProps> = ({ data, index }) => {
  return (
    <Card className="flex-1 border border-zinc-300" radius="sm" shadow="none">
      <CardBody>
        <div className="text-medium font-semibold">Paper {index + 1}</div>
        <Button
          className="absolute top-0 right-0"
          isIconOnly
          size="sm"
          radius="sm"
          color="danger"
          variant="light"
        >
          <SolarCloseCircleBold className="text-lg " />
        </Button>
        {/* <Tooltip content={data.title}> */}
        <div title={data.title} className="text-small file-item-title">
          {data.title}
        </div>
        {/* </Tooltip> */}
      </CardBody>
    </Card>
  );
};

export default FileItem;
