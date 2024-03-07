import {
  MaterialSymbolsCheckSmall,
  MaterialSymbolsCloseSmall,
  SolarAddCircleBold,
  SolarCheckCircleBold,
  SolarCloseCircleBold,
  SolarExportBold,
  SolarHamburgerMenuBold,
  SolarHistory2Bold,
  SolarPlayBold,
} from "@/assets/icon";
import AutoSizer from "react-virtualized-auto-sizer";
import DragTitle from "@/components/DragTitle";
import { ProjectStage } from "@/constant";
import { useQuery } from "@/hooks";
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { ConfigProvider, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { FC, ReactNode, useState } from "react";
import TrafficLight from "@/components/TrafficLight";
import ColumnTitle from "./column-title";
import RunModal from "./run-modal";
import ExportModal from "./export-modal";
import NewCriteria from "@/pages/ProjectChatbot/components/new-criteria";
import CriteriaResultOverview from "./criteria-result-overview";
import OverviewModal from "./criteria-result-modal";
import ConfirmModal from "@/components/ConfirmModal";
export interface ListProps {
  selectKeys: React.Key[];
  onSelect: (keys: React.Key[]) => void;
}
export const getStageTitle = (stage: string) => {
  switch (stage) {
    case ProjectStage.DATA_EXTRACTION:
      return "Full Text Data Extraction";
    case ProjectStage.RISK_BIAS_ASSESSMENT:
      return "Risk Bias Assessment";
    case ProjectStage.FULL_TEXT_SCREENING:
      return "Full Text Screening";
    case ProjectStage.TITLE_ABSTRACT_SCREENING:
      return (
        <div>
          <div>Title/Abstract </div>
          <div>Screening</div>
        </div>
      );
  }
};
const List: FC<ListProps> = ({ selectKeys, onSelect }) => {
  const query = useQuery();
  const {
    isOpen: isRunModalOpen,
    onOpen: onOpenRun,
    onOpenChange: onOpenChangeRun,
  } = useDisclosure();
  const {
    isOpen: isRunExportModalOpen,
    onOpen: onOpenExport,
    onOpenChange: onOpenChangeExport,
  } = useDisclosure();
  const {
    isOpen: isOpenCriteriaModalOpen,
    onOpen: onOpenCriteria,
    onOpenChange: onOpenChangeCriteria,
  } = useDisclosure();
  const {
    isOpen: isOpenOverviewModalOpen,
    onOpen: onOpenOverview,
    onOpenChange: onOpenChangeOverview,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmModalOpen,
    onOpen: onOpenConfirm,
    onOpenChange: onOpenChangeConfirm,
  } = useDisclosure();
  const [criteriaList, setCriteriaList] = useState([
    {
      title: "Criteria 1",
      pin: false,
      disabled: false,
    },
    {
      title: "Criteria 2",
      pin: false,
      disabled: false,
    },
    {
      title: "Criteria 3",
      pin: false,
      disabled: false,
    },
    {
      title: "Criteria 4",
      pin: false,
      disabled: false,
    },
    {
      title: "Criteria 5",
      pin: false,
      disabled: false,
    },
    {
      title: "Criteria 6",
      pin: false,
      disabled: false,
    },
  ]);
  const titleActions = [
    {
      title: "Run",
      actions: [
        {
          title: "Run",
          icon: <SolarPlayBold />,
          onClick: () => {
            onOpenRun();
          },
        },
      ],
    },

    {
      title: "Finish",
      actions: [
        {
          title: "Export Article List",
          icon: <SolarExportBold />,
          onClick: () => {
            onOpenExport();
          },
        },
      ],
    },
    {
      title: "Criteria",
      actions: [
        {
          title: "New",
          icon: <SolarAddCircleBold />,
          onClick: () => {
            onOpenCriteria();
          },
        },
        {
          title: "Overview",
          icon: <SolarHamburgerMenuBold />,
          onClick: () => {
            onOpenOverview();
          },
        },
      ],
    },
    {
      title: "History",
      actions: [
        {
          title: "Go Back to Last Run",
          icon: <SolarHistory2Bold />,
          onClick: () => {
            onOpenConfirm();
          },
        },
      ],
    },
  ];
  const data = new Array(10000).fill(null).map((_, index) => ({
    title: `title ${index}`,
    id: index + "",
    userSelect: index % 2 === 0 ? true : false,
    mapSelect: index % 2 === 0 ? false : true,
  }));
  const renderCheck = (flag: boolean) => {
    return flag ? (
      <MaterialSymbolsCheckSmall className="text-xl" />
    ) : (
      <MaterialSymbolsCloseSmall className="text-xl" />
    );
  };
  const columns: ColumnsType<any> = [
    {
      title: <span className="text-medium">Title</span>,
      dataIndex: "title",
      ellipsis: true,
      fixed: true,
      onHeaderCell: () => {
        return {
          className: "border-r-[1px]",
        };
      },
      onCell: () => {
        return {
          className: "border-r-[1px]",
        };
      },

      width: 200,
    },
    {
      title: <span className="text-medium">User Select</span>,
      dataIndex: "userSelect",
      fixed: true,
      width: 140,
      onHeaderCell: () => {
        return {
          className: "border-r-[1px]",
        };
      },
      align: "center",
      onCell: () => {
        return {
          className: "flex border-r-[1px]  justify-center items-center",
        };
      },
      render: (_) => {
        const color = _ ? "bg-green-500" : "bg-red-500";
        return (
          <div className={`rounded-full ${color} text-white `}>
            {renderCheck(_)}
          </div>
        );
      },
    },
    {
      title: <span className="text-medium">MAP Select</span>,
      dataIndex: "mapSelect",
      fixed: true,
      align: "center",
      onHeaderCell: () => {
        return {
          className: "border-r-[1px]",
        };
      },
      onCell: () => {
        return {
          className: "flex border-r-[1px] justify-center items-center",
        };
      },
      width: 140,
      render: (_) => {
        const color = _ ? "bg-green-500" : "bg-red-500";
        return (
          <div className={`rounded-full ${color} text-white `}>
            {renderCheck(_)}
          </div>
        );
      },
    },
    ...criteriaList.map((item) => {
      return {
        title: (
          <ColumnTitle
            onClick={() => {}}
            pin={item.pin}
            onEdit={() => {}}
            onPin={() => {
              if (!item.disabled) {
                setCriteriaList(
                  criteriaList.map((i) => {
                    if (i.title === item.title) {
                      return {
                        ...i,
                        pin: !i.pin,
                      };
                    }
                    return i;
                  })
                );
              }
            }}
            onDelete={() => {}}
            title={item.title}
          />
        ),
        dataIndex: item.title,
        onHeaderCell: () => {
          return {
            onClick: () => {
              if (!item.pin) {
                setCriteriaList(
                  criteriaList.map((i) => {
                    if (i.title === item.title) {
                      return {
                        ...i,
                        disabled: !i.disabled,
                      };
                    }
                    return i;
                  })
                );
              }
            },
            className: `${item.disabled ? "!bg-gray-100" : ""}  ${
              item.pin
                ? "!bg-blue-100/20  !border-[#F4F4F5] !border-b-[1px]"
                : "border-r-[1px]"
            }`,
          };
        },
        onCell: () => {
          return {
            className: `border-r-[1px] ${item.disabled ? "!bg-gray-100" : ""} ${
              item.pin ? "!bg-blue-100/20" : ""
            }`,
          };
        },
        render: (_, r, index) => {
          return (
            <Popover placement="bottom" containerPadding={0}>
              <PopoverTrigger>
                <div>{renderCheck(index % 2 === 0)}</div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="w-[200px] p-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Fugiat, quis perferendis quas temporibus sit esse harum libero
                  aspernatur modi nobis beatae dolorem iusto, ratione eveniet
                  blanditiis itaque delectus tempora earum.
                </div>
              </PopoverContent>
            </Popover>
          );
        },
      };
    }),
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    onSelect(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectKeys,
    onChange: onSelectChange,
    columnWidth: 0.1,
    columnTitle: (node: ReactNode) => {
      return "";
    },
    onCell: () => {
      return {
        className: "!p-0",
      };
    },
    renderCell: (
      _checked: boolean,
      _record: any,
      _index: number,
      node: ReactNode
    ) => {
      return "";
    },
  };
  return (
    <div className="h-full relative">
      <DragTitle className="py-3 pt-4 flex px-4 mb-2 ">
        <div className="flex gap-8 items-end">
          <h2 className="text-xl font-bold">
            {getStageTitle(query.get("stage") ?? "")}
          </h2>
          <div className="flex gap-4 items-end">
            {titleActions.map((action, index) => {
              return (
                <>
                  <div key={action.title}>
                    <div className="text-base text-start pl-1  font-semibold mb-1">
                      {action.title}
                    </div>
                    <div className="flex gap-2 items-end">
                      {action.actions.map((action) => {
                        return (
                          <Button
                            size="sm"
                            variant="flat"
                            radius="sm"
                            className="bg-default-100"
                            startContent={action.icon}
                            onClick={action.onClick}
                          >
                            {action.title}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  {index !== titleActions.length - 1 ? (
                    <Divider
                      orientation="vertical"
                      className=" w-[1px] h-[50px]"
                    />
                  ) : null}
                </>
              );
            })}
          </div>
          <div className="absolute right-4 text-large">
            Available Article: 1627
          </div>
        </div>
        <TrafficLight isDev={false} />
      </DragTitle>
      <AutoSizer>
        {({ height, width }) => {
          return (
            <div style={{ height, width }}>
              <ConfigProvider
                theme={{
                  components: {
                    Table: {
                      headerBorderRadius: 0,
                      borderColor: "transparent",
                      headerBg:
                        "hsl(var(--nextui-default-100)/var(--nextui-default-100-opacity,1))",
                    },
                  },
                }}
              >
                <Table
                  virtual
                  rowKey={"id"}
                  rowSelection={rowSelection}
                  scroll={{ x: 2000, y: height - 150 }}
                  onRow={(record) => {
                    return {
                      className: "cursor-pointer",
                      onClick: () => {
                        if (selectKeys.includes(record.id)) {
                          onSelect([]);
                        } else {
                          onSelect([record.id]);
                        }
                      },
                    };
                  }}
                  pagination={false}
                  columns={columns}
                  dataSource={data}
                />
              </ConfigProvider>
            </div>
          );
        }}
      </AutoSizer>
      <RunModal isOpen={isRunModalOpen} onOpenChange={onOpenChangeRun} />
      <ExportModal
        isOpen={isRunExportModalOpen}
        onOpenChange={onOpenChangeExport}
      />
      <NewCriteria
        isOpen={isOpenCriteriaModalOpen}
        onOpenChange={onOpenChangeCriteria}
      />
      <OverviewModal
        isOpen={isOpenOverviewModalOpen}
        onOpenChange={onOpenChangeOverview}
      />
      <ConfirmModal
        isOpen={isOpenConfirmModalOpen}
        onOpenChange={onOpenChangeConfirm}
        title="Confirm Go back last run"
        description="Are you sure you want to go back last run?"
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    </div>
  );
};

export default List;
