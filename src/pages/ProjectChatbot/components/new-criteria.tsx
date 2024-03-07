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
export interface NewCriteriaProps {
  isOpen: boolean;
  onOpenChange: (f: boolean) => void;
}

export default function NewCriteria({
  isOpen,
  onOpenChange,
}: NewCriteriaProps) {
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
                Create New Criteria
              </ModalHeader>
              <ModalBody>
                <Input
                  label="criteria"
                  placeholder="please input new Criteria"
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
