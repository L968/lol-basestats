import React, { useState, useEffect } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

export default function Chart(props) {

    const [chartData, setChartData] = useState({});
    const stats = ['hp', 'hpperlevel', 'mp', 'mpperlevel', 'movespeed', 'armor', 'armorperlevel', 'spellblock', 'spellblockperlevel', 'attackrange', 'hpregen', 'hpregenperlevel', 'mpregen', 'mpregenperlevel', 'crit', 'critperlevel', 'attackdamage', 'attackdamageperlevel', 'attackspeedperlevel', 'attackspeed'];

    const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        plugins: {
            datalabels: {
                formatter: function(value, context) {
                    return value.y;
                },
                color: '#000'
            }
        }
    }

    useEffect(() => {
        function updateChart() {
            const { selectedChampionsData } = props;
            let champions = [];

            const dataset = stats.map(stat => {

                let data = selectedChampionsData.map(champion => ({
                    x: champion[1].name,
                    y: champion[1].stats[stat]
                }));

                champions = data.map(champion => champion.x);

                return {
                    label: stat,
                    data: data,
                    backgroundColor: "#2eb8b8",
                    fill: false,
                    hidden: true
                }
            });

            setChartData({
                labels: champions,
                datasets: dataset
            });
        }

        updateChart();
    }, [props]);

    return (
        <Bar data={chartData} options={options} width={500} height={200} />
    );

}