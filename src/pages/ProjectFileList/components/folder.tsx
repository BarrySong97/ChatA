import {
  MaterialSymbolsAdd,
  MaterialSymbolsToolsWrench,
  SolarAddFolderLinear,
  SolarFolderBold,
  SolarInboxArchiveBold,
  SolarSiderbarBold,
} from "@/assets/icon";
import DragTitle from "@/components/DragTitle";
import { ipcDevtoolProject } from "@/service/ipc";
import { Button, Divider, Tooltip, useDisclosure } from "@nextui-org/react";
import { GetProps, Tree, TreeDataNode } from "antd";
import React, { FC, useState } from "react";
import NewFolder from "./new-folder";
export interface FolderProps {
  projectId: string;
  toggleSideBar: boolean;
  onToggleSidebar: () => void;
}
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
  {
    title: "Folder 1",
    key: "0-0",
  },
  {
    title: "Folder 2",
    key: "0-1",
  },
];
const Folder: FC<FolderProps> = ({
  onToggleSidebar,
  projectId,
  toggleSideBar,
}) => {
  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };
  const [selectFolder, setSelectFolder] = useState<string>("total");
  const isMac = window.platform.getOS() === "darwin";
  const {
    isOpen: isNewFolderModalOpen,
    onOpen: onOpenNewFolder,
    onOpenChange: onOpenNewFolderChange,
  } = useDisclosure();
  return (
    <>
      <nav className="w-full">
        <DragTitle className={` top-0 left-0`}>
          <div
            className={`flex  ${isMac ? "pt-1" : ""} justify-end  ${
              toggleSideBar ? "flex-col-reverse " : ""
            } ${toggleSideBar && isMac ? "!pt-8" : ""}`}
          >
            {!window.platform.isProduction() ? (
              <Tooltip
                placement={toggleSideBar ? "right" : "bottom"}
                content={"Dev Tool"}
              >
                <Button
                  isIconOnly={!toggleSideBar}
                  variant="light"
                  onClick={() => {
                    ipcDevtoolProject();
                  }}
                  radius="sm"
                  size="sm"
                  className="min-w-unit-8"
                >
                  <MaterialSymbolsToolsWrench className="text-lg text-zinc-500" />
                </Button>
              </Tooltip>
            ) : null}
            <Tooltip
              placement={toggleSideBar ? "right" : "bottom"}
              content={"Toggle Sidebar"}
            >
              <Button
                isIconOnly={!toggleSideBar}
                onClick={onToggleSidebar}
                className="min-w-unit-8"
                radius="sm"
                variant="light"
                size="sm"
              >
                <SolarSiderbarBold className="text-lg text-zinc-500" />
              </Button>
            </Tooltip>
          </div>
        </DragTitle>
        {!toggleSideBar ? (
          <>
            <div className="text-xl flex items-center gap-2 font-bold text-foreground pl-4 mt-2">
              <SolarInboxArchiveBold />
              Index
            </div>
            <Divider className="my-2 mx-4 w-auto" />

            <div className="px-4 flex justify-center  text-medium text-zinc-800">
              <div>
                <div className="">
                  <Button
                    onClick={() => {
                      setSelectFolder("total");
                    }}
                    variant="light"
                    color={selectFolder === "total" ? "primary" : "default"}
                    radius="sm"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <div className="text-small">Total Articles (100)</div>
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectFolder("included");
                    }}
                    color={selectFolder === "included" ? "primary" : "default"}
                    className="w-full justify-start"
                    variant="light"
                    size="sm"
                  >
                    <div className="text-small">Included Articles (100)</div>
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectFolder("excluded");
                    }}
                    color={selectFolder === "excluded" ? "primary" : "default"}
                    className="w-full justify-start"
                    variant="light"
                    size="sm"
                  >
                    <div className="text-small">Excluded Articles (100)</div>
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectFolder("tbd");
                    }}
                    color={selectFolder === "tbd" ? "primary" : "default"}
                    variant="light"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <div className="text-small">TBD Articles (100)</div>
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectFolder("unreviewed");
                    }}
                    variant="light"
                    className="w-full justify-start"
                    color={
                      selectFolder === "unreviewed" ? "primary" : "default"
                    }
                    size="sm"
                  >
                    <div className="text-small">Unreviewed Articles (100)</div>
                  </Button>
                </div>
                <div className="mt-2 mx-4">
                  <div className="flex justify-between items-center">
                    <div className="text-medium flex  gap-2 items-center font-bold text-foreground ">
                      <SolarFolderBold />
                      Folders
                    </div>

                    <Button
                      size="sm"
                      onClick={onOpenNewFolder}
                      variant="light"
                      isIconOnly
                    >
                      <MaterialSymbolsAdd />
                    </Button>
                  </div>
                  <Divider className="my-2  w-auto" />
                  <div>
                    <DirectoryTree
                      onSelect={onSelect}
                      onExpand={onExpand}
                      className="bg-transparent"
                      treeData={treeData}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </nav>
      <NewFolder
        isOpen={isNewFolderModalOpen}
        onOpenChange={onOpenNewFolderChange}
      />
    </>
  );
};

export default Folder;
