 // Format date to work with the database
 const formatDate = (date: any) => {
    const year = date.year;
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Format date to be displayed to the user
const formatDatePretty = (date: any) => {
    const year = date.year;
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${day}.${month}.${year}`;
}

export { formatDate, formatDatePretty };