function convertUTCToVNTime(utcString: string) {
    // Parse the UTC date string
    const utcDate = new Date(utcString);

    // Get the UTC offset in milliseconds (VN time is UTC+7)
    const utcOffset = 7 * 60 * 60 * 1000;

    // Create a new Date object with VN time by adding the offset
    const vnDate = new Date(utcDate.getTime() + utcOffset);

    return vnDate.toISOString().slice(0, 16);
}

export default convertUTCToVNTime;
