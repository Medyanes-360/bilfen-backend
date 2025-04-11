import { formatDate } from '@/utils/formatDate';

export const formatContent = (content) => ({
  ...content,
  publishDateStudent: formatDate(content.publishDateStudent),
  publishDateTeacher: formatDate(content.publishDateTeacher),
  endDateStudent: formatDate(content.endDateStudent),
  endDateTeacher: formatDate(content.endDateTeacher),
  createdAt: formatDate(content.createdAt),
  updatedAt: formatDate(content.updatedAt),
});