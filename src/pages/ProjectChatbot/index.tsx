import { FC, useState } from "react";
import "./index.css";
import { getStageTitle } from "../ProjectFileList/components/list";

import { useQuery } from "@/hooks";
import DragTitle from "@/components/DragTitle";
import ChatList from "./components/chat-list";
import { Button, Chip, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { SolarAddCircleBold, SolarCloseCircleBold } from "@/assets/icon";
import NewCriteria from "./components/new-criteria";
import { useNavigate } from "react-router-dom";
import TrafficLight from "@/components/TrafficLight";

export interface ProjectChatbotProps {}
const ProjectChatbot: FC<ProjectChatbotProps> = () => {
  const [criteria, setCriteria] = useState("common");
  const query = useQuery();
  const keywors = [
    "milk",
    "bread",
    "gish",
    "fold",
    "milk1",
    "bread1",
    "gish1",
    "fold1",
    "sssss",
    "2222",
    "33333",
    "444444",
  ];
  const criteriaList = [
    {
      short: "Nature of Work",
      long: "It must be clinical practice.2323jkskjskjdhskhfksdhfkjhs  dkshfkjshkfjh ks ",
    },
    {
      short: "Nature of Work1",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work2",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work3",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work4",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work6",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work7",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work8",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work9",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work10",
      long: "It must be clinical practice.",
    },
    {
      short: "Nature of Work11",
      long: "It must be clinical practice.",
    },
  ];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  return (
    <div className="flex h-screen gap-4">
      <div className="flex-1 h-screen flex flex-col bg-[#F3F3F4]">
        <DragTitle className="py-3 pt-8 flex px-4 mb-2 ">
          <div className="flex gap-8 items-end">
            <div className="text-xl font-bold">
              {getStageTitle(query.get("stage") ?? "")}
            </div>
          </div>
        </DragTitle>
        <ChatList />
      </div>
      <div className="flex-1 h-full">
        <DragTitle className="py-3 pt-10   ">
          <TrafficLight />
          <div className="text-xl flex-1 font-bold">
            <div>MAP SUGGESTS INCLUSION AND</div>
            <div>EXCLUSION CRITERIA</div>
          </div>
        </DragTitle>
        <div className="mb-4">
          <div className="font-semibold text-large mb-2">Research Question</div>
          <div className="text-medium">
            How to prevent food intolerance in infants? Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Ad veniam molestias vel sint,
            impedit debitis rem amet alias eos aspernatur, ipsam odio
            repudiandae magni laudantium ullam provident! Provident, blanditiis
            cumque.
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-large mb-2">Keywords</div>
          <div className="flex gap-2 w-[500px] flex-wrap">
            {keywors.map((v) => {
              return (
                <Chip className="bg-default-100" key={v}>
                  <span> {v}</span>
                </Chip>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-large mb-2">
            Suggested Inclusion and Exclusion Criteria
          </div>
          <div className="flex gap-2 mb-2">
            <Button
              className={` ${
                criteria === "common"
                  ? "text-primary-foreground bg-primary"
                  : ""
              }`}
              variant={criteria !== "common" ? "bordered" : "flat"}
              onClick={() => setCriteria("common")}
              radius="full"
              size="sm"
            >
              Common Criteria
            </Button>
            <Button
              onClick={() => setCriteria("specific")}
              variant={criteria !== "specific" ? "bordered" : "flat"}
              size="sm"
              className={` ${
                criteria === "specific"
                  ? "text-primary-foreground bg-primary"
                  : ""
              }`}
              radius="full"
            >
              Specific Criteria
            </Button>
          </div>
          <ScrollShadow
            className="scrollbar"
            style={{
              height: "calc(100vh - 490px)",
            }}
          >
            <div>
              {criteriaList.map((v) => {
                return (
                  <div
                    key={v.short}
                    className="text-small items-center flex  mb-2"
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      radius="sm"
                      color="danger"
                      variant="light"
                    >
                      <SolarCloseCircleBold className="text-lg " />
                    </Button>
                    <div className="font-semibold  w-[120px] truncate">
                      {v.short}
                    </div>
                    <div title={v.long} className="w-[400px] truncate">
                      {v.long}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollShadow>
          <div className="flex -ml-[5px] w-[600px]">
            <Button
              onClick={onOpen}
              size="sm"
              radius="sm"
              // color="primary"
              className="w-full"
              variant="flat"
            >
              <SolarAddCircleBold className="text-xl text-default-600" />
              <span className="text-small">Add New Criteria</span>
            </Button>
          </div>
        </div>
      </div>
      <NewCriteria isOpen={isOpen} onOpenChange={onOpenChange} />
      <Button
        radius="full"
        color="primary"
        onClick={() =>
          navigate(`/projectDetail/1/fileList?stage=${query.get("stage")}`)
        }
        className="absolute bottom-8 right-8  "
      >
        Next
      </Button>
    </div>
  );
};

export default ProjectChatbot;
