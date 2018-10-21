function getExperiments() {
    let doRateWhenAvoiding = 0.20;
    let doRateWhenNotAvoiding = 0.50;
    let dayCount = 365 * 10 + 4;
    return [
        {
            description: 'Avoid always',
            daysFailed: (() => {
                const daysFailed = [];
                for (let i = 0; i < dayCount; i++) {
                    daysFailed.push(Math.random() < doRateWhenAvoiding)
                }
                return daysFailed;
            })()
        },
        {
            description: 'Avoid if have more than 2 times in last 7 days including today',
            daysFailed: (() => {
                const daysFailed = [];
                const timesPerWkLimit = 2;
                const lastSevenDays = [false, false, false, false, false, false, false];
                for (let i = 0; i < dayCount; i++) {
                    const lastSevenDaysFailedCount = lastSevenDays.reduce((total, value) => {
                        return total + value;
                    });
                    console.log(lastSevenDays, lastSevenDaysFailedCount);
                    let failed;
                    if (lastSevenDaysFailedCount > timesPerWkLimit) {
                        failed = Math.random() < doRateWhenAvoiding;
                    } else {
                        failed = Math.random() < doRateWhenNotAvoiding;
                    }

                    lastSevenDays.shift();//Remove first element from array
                    lastSevenDays.push(failed);
                    daysFailed.push(failed)
                }
                return daysFailed;
            })()
        },
        {
            description: 'Avoid if have more than 2 times in current week',
            daysFailed: (() => {
                const daysFailed = [];
                const daysPerWk = 7;
                const timesPerWkLimit = 2;
                let weekFailedCount = 0;
                for (let i = 0; i < dayCount; i++) {
                    if (i % daysPerWk === 0) {
                        weekFailedCount = 0;
                    }
                    let failed;
                    if (weekFailedCount > timesPerWkLimit) {
                        failed = Math.random() < doRateWhenAvoiding;
                    } else {
                        failed = Math.random() < doRateWhenNotAvoiding;
                    }

                    if (failed) {
                        weekFailedCount++;
                    }
                    daysFailed.push(failed)
                }
                return daysFailed;
            })()
        }
    ];
}

Vue.component('experiment-display', {
    props: ['experiment'],
    data: function () {
        const daysFailed = this.experiment.daysFailed;
        let netFailCount = 0;
        for (const dayFailed of daysFailed) {
            if (dayFailed) {
                netFailCount++;
            }
        }
        return {
            netFailRate: (netFailCount / daysFailed.length).toFixed(2)
        };
    },
    template: `
<div>
    <div class="experimentTextInfo">
        <div>Net fail rate: {{netFailRate}}</div>
        <div>"{{experiment.description}}"</div>
    </div>
        <span v-for="(dayFailed,index) in experiment.daysFailed">
            <div class="weekBarrier" v-if="index % 7 === 0"></div>
            <div class="experimentDay" v-bind:class="{dayFailed: dayFailed}"></div>
        </span>
    </div>
</div>
`
});

document.addEventListener('DOMContentLoaded', () => {
    let app = new Vue({
        el: '#app',
        data: {
            experiments: getExperiments()
        },
        'template': `
<div>
    <div class="experiment" v-for="experiment in experiments">
        <experiment-display v-bind:experiment="experiment"/>
    </div>
</div>
`
    });
});
