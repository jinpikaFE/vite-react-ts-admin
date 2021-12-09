/* 时间加一天 */
export const getTimes = (time: Date) => {
  time = new Date(time.getTime() + 3600 * 1000 * 24 * 1);
  const year = time.getFullYear();
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const day = time.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* 时间格式处理 */
export const timeFormat = (date: Date, status = true) => {
  const y = date.getFullYear(); //年
  const m = (date.getMonth() + 1).toString().padStart(2, '0'); //月
  const d = date.getDate().toString().padStart(2, '0'); //日
  if (status) return `${y}-${m}-${d} 00:00:00`;
  return `${y}-${m}-${d} 23:59:59`;
};

/* ------------------------------------------------------ */
/* 本周星期一 */
export const getFirstDayOfWeek = (date: Date, status = true) => {
  const weekday = date.getDay() || 7;
  date.setDate(date.getDate() - weekday + 1);
  if (status) return timeFormat(date, status);
  return getWeekLast(date);
};

/* 本周最后一天 */
export const getWeekLast = (data: Date) => {
  const nowTime = data.getTime();
  const day = data.getDay();
  const oneDayTime = 24 * 60 * 60 * 1000;
  const SundayTime = nowTime + (7 - day) * oneDayTime;
  return timeFormat(new Date(SundayTime));
};

/* ------------------------------------------------------ */
/* 本月第一天 */
export const getFirstDayOfMonth = (date: Date, status = true) => {
  date.setDate(1);
  if (status) return timeFormat(date, status);
  return getCurrentMonthLast(date);
};
/* 本月最后一天 */
export const getCurrentMonthLast = (date: Date) => {
  let currentMonth = date.getMonth();
  const nextMonth = ++currentMonth;
  const nextMonthFirstDay = new Date(
    date.getFullYear(),
    nextMonth,
    1,
  ).getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return timeFormat(new Date(nextMonthFirstDay - oneDay));
};

/* ------------------------------------------------------ */
/* 本年年初 */
export const getFirstDayOfYear = (date: Date, status = true) => {
  date.setDate(1);
  date.setMonth(0);
  if (status) return timeFormat(date, status);
  return getEndYear(date);
};
/* 本年年尾 */
export const getEndYear = (date: Date) => {
  date.setFullYear(date.getFullYear() + 1);
  date.setMonth(0);
  date.setDate(0);
  return timeFormat(date);
};

/* 昨天 */
export const getLast = (date: Date, status = true) => {
  let last: any = new Date(date).getTime() - 1000 * 60 * 60 * 24;
  last = new Date(last);
  return timeFormat(last, status);
};
