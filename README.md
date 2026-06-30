# RFM Segmentation Interface
 
A React-based customer segmentation dashboard using RFM (Recency, Frequency, Monetary) analysis.

## 🎯 Features

- **5x5 RFM Grid**: Visual representation of customer segments based on Frequency (x-axis) and Monetary (y-axis) scores
- **Dynamic Filtering**: Filter customers by Recency, Frequency, and Monetary ranges using interactive sliders
- **Customer Selection**: Click grid cells to view and select individual customers
- **Bulk Actions**: Select all/deselect all customers within a segment
- **API Integration**: Submit selected customer IDs to `/api/selected-ids` endpoint

## 📊 Data Structure

The application uses `data.json` with 120 customer records:

```json
{
  "id": "CUS001",
  "recency": 5,        // Days since last purchase (1-250)
  "frequency": 42,     // Number of purchases (1-50)
  "monetary": 8750     // Total spend ($150-$9900)
}
```

## 🔢 RFM Score Calculation

- **Recency Score**: Lower days = Higher score (1-5, inverse percentile)
- **Frequency Score**: Higher purchases = Higher score (1-5, percentile-based)
- **Monetary Score**: Higher spend = Higher score (1-5, percentile-based)

Grid coordinates:
- **X-axis**: Frequency Score (1-5)
- **Y-axis**: Monetary Score (1-5)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI Components
- **Sonner** - Toast Notifications

## 📁 Project Structure

```
src/
├── components/
│   ├── rfm-app.tsx       # Main application container
│   ├── rfm-grid.tsx      # 5x5 segment grid
│   ├── rfm-filters.tsx   # Filter controls
│   └── customer-list.tsx # Customer selection list
├── lib/
│   ├── rfm-utils.ts      # RFM score calculations
│   └── api.ts            # Mock API functions
└── App.tsx               # Entry point
public/
└── data.json             # Customer dataset (120 records)
```

## 📝 API

### POST /api/selected-ids

Submits selected customer IDs (mock implementation - logs to console).

**Request:**
```json
{
  "ids": ["CUS001", "CUS002", "CUS003"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully submitted 3 customer IDs"
}
```

## 📄 License

MIT
