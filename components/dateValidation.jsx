const isValidDate = (dateStr) => {
    if (!dateStr) return false;

    const parsed = new Date(dateStr);
    const isValid = !isNaN(parsed.getTime());
    const isoDate = parsed.toISOString().split("T")[0];

    // Varsayılan default tarihleri eleyelim
    const invalidDates = ["1970-01-01", "1970-01-08"];

    return isValid && !invalidDates.includes(isoDate);
};
export default isValidDate;