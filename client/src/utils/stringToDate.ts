function stringToDate(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    return formattedDate;
}

export default stringToDate;
