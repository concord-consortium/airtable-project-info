import {
    initializeBlock,
    expandRecord,
    useBase,
    useRecords,
    useGlobalConfig,
    useSettingsButton,
    ViewPickerSynced,
    Box,
    Select,
    FormField,
} from '@airtable/blocks/ui';
import React, {useState, useEffect} from 'react';

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
    const [project, setProject] = useState(null);

    useSettingsButton(() => setIsSettingsVisible(!isSettingsVisible));

    const table = base.getTableByName("Project Budgets");

    const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);
    const view = table.getViewByIdIfExists(viewId);

    const allRecords = useRecords(view);

    const options = [{ value: null, label: 'All Projects'}];
    if(allRecords) {
      for(let record of allRecords){
        options.push({ value: record.id, label: record.primaryCellValueAsString})
      }
    }

    // If there is no view set, then show the settings automatically
    useEffect(() => {
      if (!view) {
        setIsSettingsVisible(true);
      }
    }, [view])

    let records = allRecords;
    if(project && allRecords) {
      records = [allRecords.find(record => record.id === project)];
    }
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
            <Box width="33.33%" padding={1} marginBottom={0}>
                <Select
                  options={options}
                  value={project}
                  onChange={newProject => setProject(newProject)}
                />
            </Box>

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
                        onElementsClick={handleBarClick}
                    />
                </Box>
            )}
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
