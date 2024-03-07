import { SolarImportBold } from "@/assets/icon";
import { Button } from "@nextui-org/react";
import React, { FC } from "react";
export interface ImportModalProps {
  onClose: () => void;
}
const ImportModal: FC<ImportModalProps> = ({ onClose }) => {
  return (
    <div className="flex justify-center flex-col gap-4">
      <div className="text-large font-bold text-center">INSTRUCTIONS</div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptas
        nam ullam porro voluptates earum molestiae asperiores, at possimus
        delectus similique soluta facere minus maiores, expedita sapiente quia
        pariatur magnam!
      </div>
      <Button
        onClick={onClose}
        color="primary"
        startContent={<SolarImportBold />}
      >
        Import
      </Button>
    </div>
  );
};

export default ImportModal;
