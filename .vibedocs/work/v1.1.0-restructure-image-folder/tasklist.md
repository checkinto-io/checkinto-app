# Release Tasklist – v1.1.0-restructure-image-folder
This document outlines all the tasks to work on to delivery this particular version, grouped by phases.

| Status |      |
|--------|------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Completed |


## Phase 1: Infrastructure Setup

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| T001 | Create New Folder Structure | Create `/static/images/groups/codingwithai/group/`, `/events/`, `/talent/` directories | None | 🟢 Completed | AGENT |
| T002 | Setup Vite Aliases | Add path aliases in vite.config.js for cleaner imports | None | 🟢 Completed | AGENT |
| T003 | Create Image Path Utilities | Create centralized utility functions for image path construction | T002 | 🟢 Completed | AGENT |

## Phase 2: File Migration

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| T004 | Move Meetup Logo | Move `coding-with-ai-meetup.png` from `/static/images/meetup/` to `/static/images/groups/codingwithai/group/` | T001 | 🟢 Completed | AGENT |
| T005 | Move Talent Photo | Move `marcelo-lewin.png` from `/static/images/presenters/` to `/static/images/groups/codingwithai/talent/` | T001 | 🟢 Completed | AGENT |
| T006 | Remove Old Directories | Remove empty `/static/images/meetup/` and `/static/images/presenters/` directories | T004, T005 | 🟢 Completed | AGENT |

## Phase 3: Code Updates

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| T007 | Update Database Helper | Modify `/src/lib/database.ts` image path functions to use new group-based structure | T003 | 🔴 Not Started | AGENT |
| T008 | Update WelcomeScreen Component | Change image src in `/src/lib/screens/WelcomeScreen.svelte` to use new path structure | T007 | 🔴 Not Started | AGENT |
| T009 | Update CheckinForm Component | Change image src in `/src/lib/screens/CheckinForm.svelte` to use new path structure | T007 | 🔴 Not Started | AGENT |
| T010 | Update ConfirmationScreen Component | Change image src in `/src/lib/screens/ConfirmationScreen.svelte` to use new path structure | T007 | 🔴 Not Started | AGENT |
| T011 | Update TypeScript Interfaces | Update any TypeScript interfaces that reference image paths (if applicable) | T007 | 🔴 Not Started | AGENT |

## Phase 4: Testing & Documentation

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| T012 | Test Image Loading | Verify all images load correctly in all three screens | T008, T009, T010 | 🔴 Not Started | AGENT |
| T013 | Test Mobile Responsiveness | Ensure image display works correctly on mobile devices | T012 | 🔴 Not Started | AGENT |
| T014 | Update Migration Documentation | Update migration docs to reflect new image folder structure | T012 | 🔴 Not Started | AGENT |
| T015 | Create Group Setup Guide | Document process for setting up images for new groups | T014 | 🔴 Not Started | AGENT |

## Phase 5: Maintenance Improvements

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| T016 | Environment-based Group Detection | Add utility to detect group from hostname/subdomain | T003 | 🔴 Not Started | AGENT |
| T017 | Image Path Constants | Create constants/enums for image paths to prevent typos | T003 | 🔴 Not Started | AGENT |
| T018 | TypeScript Path Mapping | Add TypeScript path mapping in tsconfig.json for better IDE support | T002 | 🔴 Not Started | AGENT |
| T019 | Performance Optimization | Implement image preloading or lazy loading if beneficial | T012 | 🔴 Not Started | AGENT |