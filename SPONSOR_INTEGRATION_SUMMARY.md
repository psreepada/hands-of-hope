# School Logo and Sponsor Integration Summary

## Overview
Added functionality to the create branch form to collect school logos and automatically create sponsor entries for display in the homepage sponsor carousel.

## Changes Made

### 1. Database Schema (`sponsors_table_schema.sql`)
- Created new `sponsors` table with the following structure:
  - `id` (primary key)
  - `name` (sponsor/school name)
  - `logo_url` (image URL)
  - `sponsor_type` (school, organization, company)
  - `branch_id` (optional link to branch)
  - `website_url` (optional)
  - `description` (optional)
  - `is_active` (boolean for visibility)
  - `display_order` (for carousel ordering)
  - `created_at`, `updated_at` (timestamps)
- Added RLS policies for public read and authenticated write access
- Migrated existing hardcoded sponsors to database

### 2. TypeScript Types (`types/database.ts`)
- Added `Sponsor` interface matching the database schema
- Updated `BranchFormData` interface to include `schoolLogoUrl` field

### 3. Create Branch Form (`app/super-admin/page.tsx`)
- Added state management for school logo:
  - `schoolLogoFile` - stores selected file
  - `schoolLogoPreview` - stores preview URL
  - Updated `branchFormData` to include `school_logo_url`
- Added school logo upload functions:
  - `handleSchoolLogoChange()` - validates and sets logo file
  - `removeSchoolLogo()` - removes selected logo
- Added school logo upload UI section in the form:
  - Required field with image preview
  - File validation (type and size)
  - Clear messaging about automatic sponsor creation
- Updated `handleCreateBranch()` function:
  - Added validation for required school logo
  - Added school logo upload to Supabase storage
  - Added automatic sponsor creation after branch creation
  - Updated form reset to clear school logo fields

### 4. Sponsor Carousel (`components/sponsor-carousel.tsx`)
- Replaced hardcoded sponsor list with database-driven approach
- Added state management:
  - `sponsors` - array of sponsor data from database
  - `loading` - loading state indicator
- Added `fetchSponsors()` function to retrieve active sponsors ordered by `display_order`
- Updated rendering to use `sponsor.logo_url` and `sponsor.id` instead of hardcoded values
- Added loading and empty states for better UX

## Workflow
1. Admin creates a new branch via the super-admin form
2. Admin uploads school logo (required field)
3. System uploads logo to Supabase storage
4. System creates branch record
5. System automatically creates sponsor entry with:
   - Name: school name from form
   - Logo: uploaded school logo URL
   - Type: 'school'
   - Branch ID: newly created branch ID
   - Active: true
6. New sponsor appears in homepage carousel automatically

## Database Migration Required
Before using this feature, run the `sponsors_table_schema.sql` script in your Supabase SQL Editor to create the sponsors table and migrate existing sponsor data.

## Benefits
- Streamlined workflow for adding schools to sponsor carousel
- Consistent data management through database
- Automatic sponsor creation reduces manual work
- Maintains existing sponsor carousel functionality
- Easy to extend for other sponsor types in the future
