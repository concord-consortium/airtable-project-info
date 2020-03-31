import React, {useState} from 'react';
import {
    useViewport,
    Box,
    Select,
} from '@airtable/blocks/ui';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import ProjectBudgetGraph from './project-budget-graph';

// Add the css for react grid layout
import './grid-styles';
import './resize-styles.js';

export default function ProjectDashboard({records}) {
  const [project, setProject] = useState(null);
  const viewport = useViewport();

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

  // layout is an array of objects, see the demo for more complete usage
  const layouts = {
    lg: [
      {i: 'a', x: 0, y: 0, w: 2, h: 4, minW: 2},
      {i: 'b', x: 2, y: 0, w: 1,  h: 2 },
      {i: 'c', x: 3, y: 0, w: 1,  h: 2 },
      {i: 'd', x: 4, y: 0, w: 1,  h: 2 },
      {i: 'e', x: 5, y: 0, w: 1,  h: 2 }
    ]};

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
        <ResponsiveGridLayout width={viewport.size.width} className="layout" layouts={layouts}
          rowHeight={50}
          breakpoints={{lg: 1200, md: 768, sm: 480, xs: 0}}
          cols={{lg: 8, md: 6, sm: 4, xs: 2}}>
          <div key="a">
            <ProjectBudgetGraph records={projects}/>
          </div>
          <div key="b">Cell B</div>
          <div key="c">Cell C</div>
          <div key="d">Cell D</div>
          <div key="e">Cell E</div>
        </ResponsiveGridLayout>
      )}
    </Box>
  );
}
