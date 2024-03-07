import {
  MaterialSymbolsCheckSmall,
  MaterialSymbolsCloseSmall,
  SolarCheckCircleBold,
  SolarCloseCircleBold,
  SolarQuestionCircleBold,
} from "@/assets/icon";
import { Button, divider } from "@nextui-org/react";
import { FC } from "react";
export interface TitleDetailProps {
  userSelect?: boolean;
}
const TitleDetail: FC<TitleDetailProps> = ({ userSelect }) => {
  const MockData = {
    author: ["Jiang", "wu", "song"],
    title:
      "In Case of Fire Please Do Not Use the “Escalators”: A Case Study in Hong Kong",
    year: 2022,
    abstract:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimusmollitia repellat molestiae animi accusantium aut, numquamperspiciatis tenetur enim molestias provident odit cupiditatedoloremque laudantium omnis iure nihil necessitatibus similique?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimusmollitia repellat molestiae animi accusantium aut, numquamperspiciatis tenetur enim molestias provident odit cupiditatedoloremque laudantium omnis iure nihil necessitatibus similique?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimusmollitia repellat molestiae animi accusantium aut, numquamperspiciatis tenetur enim molestias provident odit cupiditatedoloremque laudantium omnis iure nihil necessitatibus similique?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimusmollitia repellat molestiae animi accusantium aut, numquamperspiciatis tenetur enim molestias provident odit cupiditatedoloremque laudantium omnis iure nihil necessitatibus similique?Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimusmollitia repellat molestiae animi accusantium aut, numquamperspiciatis tenetur enim molestias provident odit cupiditatedoloremque laudantium omnis iure nihil necessitatibus similique?",
    from: "Journal of xxxxxx",
  };
  const renderDescription = () => {
    const keys = Object.keys(MockData).filter(
      (key) => key !== "title" && key !== "abstract"
    );
    return keys.map((key) => {
      return (
        <div key={key} className="flex gap-2">
          <div className="font-semibold">
            {key.slice(0, 1).toUpperCase() + key.slice(1)}:
          </div>
          <div>
            {key === "author" ? MockData["author"].join(", ") : MockData[key]}
          </div>
        </div>
      );
    });
  };
  return (
    <div className="flex p-4 gap-2 h-full">
      <div>
        <div className="flex">
          <Button
            variant="light"
            radius="sm"
            color={userSelect ? "success" : "default"}
            // data-hover={undefined}
            startContent={
              <div className="bg-green-500 rounded-full">
                <MaterialSymbolsCheckSmall className="text-2xl text-white " />
              </div>
            }
          >
            <span className="font-semibold">Yes</span>
          </Button>
          <Button
            variant="light"
            radius="sm"
            color={!userSelect ? "danger" : "default"}
            data-hover={!userSelect}
            startContent={
              <div className="bg-red-500 rounded-full">
                <MaterialSymbolsCloseSmall className="text-2xl text-white " />
              </div>
            }
          >
            <span className="font-semibold">No</span>
          </Button>
          <Button
            variant="light"
            radius="sm"
            // color="warning"
            startContent={
              <SolarQuestionCircleBold className="text-3xl text-[#F3AE68]" />
            }
          >
            <span className="font-semibold">Maybe</span>
          </Button>
        </div>
        <div className="h-0 my-4 border-b-[1px] border-dashed border-zinc-400"></div>
        <div>{renderDescription()}</div>
      </div>
      <div className="h-full">
        <div className="text-large font-bold">{MockData.title}</div>
        <div className="text-zinc-400 font-semibold">abstract</div>
        <div
          className="text-medium  overflow-auto"
          style={{
            height: "calc(100% - 56px)",
          }}
        >
          {MockData.abstract}
        </div>
      </div>
    </div>
  );
};

export default TitleDetail;
