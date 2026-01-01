# Income Tracker

A modern web application for tracking monthly income with automatic tax and insurance deduction calculations. Features local Excel file storage for complete data privacy.

## Features

- **Dashboard**: Year-based overview of all income records
- **Income Tracking**: Track multiple income sources (e.g., primary income, side income)
- **Summary Statistics**: Automatic calculation of total gross, deductions, and net income
- **Monthly Data Table**: Detailed view of all income components
- **Visual Analytics**: Line chart showing monthly income trends
- **Automatic Calculations**: Auto-calculate social insurance deductions based on configurable rates
- **Manual Override**: Ability to manually enter all deduction values
- **Settings Page**: Configure default deduction rates
- **Excel Export/Import**: Save and load data as Excel files
- **Local Storage**: All data stored locally - no cloud account required
- **Bilingual Support**: German and English interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic theme switching
- **Duplicate Protection**: Warnings when adding entries for months that already have data

## Tech Stack

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Storage**: Local Excel files (xlsx library)
- **Charts**: Recharts

## Prerequisites

- Node.js 18+ installed
- A modern browser (Chrome, Edge, or Opera recommended for full save functionality)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Hermanhyl/PIA_Salary_Tracker.git
cd PIA_Salary_Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:4500** in your browser.

## Usage Guide

### Adding an Income Entry

1. On the dashboard, click **"Eintrag hinzufügen"** (Add Entry) or **"Add Entry"**
2. Select the month
3. Enter your income sources (ALG I, Side Income, etc.)
4. The gross salary is automatically calculated
5. Enter your income tax (this varies by tax class)
6. Toggle **"Auto-calculate deductions"** for automatic social insurance calculation
7. Optionally add notes
8. Review the preview showing total deductions and net income
9. Click **"Speichern"** (Save)

### Saving Your Data

- Click **"Speichern"** (Save) in the header to save to an Excel file
- If you loaded a file, it saves back to the same file
- If it's new data, you'll be prompted to choose a save location
- The Excel file includes a yearly summary with totals and averages

### Loading Existing Data

1. Click **"Laden"** (Load) in the header
2. Select an Excel file previously exported from this app
3. The data will be loaded and you can continue editing

### Configuring Deduction Rates

1. Click the **Settings** icon (gear) in the top right
2. Toggle **"Automatic Calculation"** on/off
3. Adjust the percentage rates for:
   - **Pension Insurance** - Default: 9.30%
   - **Health + Care Insurance** - Default: 9.00%
   - **Unemployment Insurance** - Default: 1.30%
4. Click **"Speichern"** (Save)

### Switching Language

Click the language button (DE/EN) in the header to switch between German and English.

## Excel File Structure

The exported Excel file includes:

| Column | Description |
|--------|-------------|
| Monat | Month name |
| ALG I (€) | Primary income |
| Nebeneinkommen (€) | Side income |
| Bruttogesamteinkommen (€) | Total gross income |
| Einkommenssteuer (€) | Income tax |
| Rentenversicherung (€) | Pension insurance |
| Kranken-/Pflegeversicherung (€) | Health/care insurance |
| Arbeitslosenversicherung (€) | Unemployment insurance |
| Gesamtabzüge (€) | Total deductions |
| Nettoeinkommen (€) | Net income |
| Bemerkungen | Notes |

Plus a summary section at the bottom with yearly totals and monthly averages.

## Browser Compatibility

| Browser | Save to Same File | Load Files |
|---------|-------------------|------------|
| Chrome | Yes | Yes |
| Edge | Yes | Yes |
| Opera | Yes | Yes |
| Firefox | Download only | Yes |
| Safari | Download only | Yes |

**Note**: Chrome, Edge, and Opera support the File System Access API, allowing you to save directly back to the file you loaded. Other browsers will download a new file each time you save.

## Default Insurance Rates (Germany)

The app comes pre-configured with German social insurance rates (employee portion):

- **Pension Insurance**: 9.30%
- **Health Insurance**: 7.30%
- **Care Insurance**: 1.70%
- **Combined Health + Care**: 9.00%
- **Unemployment Insurance**: 1.30%

**Note**: Income tax must be entered manually as it varies by tax class.

## Project Structure

```
pia-salary-tracker/
├── app/
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── settings/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── dashboard/           # Dashboard components
│   │   ├── add-edit-record-dialog.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── monthly-data-table.tsx
│   │   └── monthly-income-chart.tsx
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── storage/
│   │   └── excel-storage.ts # Excel file handling
│   ├── calculations.ts
│   ├── data-context.tsx
│   ├── language-context.tsx
│   ├── translations.ts
│   ├── types.ts
│   └── utils.ts
├── package.json
└── README.md
```

## Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### Port already in use
```bash
npm run kill-port
npm run dev
```

### Build errors
- Make sure all dependencies are installed: `npm install`
- Delete `.next` folder and rebuild: `rm -rf .next && npm run dev`
- Check that Node.js version is 18 or higher: `node --version`

## Privacy

All data is stored locally in Excel files on your computer. No data is sent to any server or cloud service.

## License

This project is provided as-is for personal use.
