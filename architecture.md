app/
├── api/
│ ├── jobs/
│ │ └── actions.ts
│ ├── metrics/
│ │ └── route.ts              
│ └── stripe/
│     ├── actions.ts
│     └── webhook/
│         └── route.ts
├── components/
│ ├── common/
│ │ ├── buttons/
│ │ │ └── copy-link-button.tsx
│ │ └── forms/
│ │     ├── apply-method-section.tsx
│ │     ├── apply-section.tsx
│ │     ├── benefits-section.tsx
│ │     ├── location-selector.tsx
│ │     └── logo-upload.tsx
│ ├── jobs/
│ │ ├── cards/
│ │ │ ├── job-card.tsx
│ │ │ └── job-listings-client.tsx
│ │ ├── create-job-form.tsx
│ │ ├── forms/
│ │ │ └── job-filters.tsx
│ │ ├── manage-job-form.tsx
│ │ ├── shared/
│ │ │ ├── job-benefits.tsx
│ │ │ ├── job-header.tsx
│ │ │ └── job-metadata.tsx
│ │ └── tracking/              
│ │     ├── view-tracker.tsx
│ │     └── page-tracker.tsx
│ ├── layout/
│ │ └── navigation.tsx
│ └── ui/
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── tabs.tsx
│   └── textarea.tsx
├── favicon.ico
├── fonts/
│ ├── GeistMonoVF.woff
│ └── GeistVF.woff
├── globals.css
├── jobs/
│ ├── [id]/
│ │ └── page.tsx
│ ├── create/
│ │ └── page.tsx
│ ├── manage/
│ │ ├── [token]/
│ │ │ └── page.tsx
│ │ └── page.tsx
│ ├── success/
│ │ └── page.tsx
├── metrics/                  
│ └── page.tsx
├── layout.tsx
├── lib/
│ ├── config/
│ │ ├── constants.ts
│ │ └── theme.ts
│ ├── email.ts
│ ├── services/
│ │ ├── jobs.ts
│ │ └── stripe.ts
│ ├── supabase.ts
│ ├── utils/
│ │ ├── formatting.ts
│ │ └── validation.ts
│ └── utils.ts
├── page.tsx
└── types/
    ├── api.ts
    ├── forms.ts
    ├── index.ts
    └── jobs.ts