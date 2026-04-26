import { format } from 'date-fns';

export const formatDate = (dateString: string | Date | undefined, pattern: string = 'yyyy-MM-dd HH:mm') => {
  if (!dateString) return '';
  return format(new Date(dateString), pattern);
};
