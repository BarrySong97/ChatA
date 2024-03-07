import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
export interface ExportModalProps {
  isOpen: boolean;
  onOpenChange: (f: boolean) => void;
}

export default function ExportModal({
  isOpen,
  onOpenChange,
}: ExportModalProps) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const renderRunning = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="text-zinc-500 mb-2">Remaining time: 01:05</div>
        <div className="w-full">
          <Progress aria-label="Loading..." value={value} />
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (isOpen) {
      // setIsRunning(false);
    }
  }, [isOpen]);
  return (
    <>
      <Modal
        size="md"
        hideCloseButton
        isDismissable
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="z-[9999]">
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center  ">
                <div className="text-xl font-bold">
                  Export Included Articles to CSV
                </div>
              </ModalHeader>
              <ModalBody>{renderRunning()}</ModalBody>
              <ModalFooter className="flex justify-center"></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
