# Project info block

This is multi purpose block.

It has a mode setting to show:
- a bar chart of project budgets
- a dashboard focused on a single project

The bar chart is custom tailored to stack various fields from the Project Budgets
table. Each Project (a record in the table) is represented by a set of bars.

The dashboard uses react-grid-layout and currently just includes the bar chart
from above filtered to only show the selected project.

## How to develop this block

1. Make a copy of the Portfolio Base

2. Use an existing instance of this block in your copy or
   [Create a new block](https://airtable.com/developers/blocks/guides/hello-world-tutorial#create-a-new-block),
   You don't need to select a template when creating a new block doing this.

3. Check out this repository locally

4. Install the Airtable block command.  The tutorial above provides guidance,
   and the UI in Airtable provides guidance when making the new block.

5. If this is the first time you need to change the chrome setting to allow localhost
   unsecure https access. The Airtable UI provides guidance on this.
