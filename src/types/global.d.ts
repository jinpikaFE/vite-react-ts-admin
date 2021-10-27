export type ResultType<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  code: number;
  status?: number;
  statusText?: string;
  total?: number
};
