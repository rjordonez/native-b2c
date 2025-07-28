export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatScore = (score: number | null | undefined) => {
  if (score === null || score === undefined) return 'N/A';
  return `${Math.round(score * 100) / 100}%`;
};