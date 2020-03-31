import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    useSettingsButton,
    ViewPickerSynced,
    Box,
    Select,
    SelectSynced,
    FormField,
} from '@airtable/blocks/ui';
import React, {useState, useEffect} from 'react';
import ProjectBudgetGraph from './project-budget-graph';

const GlobalConfigKeys = {
    VIEW_ID: 'viewId',
    MODE: 'mode',
};

function ProjectInfoBlock() {
  const base = useBase();
  const globalConfig = useGlobalConfig();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useSettingsButton(() => setIsSettingsVisible(!isSettingsVisible));

  const table = base.getTableByName("Project Budgets");
  const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);
  const view = table.getViewByIdIfExists(viewId);

  const mode = globalConfig.get(GlobalConfigKeys.MODE);

  const allRecords = useRecords(view);

  // If there is no view set, then show the settings automatically
  useEffect(() => {
    if (!view) {
      setIsSettingsVisible(true);
    }
  }, [view])

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
          {mode === "dashboard" && (
            <ProjectDashboard records={allRecords}/>
          )}
          {mode === "budget-graph" && (
            <ProjectBudgetGraph records={allRecords}/>
          )}
      </Box>
  );
}

function ProjectDashboard({records}) {
  const [project, setProject] = useState(null);

  let options = [{value: null, label: "Choose a Project"}];
  if(records) {
    for(let record of records){
      options.push({value: record.id, label: record.primaryCellValueAsString});
    }
  }

  let projects = records;
  if(project && records) {
    projects = [records.find(record => record.id === project)];
  }

  return (
    <Box>
      <Box width="33.33%" padding={1} marginBottom={0}>
          <Select
            options={options}
            value={project}
            onChange={newProject => setProject(newProject)}
          />
      </Box>
      {project && (
        <ProjectBudgetGraph records={projects}/>
      )}
    </Box>
  );
}

function Settings({table}) {
    const modeOptions = [
      { value: "dashboard", label: "Project Dashboard"},
      { value: "budget-graph", label: "Project Budget Graph"}
    ];

    return (
        <Box display="flex" padding={3} borderBottom="thick">
            <FormField label="View" width="33.33%" paddingX={1} marginBottom={0}>
                <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} />
            </FormField>
            <FormField label="Mode" width="33.33%" paddingX={1} marginBottom={0}>
                <SelectSynced options={modeOptions} globalConfigKey={GlobalConfigKeys.MODE} />
            </FormField>
        </Box>
    );
}

initializeBlock(() => <ProjectInfoBlock />);
