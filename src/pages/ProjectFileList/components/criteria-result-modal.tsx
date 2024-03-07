import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { Progress, ProgressProps, Space } from "antd";
export interface OverviewModalProps {
  isOpen: boolean;
  onOpenChange: (f: boolean) => void;
}

export default function OverviewModal({
  isOpen,
  onOpenChange,
}: OverviewModalProps) {
  const twoColors: ProgressProps["strokeColor"] = {
    "0%": "#108ee9",
    "100%": "#87d068",
  };
  return (
    <>
      <Modal
        size="lg"
        hideCloseButton
        isDismissable
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="z-[9999]">
          {(onClose) => (
            <>
              <ModalBody className="py-6">
                <div className="flex flex-col items-center">
                  <div className="text-xl font-semibold text-center mb-2">
                    Criteria Result Overview
                  </div>
                  <div className="mb-2 flex gap-4">
                    <div className="flex text-tiny gap-1 items-center">
                      <div className="bg-red-500 h-3 w-3 rounded-full" />
                      Affirmative
                    </div>
                    <div className="flex text-tiny gap-1 items-center">
                      <div className="bg-green-500 h-3 w-3 rounded-full" />
                      Negative
                    </div>
                    <div className="flex text-tiny gap-1 items-center">
                      <div className="bg-yellow-500 h-3 w-3 rounded-full" />
                      Uncertain
                    </div>
                    <div className="flex text-tiny gap-1 items-center">
                      <div className="bg-gray-500 h-3 w-3 rounded-full" />
                      NA
                    </div>
                  </div>
                </div>
                <div className="flex items-center  justify-between">
                  <div className="text-small">Criteria 1</div>
                  <div className="w-[70%] rounded-md h-[12px] bg-gray-500 relative">
                    <div
                      style={{
                        right: "60%",
                        left: 0,
                        bottom: 0,
                        zIndex: 9,
                      }}
                      className="absolute progress-bar-item cursor-pointer rounded-md  h-[12px]  bg-green-500"
                    ></div>
                    <div
                      style={{
                        right: "20%",
                        left: 0,
                        bottom: 0,
                        zIndex: 8,
                      }}
                      className="cursor-pointer rounded-md progress-bar-item absolute h-[12px]  bg-red-500"
                    ></div>
                    <div
                      style={{
                        right: "10%",
                        left: 0,
                        bottom: 0,
                        zIndex: 7,
                      }}
                      className="cursor-pointer h-[12px] progress-bar-item rounded-md absolute bg-yellow-500"
                    ></div>
                    <div className="progress-bar-item-data">
                      <div
                        style={{
                          right: "60%",
                          left: 0,
                          bottom: 0,
                          zIndex: 9,
                        }}
                        className="absolute  text-tiny rounded-md  h-[12px]  text-green-500"
                      >
                        85% (80 / 100)
                      </div>
                      <div
                        style={{
                          right: "20%",
                          left: 0,
                          bottom: 0,
                          zIndex: 8,
                        }}
                        className="rounded-md text-tiny  absolute h-[12px]  text-red-500"
                      >
                        85% (80 / 100)
                      </div>
                      <div
                        style={{
                          right: "10%",
                          left: 0,
                          bottom: 0,
                          zIndex: 7,
                        }}
                        className="h-[12px] text-tiny  rounded-md absolute text-yellow-500"
                      >
                        85% (80 / 100)
                      </div>
                      <div
                        style={{
                          right: "10%",
                          left: 0,
                          bottom: 0,
                          zIndex: 7,
                        }}
                        className="h-[12px] text-tiny  rounded-md absolute text-gray-500"
                      >
                        85% (80 / 100)
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-center"></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
