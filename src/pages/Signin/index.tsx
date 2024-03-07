import React, { useState } from "react";
import { Form } from "antd";
import DragTitle from "@/components/DragTitle";
import "./index.css";
import { Button, Input, NextUIProvider, Tooltip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ipcDevtoolMain, ipcSign } from "@/service/ipc";
import { useLocalStorageState } from "ahooks";
import { MaterialSymbolsToolsWrench } from "@/assets/icon";
import TrafficLight from "@/components/TrafficLight";
type FieldType = {
  email?: string;
  password?: string;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  // 登录成功自动记录账号
  const [email, setEmail] = useLocalStorageState<string | undefined>("email", {
    defaultValue: "",
  });
  const onFinish = async (values: FieldType) => {
    try {
      setLoginLoading(true);
      await ipcSign();
      navigate("/navigation");
      setEmail(values.email);
    } catch (error) {
    } finally {
      setLoginLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <NextUIProvider navigate={navigate}>
      <DragTitle className="absolute login-bg  h-10 top-0 flex justify-end w-full " />
      <div className="px-6 login h-screen flex flex-col justify-center items-center">
        <div className="text-5xl text-white font-bold mb-8">MAP</div>
        <Form
          name="basic"
          initialValues={{ email }}
          onFinish={onFinish}
          className="w-[254px]"
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="email"
            required={false}
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input size="sm" label="Email" />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            required={false}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input size="sm" label="Password" type="password" />
          </Form.Item>

          <Form.Item>
            <Button
              isLoading={loginLoading}
              className="w-full"
              color="primary"
              type="submit"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
      {window.platform.isProduction() ? null : (
        <div className="absolute bottom-2 right-2">
          <Tooltip placement={"right"} content={"Dev Tool"}>
            <Button
              isIconOnly
              variant="light"
              onClick={ipcDevtoolMain}
              radius="sm"
              size="sm"
            >
              <MaterialSymbolsToolsWrench className="text-white" />
            </Button>
          </Tooltip>
        </div>
      )}
      <TrafficLight className="text-white" isMaximize={false} isDev={false} />
    </NextUIProvider>
  );
};

export default App;
