export function formatDate(dateString: string) {
    const date = new Date(dateString);

    // Extract the date in 'YYYY-MM-DD' format
    const formattedDate = date.toISOString().split('T')[0];

    return formattedDate;
}