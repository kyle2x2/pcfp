# Data Contracts (v6.2)

## Profile
- `id` (string, uuid), `name` (string), `schemaVersion` (1)
- `settings` (see below)
- `schedule` (optional – either `startDate` or month boundaries with `totalWeeks`)
- `masterCostCodes` (array of `{ code, name }`)
- `modules` (object; module-specific data like `paymentPlanner`)

## Settings
- `hst`, `holdback`, `markup`, `depositPercent`, `depositFloorPercentOfContractPreHST`
- `ownerPdfOptions.{showCashFlow, showTimeline}`

## Schedule
- `startDate` (ISO) or manual `monthBoundaries`
- `totalWeeks` (int)
- `monthBoundaries[]` with `{ month, year, startWeek, weeks }`

### Money
- All money stored as **cents** (integers).

### Dates
- ISO `YYYY-MM-DD`.
