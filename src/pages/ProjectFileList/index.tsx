import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NextUIProvider,
  useDisclosure,
} from "@nextui-org/react";
import "./index.css";
import React, { FC, useRef, useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useParams } from "react-router-dom";
import Folder from "./components/folder";
import List from "./components/list";
import TitleDetail from "./components/title-detail";
import ImportModal from "./components/import-modal";
export interface ProjectDetailProps {}
const ProjectFileList: FC<ProjectDetailProps> = () => {
  const [toggleSideBar, settoggleSideBar] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const panlRef = useRef<any>();
  const { id } = useParams();
  const collapse = () => {};
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });

  return (
    <NextUIProvider>
      <div className="h-screen">
        <PanelGroup direction="horizontal">
          <Panel
            minSize={13}
            collapsible={true}
            ref={panlRef}
            collapsedSize={3}
            onCollapse={() => {
              settoggleSideBar((v) => !v);
            }}
            onResize={(size) => {
              if (size >= 13) {
                settoggleSideBar(false);
              }
            }}
            defaultSize={18}
            maxSize={25}
            className="relative z-[9] shadow-[1px_0px_30px_0px] shadow-slate-900/15"
          >
            <aside className="bg-[#F3F3F4]  w-full  relative  h-screen  flex flex-col items-center">
              <Folder
                toggleSideBar={toggleSideBar}
                onToggleSidebar={() => {
                  settoggleSideBar((v) => {
                    if (!v) {
                      panlRef.current?.collapse();
                    } else {
                      panlRef.current?.expand();
                    }
                    return !v;
                  });
                }}
                projectId={id as string}
              />
            </aside>
          </Panel>
          <PanelResizeHandle className="hover:bg-primary-500 w-[2px]" />
          <Panel>
            <PanelGroup direction="vertical">
              <Panel>
                <List selectKeys={selectRowKeys} onSelect={setSelectRowKeys} />
              </Panel>
              {selectRowKeys?.length ? (
                <>
                  <PanelResizeHandle className="h-[1px] hover:bg-primary-500 hover:h-[2px]" />
                  <Panel
                    className="relative z-[100] shadow-[0px_-1px_40px_0px] shadow-slate-900/15"
                    minSize={20}
                    defaultSize={25}
                    maxSize={50}
                  >
                    <TitleDetail />
                  </Panel>
                </>
              ) : null}
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody>
                <ImportModal onClose={onClose} />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </NextUIProvider>
  );
};

export default ProjectFileList;
