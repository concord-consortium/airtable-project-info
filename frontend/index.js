import {
    initializeBlock,
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
import ProjectBudgetGraph from './project-budget-graph';

const GlobalConfigKeys = {
    VIEW_ID: 'viewId',
};

function ProjectInfoBlock() {
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
          <ProjectBudgetGraph records={records}/>
      </Box>
  );
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

initializeBlock(() => <ProjectInfoBlock />);
