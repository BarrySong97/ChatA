import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { FC, ReactNode } from "react";
export interface ConfirmModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (f: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmModal: FC<ConfirmModalProps> = ({
  title,
  description,
  isOpen,
  onOpenChange,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{description}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  onClose();
                  onCancel();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onClose();
                  onConfirm();
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
