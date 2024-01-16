export const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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