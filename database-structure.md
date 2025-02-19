# DisñoJobs Database Structure

## Tables

### job_listings

Main table that stores all job postings.

| Column                   | Type                  | Required | Description                                       |
| ------------------------ | --------------------- | -------- | ------------------------------------------------- |
| id                       | BIGINT                | Yes      | Primary key, auto-incrementing                    |
| title                    | TEXT                  | Yes      | Job title                                         |
| company                  | TEXT                  | Yes      | Company name                                      |
| company_email            | TEXT                  | Yes      | Company email for management                      |
| contact_name             | TEXT                  | No       | Name of the contact person                        |
| company_logo             | TEXT                  | No       | URL to company logo                               |
| description              | TEXT                  | Yes      | Job description                                   |
| location                 | TEXT                  | No       | Job location                                      |
| job_type                 | job_type_enum         | Yes      | One of: remote, hybrid, onsite                    |
| experience_level         | experience_level_enum | Yes      | One of: entry, junior, mid, senior, manager, lead |
| contract_type            | contract_type_enum    | Yes      | One of: fulltime, parttime, internship, freelance |
| salary_range             | TEXT                  | No       | Salary range (e.g. "30-40k", "40-50k", "100k+")   |
| is_active                | BOOLEAN               | No       | Whether the job is active (defaults to false)     |
| management_token         | TEXT                  | Yes      | UUID for job management                           |
| stripe_payment_id        | TEXT                  | No       | Stripe payment ID                                 |
| created_at               | TIMESTAMPTZ           | No       | Creation timestamp (auto-set)                     |
| activated_at             | TIMESTAMPTZ           | No       | When the job was activated                        |
| application_method_type  | TEXT                  | Yes      | How to apply: 'email' or 'url'                    |
| application_method_value | TEXT                  | Yes      | Email or URL for applications                     |

### job_benefits

Related table that stores benefits for each job posting.

| Column       | Type    | Required | Description                                       |
| ------------ | ------- | -------- | ------------------------------------------------- |
| id           | INTEGER | Yes      | Primary key, auto-incrementing                    |
| job_id       | BIGINT  | Yes      | Foreign key to job_listings                       |
| benefit_name | TEXT    | Yes      | Name of the benefit                               |
| is_custom    | BOOLEAN | No       | Whether it's a custom benefit (defaults to false) |

### job_events

Table that stores all tracking events.

| Column     | Type        | Required | Description                                 |
| ---------- | ----------- | -------- | ------------------------------------------- |
| id         | BIGINT      | Yes      | Primary key, auto-incrementing              |
| job_id     | BIGINT      | No       | Foreign key to job_listings (nullable)      |
| event_type | TEXT        | Yes      | Type of event (view, apply_click, etc)      |
| source     | TEXT        | No       | Source of the event (defaults to 'direct')  |
| created_at | TIMESTAMPTZ | No       | When the event occurred (defaults to NOW()) |

## Enums

### job_type_enum

- remote
- hybrid
- onsite

### experience_level_enum

- entry
- junior
- mid
- senior
- manager
- lead

### contract_type_enum

- fulltime
- parttime
- internship
- freelance

### event_type (CHECK constraint)

- view
- apply_click
- homepage_view
- create_job_view
- job_submit

## Indexes

- `job_listings_is_active_idx` on `job_listings(is_active)`
- `job_benefits_job_id_idx` on `job_benefits(job_id)`
- `job_events_job_id_idx` on `job_events(job_id)`
- `job_events_type_idx` on `job_events(event_type)`
- `job_events_created_at_idx` on `job_events(created_at)`

## Relationships

- `job_benefits.job_id` references `job_listings(id)` with CASCADE delete
- `job_events.job_id` references `job_listings(id)` with CASCADE delete (allows NULL values)

## Notes

1. All salary ranges are predefined in the application code
2. Timestamps are stored with timezone information
3. The `management_token` is used for job editing without authentication
4. Jobs are inactive by default until payment is confirmed
5. Company logo is stored as a URL, actual images are in Cloudinary
6. Events are tracked for analytics purposes with minimal overhead
7. Event tracking uses a separate table for better performance
8. General events (like homepage views) are tracked with a NULL job_id
