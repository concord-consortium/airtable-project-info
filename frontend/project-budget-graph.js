import {
    expandRecord,
    Box,
} from '@airtable/blocks/ui';
import React from 'react';

// This block uses chart.js and the react-chartjs-2 packages.
// Install them by running this in the terminal:
// npm install chart.js react-chartjs-2
import {Bar} from 'react-chartjs-2';

export default function ProjectBudgetGraph({records}) {
    const data = records ? getChartData({records}) : null;

    // It would be more efficient to wrap this in a useCallback
    function handleBarClick(elements) {
      if(elements.length == 0) {
        return;
      }
      const index = elements[0]._index;
      if(records) {
        expandRecord(records[index]);
      }
    }

    return data && (
        <Box position="relative" flex="auto" padding={3}>
            <Bar
                data={data}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                            },
                        }],
                    },
                    legend: {
                        display: true,
                    },
                }}
                onElementsClick={handleBarClick}
            />
        </Box>
    );
}

function getChartData({records}) {
    const labels = records.map(record => record.primaryCellValueAsString);

    const data = {
        labels,
        datasets: [
            {
                label: 'Spent (BA)',
                backgroundColor: 'rgb(138, 177, 255)',
                data: records.map(record => record.getCellValue('Sticky Spent (BA)')),
            },
            {
                label: 'Unreconciled Spent',
                backgroundColor: 'rgb(142, 219, 250)',
                data: records.map(record => record.getCellValue('Unreconciled Past Stickies')),
            },
            {
                label: 'Planned',
                backgroundColor: 'rgb(234, 109, 47)',
                data: records.map(record => record.getCellValue('Future Stickies')),
            },
            {
                label: 'Estimated Remaining',
                backgroundColor: 'rgb(163, 239, 137)',
                data: records.map(record => record.getCellValue('Estimated Remaining')),
            },
            {
                label: 'Spent (BA) 2',
                backgroundColor: 'rgb(138, 177, 255)',
                stack: 'total',
                data: records.map(record => record.getCellValue('Sticky Spent (BA)')),
            },
            {
                label: 'Remaining (BA)',
                backgroundColor: 'rgb(255, 100, 100)',
                stack: 'total',
                data: records.map(record => record.getCellValue('Sticky Remaining (BA)')),
            },
         ],
    };
    return data;
}
