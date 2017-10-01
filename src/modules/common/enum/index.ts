export enum STATE {
  INIT = 0,
  ACTIVE = 1,
  PASS = 2,
  REJECT = 3,
  IGNORE = 4,
}

export enum PROCESS_TYPE {
  USERTASK = 'UserTask',
  FUNCTION = 'Function',
  API = 'Api',
  GATEWAY = 'Gateway',
  JOINGATEWAY = 'JoinGateway',
  STARTEVENT = 'StartEvent',
  ENDEVENT = 'EndEvent',
  REJECTEVENT = 'RejectEvent',
}

export enum TASK_TYPE {
  USERTASK = 'UserTask',
  FUNCTION = 'Function',
  API = 'Api',
}
