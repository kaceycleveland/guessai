import { parse } from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';

export const parseToDate = (date: string) => parse(date, DATE_FORMAT, new Date());
