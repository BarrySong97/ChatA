import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Progress,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
export interface RunModalProps {
  isOpen: boolean;
  onOpenChange: (f: boolean) => void;
}

export default function RunModal({ isOpen, onOpenChange }: RunModalProps) {
  const [createLoading, setRunLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [title, setTitle] = useState();
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const onCreate = () => {
    try {
      setRunLoading(true);
    } catch (error) {
    } finally {
      setRunLoading(false);
    }
  };
  const onStart = () => {
    setIsRunning(true);
  };
  const renderConfirm = () => {
    return (
      <div className="flex flex-col items-center">
        <div>Estimated Token: 123</div>
        <div>Your Token Balance: 9999</div>
      </div>
    );
  };
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
      setIsRunning(false);
    }
  }, [isOpen]);
  return (
    <>
      <Modal
        size="md"
        isDismissable
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="z-[9999]">
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center  ">
                <div className="text-xl font-bold">
                  {isRunning ? "Screening Articles" : "Start Screening"}
                </div>
              </ModalHeader>
              <ModalBody>
                {isRunning ? renderRunning() : renderConfirm()}
              </ModalBody>
              <ModalFooter className="flex justify-center">
                {isRunning ? null : (
                  <>
                    <Button variant="flat" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button color="primary" onPress={onStart}>
                      Start
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
