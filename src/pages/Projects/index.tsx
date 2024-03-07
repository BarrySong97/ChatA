import ProjectCard from "@/pages/Projects/components/project-card";
import "./index.css";
import { Card, CardBody, Pagination, useDisclosure } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import NewProject from "./components/new-project";
import { SolarAddFolderBold } from "@/assets/icon";
export interface ProjectsProps {}
export type ProjectData = {
  id: string;
  title: string;
  lastModified: string;
  titleAbstractScreening: {
    screened: number;
    total: number;
  };
  fullTextScreening: {
    screened: number;
    total: number;
  };
  dataExtraction: {
    total: number;
    success: number;
  };
  riskBiasAssessment: {
    total: number;
    success: number;
  };
};
const Projects: FC<ProjectsProps> = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [focusProject, setFocusProject] = useState<string>();
  const mockData = new Array(7).fill(0).map((_, i) => ({
    id: i + "",
    title: `this is a very very very very very very very very very very very very very very very very very very very very very very very very very very  very very very very very very very very very line${i}`,
    lastModified: `2022-01-0${i} `,
    titleAbstractScreening: {
      screened: 100,
      total: 500,
    },
    fullTextScreening: {
      screened: 100,
      total: 500,
    },
    dataExtraction: {
      total: 500,
      success: 400,
    },
    riskBiasAssessment: {
      total: 500,
      success: 400,
    },
  }));
  return (
    <div
      onClick={() => {
        setFocusProject(undefined);
      }}
      className="p-4 flex-1 relative"
    >
      <h1 className="text-3xl font-bold m-0 mb-8">Projects</h1>
      <div className="grid  grid-cols-4 xl:grid-cols-6  gap-4 mb-8">
        <Card
          radius="md"
          // shadow="none"
          onClick={() => {
            onOpen();
            setFocusProject(undefined);
          }}
          isPressable
          className="break-words  relative hitespace-pre-wrap border-none p-0"
        >
          <CardBody
            className=" justify-center items-center card-bg"
            style={
              {
                // backgroundColor: "#000000",
              }
            }
          >
            <SolarAddFolderBold className="text-primary text-3xl" />
            <div className="text-primary-900  font-semibold  mt-2">
              New Project
            </div>
          </CardBody>
        </Card>
        {mockData.map((item) => (
          <ProjectCard
            onFocus={() => {
              setFocusProject(item.id);
            }}
            focus={focusProject === item.id}
            onEdit={() => {
              onOpen();
            }}
            data={item}
            key={item.title}
          />
        ))}
      </div>
      <div className="flex justify-center items-center">
        <Pagination showControls total={10} initialPage={1} />
      </div>
      <NewProject isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default Projects;
