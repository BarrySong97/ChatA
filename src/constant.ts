export enum IPC_EVENT_KEYS {
  SIGN_IN = "sign_in",
  SIGN_OUT = "sign_out",
  CHECK_SIGN_IN = "check_sign_in",
  DEV_TOOL = "dev_tool",
  OPEN_PROJECT = "open_project",
  WINDOW_RESIZE = "window_resize",
}
export enum MAIN_SEND_RENDER_KEYS {
  MAXIMIZE = "maximize",
  RESTORE = "restore",
  PRISMA_ERROR = "prisma_render",
}
export enum ProjectStage {
  TITLE_ABSTRACT_SCREENING = "title_abstract_screening",
  FULL_TEXT_SCREENING = "full_text_screening",
  DATA_EXTRACTION = "data_extraction",
  RISK_BIAS_ASSESSMENT = "risk_bias_assessment",
}
export enum TRAFFIC_LIGHT {
  MAXIMIZE = "maximize",
  MINIMIZE = "minimize",
  RESTORE = "restore",
  CLOSE = "close",
}

export enum CHAT_SERVICE {
  ALLCHATS = "allchats",
  GET_MESSAGES = "getmessages",
  SEND_MESSAGE = "sendmessage",
  CREATE_CHAT = "createchat",
  STOP_SEND = "stop_send",
  EDIT_CHAT = "editchat",
  DELETE_CHAT = "deletechat",
  INSERT_MESSAGE = "insertmessage",
  EDIT_MESSAGE = "editmessage",
}
