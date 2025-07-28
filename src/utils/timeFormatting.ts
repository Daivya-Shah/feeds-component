export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  // Check future times
  if (diffInMs < 0) {
    const futureMs = Math.abs(diffInMs);
    const futureHours = futureMs / (1000 * 60 * 60);
    const futureDays = futureHours / 24;

    if (futureHours < 24) {
      const hrs = Math.ceil(futureHours);
      return `In ${hrs} hour${hrs !== 1 ? 's' : ''}`;
    }

    if (futureHours < 48) {
      return 'Tomorrow';
    }

    const days = Math.ceil(futureDays);
    return `In ${days} day${days !== 1 ? 's' : ''}`;
  }
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;
  const diffInWeeks = diffInDays / 7;
  const diffInMonths = diffInDays / 30.44; // Average days per month
  const diffInYears = diffInDays / 365.25; // Average days per year

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      return "Just now";
    }
    return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
  }

  if (diffInHours < 48) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) !== 1 ? 's' : ''} ago`;
  }

  if (diffInDays < 31) {
    return `${Math.floor(diffInWeeks)} week${Math.floor(diffInWeeks) !== 1 ? 's' : ''} ago`;
  }

  if (diffInDays < 365) {
    return `${Math.floor(diffInMonths)} month${Math.floor(diffInMonths) !== 1 ? 's' : ''} ago`;
  }

  return `${Math.floor(diffInYears)} year${Math.floor(diffInYears) !== 1 ? 's' : ''} ago`;
}