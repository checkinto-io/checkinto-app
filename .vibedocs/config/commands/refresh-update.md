---
command: `:vd refresh update`
description: Refreshes the memory about the current project of the AI AGENT and the AGENT will update the plan.md and prd.md files with any changes.
---

- Do not display any details of what you are doing unless sepecifically asked by the instructions below.

# ********************
# REFRESHING MY MEMORY
# ********************

- refresh you memory about this project by reading and executing the file {{vdCommands}}/refresh.md

# ******************
# UPDATING DOCUMENTS
# ******************
- next, read the following documents:
    - {{vdPlanPhase}}/plan.md.
    - {{vdPlanPhase}}/prd.md
- If either of the documents you just read need to be updated:
    - create a copy of the document
    - add "_mmddyyyy" to the filename (e.g plan_08012023.md" if you updated plan.md on August 1, 2023 )
    - save the new copy in the same folder.
    - update the document in the following manner
        - Add new information you learned about the project.
        - Remove any outdated content no longer true for the project (e.g. we deleted a table.  We can remove that table from the documentation)
        - Make sure the entire document is fully factual and accurate with the current project.

# *************
# OLD DOCUMENTS
# *************
- If you created / updated any new documents in {{vdPlanPhase}}, do the following:
    - Create a folder named "old", if it does not exists in {{vdPlanPhase}}
    - Move the old files to that folder.
- List the new documents and ask the USER to check them.
- If you have questions for the updates, ask the USER.