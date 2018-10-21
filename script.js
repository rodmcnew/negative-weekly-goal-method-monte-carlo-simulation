import getExperiments from './getExperiments.js'

Vue.component('experiment-display', {
    props: ['experiment'],
    data: function () {
        const days = this.experiment.days;
        let failCount = days.reduce((total, day) => total + (day.failed ? 1 : 0), 0);
        return {
            netFailRate: (failCount / days.length).toFixed(2)
        };
    },
    template: `
        <div>
                <div class="experimentDescription">"{{experiment.description}}"</div>
                <div>Net fail rate: {{netFailRate}}</div>
                <span v-for="(day,index) in experiment.days">
                    <div class="weekBarrier" v-if="index % 7 === 0"></div>
                    <div class="experimentDay" v-bind:class="{dayFailed: day.failed, dayAvoiding:day.avoiding}"></div>
                </span>
            </div>
        </div>
    `
});

document.addEventListener('DOMContentLoaded', () => {
    const doRateWhenAvoiding = 0.20;
    const doRateWhenNotAvoiding = 0.50;
    const yearsToSimulate = 100;
    let app = new Vue({
        el: '#app',
        data: {
            experiments: getExperiments(doRateWhenAvoiding, doRateWhenNotAvoiding, yearsToSimulate),
            doRateWhenAvoiding: doRateWhenAvoiding,
            doRateWhenNotAvoiding: doRateWhenNotAvoiding,
            yearsToSimulate: yearsToSimulate
        },
        'template': `
            <div>
                <div class="globalInfo">
                Global settings: doRateWhenAvoiding: {{doRateWhenAvoiding}}
                , doRateWhenNotAvoiding: {{doRateWhenNotAvoiding}}
                , yearsToSimulate: {{yearsToSimulate}}
                <br/>Legend: Green:"did not do", Red:"did do", Blue-border:"not avoiding" 
                </div>
                <div class="experiment" v-for="experiment in experiments">
                    <experiment-display v-bind:experiment="experiment"/>
                </div>
            </div>
        `
    });
});
