# ScribeSync - Customer Data Pipeline Automation

A web application for solo founders to automate customer data import, cleaning, and create unified customer profiles, powered by Remix.

## 🚀 Features

### ✅ Implemented Core Features

1. **Automated Data Import & Cleaning**
   - CSV file upload with validation
   - Automatic data cleaning and standardization
   - Duplicate detection and handling
   - Preview before import with error reporting
   - Support for custom field mapping

2. **Unified Customer Profile Builder**
   - Comprehensive customer database
   - 360-degree view of customer interactions
   - Custom fields support
   - Search and filtering capabilities
   - Pagination for large datasets

3. **Actionable Task Generation**
   - Automatic task creation based on customer events
   - Configurable automation rules
   - Task management with due dates
   - Overdue task tracking
   - Manual task creation

### 🎨 Design System

- **Colors**: Custom CSS variables following PRD specifications
- **Typography**: Display, heading, and body text styles
- **Components**: Card, Button, Input, DataTable, Modal, AppShell
- **Layout**: 12-column fluid grid with 24px gutters
- **Motion**: Smooth transitions with cubic-bezier easing
- **Responsive**: Mobile-first design approach

## 🛠 Tech Stack

- **Framework**: Remix (Full-stack React framework)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Custom component library
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **File Processing**: CSV parsing with validation
- **Task Automation**: Node-cron for scheduled tasks

## 📊 Database Schema

### Core Entities

- **Customer**: Customer profiles with contact info and custom fields
- **Interaction**: Customer touchpoints and activity history
- **Task**: Automated and manual tasks with due dates
- **DataSource**: Configuration for data import sources
- **CustomerImport**: Import history and statistics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scribesync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database connection:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/scribesync"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── ui/              # Design system components
│   └── AppShell.tsx     # Main layout component
├── lib/                 # Shared utilities
│   └── db.server.ts     # Database connection
├── routes/              # Remix routes
│   ├── _index.tsx       # Dashboard
│   ├── customers._index.tsx  # Customer management
│   ├── import._index.tsx     # Data import
│   ├── tasks._index.tsx      # Task management
│   └── api.customers.tsx     # Customer API
├── utils/               # Utility functions
│   ├── data-cleaning.server.ts    # CSV processing
│   ├── task-automation.server.ts  # Task automation
│   └── cn.ts            # Class name utility
├── root.tsx             # Root component
└── tailwind.css         # Global styles

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Sample data
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 📈 Key Features Walkthrough

### 1. Dashboard
- Real-time statistics and KPIs
- Customer source distribution charts
- Recent activity feed
- Quick access to key metrics

### 2. Customer Management
- Comprehensive customer database
- Advanced search and filtering
- Bulk operations support
- Customer profile views

### 3. Data Import
- Drag-and-drop CSV upload
- Automatic data validation and cleaning
- Preview before import
- Error reporting and handling
- Import history tracking

### 4. Task Automation
- Rule-based task creation
- Scheduled task processing
- Manual task management
- Overdue task alerts
- Automation rule configuration

## 🔄 Task Automation Rules

The system includes several pre-configured automation rules:

1. **New Lead Follow-up**: Creates tasks for new website leads
2. **Referral Welcome**: Welcome tasks for referral customers
3. **Purchase Follow-up**: Follow-up tasks after purchases
4. **Inactivity Check**: Weekly checks for inactive customers

## 🎯 Business Model

- **Type**: Subscription-based SaaS
- **Pricing Tiers**:
  - Free: Limited imports and basic features
  - Pro ($29/mo): Higher volumes and advanced automation
  - Business ($79/mo): Team features and priority support

## 🔐 Security Features

- Input validation and sanitization
- SQL injection prevention via Prisma
- File upload restrictions
- Error handling and logging

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel
- Netlify
- Railway
- Heroku
- Self-hosted with Docker

## 📝 License

This project is part of the ScribeSync PRD implementation.

## 🤝 Contributing

This is a complete implementation of the ScribeSync PRD. The codebase follows best practices and is ready for production use.

---

**ScribeSync** - Automate your customer data pipeline and gain a unified view. 🚀
