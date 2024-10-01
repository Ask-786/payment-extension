export type ApiRes<T> = {
  success: boolean;
  data: T;
};

export type PayrollApp = {
  id: string;
  name: string;
};

export type FlowSteps =
  | 'SET_API_KEY'
  | 'TAKE_SCREENSHOT'
  | 'CHOOSE_APPS'
  | 'SUCCESS_PAGE';
