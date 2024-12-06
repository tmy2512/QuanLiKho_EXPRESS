import convertUTCToVNTime from "./convertUTCToVNTime";

const PERIOD = {
    THIS_MONTH: 1,
    THIS_QUARTER: 2,
    THIS_YEAR: 3,
    LAST_MONTH: 4,
    LAST_QUARTER: 5,
    LAST_YEAR: 6,
};

const formatPeriodDate = (caseString: number) => {
    const today = new Date();
    let currentQuarter = Math.floor((today.getMonth() + 3) / 3);
    let currentYear = today.getFullYear();

    let start: string = "",
        end: string = "";
    const {
        THIS_MONTH,
        THIS_QUARTER,
        THIS_YEAR,
        LAST_MONTH,
        LAST_QUARTER,
        LAST_YEAR,
    } = PERIOD;
    switch (caseString) {
        case THIS_MONTH:
            start = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            ).toISOString();

            end = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                1
            ).toISOString();
            break;
        case THIS_QUARTER:
            {
                const firstMonthOfQuarter = (currentQuarter - 1) * 3;
                start = new Date(
                    currentYear,
                    firstMonthOfQuarter,
                    1
                ).toISOString();
                end = new Date(
                    currentYear,
                    firstMonthOfQuarter + 3,
                    1
                ).toISOString();
            }
            break;
        case THIS_YEAR:
            start = new Date(currentYear, 0, 1).toISOString();
            end = new Date(currentYear + 1, 0, 1).toISOString();
            break;
        case LAST_MONTH:
            {
                let lastMonth = today.getMonth() - 1;
                if (lastMonth < 0) {
                    lastMonth = 11;
                    currentYear--;
                }
                start = new Date(currentYear, lastMonth, 1).toISOString();
                end = new Date(currentYear, lastMonth + 1, 1).toISOString();
            }
            break;
        case LAST_QUARTER:
            {
                let previousQuarter = currentQuarter - 1;
                if (previousQuarter < 1) {
                    previousQuarter = 4;
                    currentYear--;
                }
                const firstMonthOfQuarter = (previousQuarter - 1) * 3;
                start = new Date(
                    currentYear,
                    firstMonthOfQuarter,
                    1
                ).toISOString();
                end = new Date(
                    currentYear,
                    firstMonthOfQuarter + 3,
                    1
                ).toISOString();
            }
            break;
        case LAST_YEAR:
            start = new Date(currentYear - 1, 0, 1).toISOString();
            end = new Date(currentYear, 0, 1).toISOString();
            break;
    }

    return {
        startDate: convertUTCToVNTime(start).slice(0, 10),
        endDate: convertUTCToVNTime(end).slice(0, 10),
    };
};

export default formatPeriodDate;
