# IPTV Dashboard

A comprehensive React-based dashboard for managing IPTV clients, subscriptions, and leads with WhatsApp messaging integration.

## Features

- Client management with IPTV line assignment
- Subscription tracking and renewal management
- Lead pipeline with Kanban view
- WhatsApp messaging for reminders and renewals (in French)
- Mass messaging capabilities
- Data persistence with Supabase

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Update the `.env` file with your Supabase credentials:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_project_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Create database tables in Supabase SQL Editor:

   Copy and execute the SQL script from `supabase-schema.sql` in your Supabase project's SQL Editor. This will create all necessary tables with proper structure and sample data.

   The script includes:
   - `clients` table (with IPTV details and payment history)
   - `leads` table (with contact and status information)
   - `subscriptions` table (with subscription details and expiration tracking)
   - Sample data for testing
   - Performance indexes
   - Row Level Security policies

5. Run the development server:
   ```bash
   npm start
   ```

## Usage

- **Dashboard**: Overview of clients, subscriptions, and leads
- **Client Management**: Add/edit clients and assign IPTV lines
- **IPTV Manager**: View and manage subscriptions, send reminders
- **Lead Pipeline**: Kanban view for managing sales leads
- **Settings**: Configure integrations and preferences

## WhatsApp Integration

The app includes WhatsApp messaging for:
- Subscription expiration reminders
- Renewal notifications
- Custom mass messaging

Messages are sent in French and include relevant subscription details.

## Build

```bash
npm run build
```

## Technologies

- React 19.2.3
- Supabase (database)
- Tailwind CSS (styling)
- Lucide React (icons)
- WhatsApp Web API (messaging)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
