import {
  Card,
  CardFooter,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ProjectData } from "@/pages/Projects";
import { SolarMenuDotsBold } from "@/assets/icon";
import { FC, useEffect, useState } from "react";
import { Button } from "antd";
import { ipcOpenProject } from "@/service/ipc";
import { ProjectStage } from "@/constant";
export type ProjectCardProps = {
  data: ProjectData;
  onEdit: () => void;
  onFocus: () => void;
  focus: boolean;
};
const ProjectCard: FC<ProjectCardProps> = ({
  focus,
  data,
  onEdit,
  onFocus,
}) => {
  const [isCollidingWithRightBoundary, setIsCollidingWithRightBoundary] =
    useState(false);
  const [focusWidth, setFocusWidth] = useState<number>(0);
  useEffect(() => {
    if (!focus) {
      setIsCollidingWithRightBoundary(false);
    }
  }, [focus]);
  console.log(focusWidth);

  return (
    <div className="project-card">
      <div className="clip"></div>
      <Card
        isPressable
        // isFooterBlurred={true}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          // 获取页面宽度
          const pageWidth =
            window.innerWidth || document.documentElement.clientWidth;

          // 判断是否与右边界碰撞
          const isCollidingWithRightBoundary = pageWidth - rect.right == 16;
          setFocusWidth(rect.width);

          onFocus();
          setIsCollidingWithRightBoundary(isCollidingWithRightBoundary);
        }}
        radius="md"
        style={{
          width: !focus ? "auto" : "350px",
          zIndex: focus ? 50 : 0,
          transform: focus ? "scale(1.05)" : "scale(1)",
          translate: isCollidingWithRightBoundary
            ? `-${350 - focusWidth}px 0`
            : "0",
        }}
        className="break-words transition   hitespace-pre-wrap border-none p-0 rounded-md "
      >
        <CardBody
          className={` w-full md:h-[200px] 2xl:h-[300px] rounded-md ${
            focus ? "bg-primary-100/40" : "card-bg"
          }`}
        >
          <div
            className={
              focus ? "flex justify-between gap-2 	" : "flex  flex-col-reverse"
            }
          >
            <div title={data.title}>
              {focus ? (
                <div className={`w-[250px]`} title={data.title}>
                  <h3 className="truncate text-primary-900 project-title">
                    {data.title}
                  </h3>
                </div>
              ) : (
                <h3 className="mult-line-truncate text-primary-900  project-title">
                  {data.title}
                </h3>
              )}
            </div>
            <div className="text-white flex justify-end">
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button
                    type="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<SolarMenuDotsBold className="text-gray-800" />}
                  ></Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="edit">Edit Project</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Delete Project
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          {focus ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-tiny project-detail grid grid-cols-2 grid-rows-2 gap-4 mt-2 "
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  ipcOpenProject(
                    data.id,
                    ProjectStage.TITLE_ABSTRACT_SCREENING
                  );
                }}
                className="bg-white shadow-md flex flex-col justify-center rounded-md p-1 text-center"
              >
                <div>Title/Abstract Screening</div>
                <div>
                  <span>{data.titleAbstractScreening.screened}</span>/
                  <span>{data.titleAbstractScreening.total}</span>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-md p-2 text-center">
                <div>Full Text Screening</div>
                <span>{data.titleAbstractScreening.screened}</span>/
                <span>{data.titleAbstractScreening.total}</span>
              </div>
              <div className="bg-white shadow-md rounded-md p-2 text-center">
                <div>Data Extraction</div>
                <span>{data.titleAbstractScreening.screened}</span>/
                <span>{data.titleAbstractScreening.total}</span>
              </div>
              <div className="bg-white shadow-md rounded-md p-2 text-center">
                <div>Risk Bias Assessment</div>
                <span>{data.titleAbstractScreening.screened}</span>/
                <span>{data.titleAbstractScreening.total}</span>
              </div>
            </div>
          ) : null}
        </CardBody>
        <CardFooter className="justify-between z-[50] px-[10px] left-0 right-0 !w-auto text-tiny overflow-hidden py-2 absolute bottom-0 rounded-md   ">
          <p className=" text-default-700">
            Last Modified: {data.lastModified}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectCard;
