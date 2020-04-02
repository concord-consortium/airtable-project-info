import React, {useState} from 'react';
import {
    useViewport,
    useRecords,
    Box,
    Select,
    RecordCardList,
} from '@airtable/blocks/ui';

import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import ProjectBudgetGraph from './project-budget-graph';

// Add the css for react grid layout
import './grid-styles';
import './resize-styles.js';

export default function ProjectDashboard({projects, goalsTableOrView}) {
  const [projectId, setProjectId] = useState(null);
  const viewport = useViewport();

  const queryResult = goalsTableOrView.selectRecords();
  const goals = useRecords(queryResult);

  let options = [{value: null, label: "Choose a Project"}];
  if(projects) {
    for(let record of projects){
      options.push({value: record.id, label: record.primaryCellValueAsString});
    }
  }

  let filteredProjects = projects;
  let filteredGoals = goals;
  if(projectId && projects) {
    filteredProjects = [projects.find(record => record.id === projectId)];
    filteredGoals = goals.filter(record => {
      let projectCell = record.getCellValue("Project");
      console.log(projectCell);
      return projectCell && projectCell.length === 1 && projectCell[0].id === projectId;
    });
  }

  // layout is an array of objects, see the demo for more complete usage
  const layouts = {
    lg: [
      {i: 'a', x: 0, y: 0, w: 2, h: 4, minW: 2},
      {i: 'b', x: 2, y: 0, w: 2,  h: 4 },
    ]};

  return (
    <Box>
      <Box width="33.33%" padding={1} marginBottom={0}>
          <Select
            options={options}
            value={projectId}
            onChange={newProjectId => setProjectId(newProjectId)}
          />
      </Box>
      {projectId && (
        <ResponsiveGridLayout width={viewport.size.width} className="layout" layouts={layouts}
          rowHeight={50}
          breakpoints={{lg: 1200, md: 768, sm: 480, xs: 0}}
          cols={{lg: 8, md: 6, sm: 4, xs: 2}}>
          <div key="a">
            <ProjectBudgetGraph records={filteredProjects}/>
          </div>
          <div key="b">
            <RecordCardList records={filteredGoals}/>
          </div>
        </ResponsiveGridLayout>
      )}
    </Box>
  );
}
