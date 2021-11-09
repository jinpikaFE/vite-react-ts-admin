export type RightDrawerProps<T = any> = {
  title: string;
  onCloseDrawer: () => void;
  visibleDrawer: boolean;
  cItem: (T & { _id: string }) | undefined;
  renderFormItemDom: () => JSX.Element;
  onFinish: ((formData: Record<string, any>) => Promise<boolean | void>) &
    ((formData: Record<string, any>) => Promise<boolean | void>);
  initialValues?: unknown;
};
