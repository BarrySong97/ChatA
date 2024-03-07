import {
  SolarPen2Bold,
  SolarPinBold,
  SolarTrashBinMinimalisticBold,
} from "@/assets/icon";
import { Dropdown, MenuProps } from "antd";
import React, { FC } from "react";
export interface ColumnTitleProps {
  title: string;
  onDelete: () => void;
  onEdit: () => void;
  onPin: () => void;
  onClick: () => void;
  pin: boolean;
}
const ColumnTitle: FC<ColumnTitleProps> = ({
  title,
  onDelete,
  onClick,
  pin,
  onEdit,
  onPin,
}) => {
  const items: MenuProps["items"] = [
    {
      label: pin ? "Unpin" : "Pin",
      key: "pin",
      icon: <SolarPinBold />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onPin();
      },
    },
    {
      label: "Edit",
      key: "edit",
      icon: <SolarPen2Bold />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onEdit();
      },
    },
    {
      label: "Delete",
      key: "delete",
      icon: <SolarTrashBinMinimalisticBold />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onDelete();
      },
    },
  ];
  return (
    <Dropdown menu={{ items }} trigger={["contextMenu"]}>
      <div className="flex items-center justify-between">
        <span>{title}</span>
        {pin ? <SolarPinBold /> : null}
      </div>
    </Dropdown>
  );
};

export default ColumnTitle;
