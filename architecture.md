app/
├── api/
│ ├── jobs/
│ │ └── actions.ts
│ └── stripe/
│     ├── actions.ts
│     └── webhook/
│         └── route.ts
├── components/
│ ├── jobs/
│ │ ├── cards/
│ │ │ ├── job-card.tsx
│ │ │ └── job-listings-client.tsx
│ │ ├── create-job-form.tsx
│ │ ├── forms/
│ │ │   ├── apply-method-section.tsx
│ │ │   ├── benefits-section.tsx
│ │ │   ├── job-filters.tsx
│ │ │   ├── job-form-fields.tsx
│ │ │   ├── location-selector.tsx
│ │ │   └── logo-upload.tsx
│ │ ├── manage-job-form.tsx
│ │ └── shared/
│ │     ├── apply-section.tsx
│ │     ├── copy-link-button.tsx
│ │     ├── job-benefits.tsx
│ │     ├── job-header.tsx
│ │     └── job-metadata.tsx
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
│   ├── skeleton.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   └── use-toast.tsx
├── favicon.ico
├── fonts/
│ ├── GeistMonoVF.woff
│ └── GeistVF.woff
├── globals.css
├── jobs/
│ ├── [id]/
│ │ ├── error.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ ├── create/
│ │ └── page.tsx
│ ├── manage/
│ │ ├── [token]/
│ │ │ ├── error.tsx
│ │ │ ├── loading.tsx
│ │ │ └── page.tsx
│ │ └── page.tsx
│ ├── success/
│ │ ├── error.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
├── layout.tsx
├── lib/
│ ├── config/
│ │ └── constants.ts
│ ├── email.ts
│ ├── supabase.ts
│ ├── translations/
│ │ ├── es.ts
│ │ └── utils.ts
│ ├── utils/
│ │ ├── formatting.ts
│ │ ├── notifications.ts
│ │ └── validation.ts
│ └── utils.ts
├── page.tsx
└── types/
    ├── forms.ts
    ├── index.ts
    └── jobs.ts