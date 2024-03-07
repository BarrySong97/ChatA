import { Checkbox, Divider } from "@nextui-org/react";
import { FC } from "react";
export interface GeneralProps {}
const General: FC<GeneralProps> = () => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold m-0 ">General Setting</h3>
      <Divider className="my-4" />
      <div>
        <h4 className="text-lg font-semibold m-0 mb-2">Chatbot</h4>
        <div className="flex gap-4 mb-2">
          <Checkbox defaultSelected size="md">
            Title/Abstract Screening
          </Checkbox>
          <Checkbox defaultSelected size="md">
            Full Text Data Extraction
          </Checkbox>
        </div>
        <div className="text-small">
          Chatbot is designed to recommend inclusion/exclusion criteria and
          potential questions based on both common practice and user paper
          input. Turning off this function will not affect the screening and
          data extraction process.
        </div>
      </div>
    </div>
  );
};

export default General;
