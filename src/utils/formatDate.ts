/* YYYY.MM.DD HH:MM */
export const formatDateTime = (isoStr: string) => {
  const date = new Date(isoStr);

  const yearMonthDay = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
    .format(date)
    .replace(/\. /g, '.')
    .replace(/\.$/, '');

  const hourMinute = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(date);

  return `${yearMonthDay} ${hourMinute}`;
};

/* (YYYY년) MM월 DD일 HH:MM */
export const formatSimpleDate = (isoStr: string, hasYear?: boolean) => {
  const date = new Date(isoStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (hasYear) return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;

  return `${month}월 ${day}일 ${hours}:${minutes}`;
};

/* YYYY-MM-DD (HH:MM) */
export const formatDashDate = (isoStr: string, hasTime?: boolean) => {
  const date = new Date(isoStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (hasTime) return `${year}-${month}-${day} ${hours}:${minutes}`;

  return `${year}-${month}-${day}`;
};

export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // 1분 미만
  if (diffInMinutes < 1) {
    return '방금 전';
  }
  // 59분 전까지
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  // 23시간 전까지
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  // 1일 전 이상
  return `${diffInDays}일 전`;
};

// ===================== 관리자 통계 및 아카이브 =====================
/* YYYY년 MM월 */
export const formatYearMonth = (isoStr: string) => {
  if (!isoStr) return '';

  const date = new Date(isoStr);

  if (isNaN(date.getTime())) {
    console.error('Invalid Date Value:', isoStr);
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

/* YYYY.MM.DD - MM.DD */
export const formatSummaryDate = (startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const yearMonthDay = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    })
      .format(date)
      .replace(/\. /g, '.')
      .replace(/\.$/, '');
  };

  const monthDay = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    })
      .format(date)
      .replace(/\. /g, '.')
      .replace(/\.$/, '');
  };

  const isSameDay = yearMonthDay(start) === yearMonthDay(end);
  const isSameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();

  if (isSameDay) {
    return yearMonthDay(start);
  }

  if (isSameMonth) {
    return `${yearMonthDay(start)} - ${monthDay(end)}`;
  }

  return `${yearMonthDay(start)} - ${yearMonthDay(end)}`;
};

/* YYYY.MM.DD HH:MM ~ YYYY.MM.DD HH:MM */
export const formatDateDuration = (startStr: string, endStr: string) => {
  return `${formatDateTime(startStr)} ~ ${formatDateTime(endStr)}`;
};
