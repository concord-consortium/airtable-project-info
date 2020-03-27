import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    useSettingsButton,
    ViewPickerSynced,
    Box,
    FormField,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

// This block uses chart.js and the react-chartjs-2 packages.
// Install them by running this in the terminal:
// npm install chart.js react-chartjs-2
import {Bar} from 'react-chartjs-2';

const GlobalConfigKeys = {
    VIEW_ID: 'viewId',
};

function SimpleChartBlock() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    useSettingsButton(() => setIsSettingsVisible(!isSettingsVisible));

    const table = base.getTableByName("Project Budgets");

    const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);
    const view = table ? table.getViewByIdIfExists(viewId) : null;

    const records = useRecords(view);

    const data = records ? getChartData({records}) : null;

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
        >
            {isSettingsVisible && (
                <Settings table={table} />
            )}
            {data && (
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
                    />
                </Box>
            )}
        </Box>
    );
}

function getChartData({records}) {
    const labels = records.map(record => record.primaryCellValueAsString);
    const points = records.map(record => 10);

    const data = {
        labels,
        datasets: [
            {
                label: 'FY Spent (Reconciled)',
                backgroundColor: 'rgb(138, 177, 255)',
                data: records.map(record => record.getCellValue('Sticky Spent (BA)')),
            },
            {
                label: 'FY Planned and Unreconciled Spent',
                backgroundColor: 'rgb(142, 219, 250)',
                data: records.map(record => record.getCellValue('Unreconciled Planned Stickies')),
            },
            {
                label: 'FY Remaining',
                backgroundColor: 'rgb(163, 239, 137)',
                data: records.map(record => record.getCellValue('Estimated Remaining')),
            },
            {
                label: 'FY Total',
                backgroundColor: 'rgb(255, 100, 100)',
                stack: 'total',
                data: records.map(record => record.getCellValue('FY Budget')),
            },
         ],
    };
    return data;
}

function Settings({table}) {
    return (
        <Box display="flex" padding={3} borderBottom="thick">
            <FormField label="View" width="33.33%" paddingX={1} marginBottom={0}>
                <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} />
            </FormField>
        </Box>
    );
}

initializeBlock(() => <SimpleChartBlock />);
