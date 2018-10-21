export default function getExperiments(doRateWhenAvoiding, doRateWhenNotAvoiding, yearsToSimulate) {
    const dayCount = yearsToSimulate * 365;

    function simulateIfDayFailed(avoiding) {
        if (avoiding) {
            return Math.random() < doRateWhenAvoiding;
        } else {
            return Math.random() < doRateWhenNotAvoiding;
        }
    }

    return [
        {
            description: 'Avoid always',
            days: (() => {
                const days = [];
                for (let i = 0; i < dayCount; i++) {
                    days.push({avoiding: true, failed: simulateIfDayFailed(true)})
                }
                return days;
            })()
        },
        {
            description: 'Avoid if have more than 2 times in last 7 days including today',
            days: (() => {
                const days = [];
                const timesPerWkLimit = 2;
                const lastSevenDays = [false, false, false, false, false, false, false];
                for (let i = 0; i < dayCount; i++) {
                    const lastSevenDaysFailedCount = lastSevenDays.reduce((total, value) => total + value, 0);
                    const avoiding = lastSevenDaysFailedCount > timesPerWkLimit;
                    const failed = simulateIfDayFailed(avoiding);
                    lastSevenDays.shift();//Remove first element from array
                    lastSevenDays.push(failed);
                    days.push({avoiding: avoiding, failed: failed})
                }
                return days;
            })()
        },
        {
            description: 'Avoid if have more than 2 times in current week',
            days: (() => {
                const days = [];
                const daysPerWk = 7;
                const timesPerWkLimit = 2;
                let weekFailedCount = 0;
                for (let i = 0; i < dayCount; i++) {
                    if (i % daysPerWk === 0) {
                        weekFailedCount = 0;
                    }
                    const avoiding = weekFailedCount > timesPerWkLimit;
                    const failed = simulateIfDayFailed(avoiding);
                    if (failed) {
                        weekFailedCount++;
                    }
                    days.push({avoiding: avoiding, failed: failed})
                }
                return days;
            })()
        }
    ];
}
