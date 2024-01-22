export const formatAmount = (value, currency) =>
  new Intl.NumberFormat("pl-PL", {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (dateTime) => {
  if (!isDateValid(dateTime)) return dateTime;
  const parsedDate = new Date(dateTime);
  const formattedDate = new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsedDate);

  return formattedDate;
}

const isDateValid = (dateStr) => {
  return !isNaN(new Date(dateStr));
}