import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
export interface NewFolderProps {
  isOpen: boolean;
  onOpenChange: (f: boolean) => void;
}

export default function NewFolder({ isOpen, onOpenChange }: NewFolderProps) {
  const [createLoading, setCreateLoading] = useState(false);
  const [title, setTitle] = useState();
  const onCreate = () => {
    try {
      setCreateLoading(true);
    } catch (error) {
    } finally {
      setCreateLoading(false);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="z-[9999]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Folder
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Folder name"
                  placeholder="please input folder name"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
