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
                    const avoiding = true;
                    days.push({avoiding: avoiding, failed: simulateIfDayFailed(avoiding)})
                }
                return days;
            })()
        },
        {
            description: 'Avoid if have 2 or more times in last 6 days',
            days: (() => {
                const days = [];
                const timesPerWkLimit = 2;
                const lastSixDays = [false, false, false, false, false, false];
                for (let i = 0; i < dayCount; i++) {
                    const lastSixDaysFailedCount = lastSixDays.reduce((total, value) => total + value, 0);
                    const avoiding = lastSixDaysFailedCount >= timesPerWkLimit;
                    const failed = simulateIfDayFailed(avoiding);
                    lastSixDays.shift();//Remove first element from array
                    lastSixDays.push(failed);
                    days.push({avoiding: avoiding, failed: failed})
                }
                return days;
            })()
        },
        {
            description: 'Avoid if have more 2 or more times in current week',
            days: (() => {
                const days = [];
                const daysPerWk = 7;
                const timesPerWkLimit = 2;
                let weekFailedCount = 0;
                for (let i = 0; i < dayCount; i++) {
                    if (i % daysPerWk === 0) {
                        weekFailedCount = 0;
                    }
                    const avoiding = weekFailedCount >= timesPerWkLimit;
                    const failed = simulateIfDayFailed(avoiding);
                    if (failed) {
                        weekFailedCount++;
                    }
                    days.push({avoiding: avoiding, failed: failed})
                }
                return days;
            })()
        },
        {
            description: 'Avoid never',
            days: (() => {
                const days = [];
                for (let i = 0; i < dayCount; i++) {
                    const avoiding = false;
                    days.push({avoiding: avoiding, failed: simulateIfDayFailed(avoiding)})
                }
                return days;
            })()
        }
    ];
}
