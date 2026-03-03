# Shiply Frontend

A modern, responsive logistics platform frontend built with React, Vite, and Framer Motion.

## Features

- 🚀 Fast development with Vite
- 🎨 Beautiful UI with custom design system
- 🔐 JWT authentication
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion
- 🎯 Role-based routing (Customer/Driver)
- 📦 Package tracking and management

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Custom CSS** - Styling with CSS variables

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see backend documentation)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                    # API client and interceptors
│   └── apiClient.js       # Axios instance with auth
├── components/             # Reusable components
│   ├── Layout.jsx         # App layout wrapper
│   ├── Navbar.jsx         # Navigation bar
│   └── ProtectedRoute.jsx # Route protection
├── context/                # React context
│   └── AuthContext.jsx    # Authentication state
├── pages/                  # Page components
│   ├── Landing.jsx        # Landing page
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # Registration page
│   ├── SendPackage.jsx    # Create shipment (Customer)
│   ├── DriverDashboard.jsx # Driver dashboard
│   └── MyPackages.jsx     # Package tracking
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## User Roles

### Customer
- Send packages
- Track shipments
- View package history
- Cancel pending shipments

### Driver
- View available shipments
- Accept delivery jobs
- Update shipment status
- Manage active deliveries

## API Integration

The frontend connects to the backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Shipments
- `POST /api/shipment/create` - Create shipment (Customer)
- `GET /api/shipment/my-packages` - Get user's packages (Customer)
- `GET /api/shipment/available` - Get available shipments (Driver)
- `GET /api/shipment/my-deliveries` - Get driver's deliveries (Driver)
- `POST /api/shipment/:id/accept` - Accept shipment (Driver)
- `PUT /api/shipment/:id/status` - Update status (Driver)
- `PUT /api/shipment/:id/cancel` - Cancel shipment (Customer)

## Design System

The app uses a custom design system with:

- **Primary Colors**: Dark theme with gradient accents
- **Typography**: Syne (headings) + DM Sans (body)
- **Components**: Glass-morphism cards, animated buttons
- **Animations**: Smooth page transitions and micro-interactions

## Features by Page

### Landing Page
- Hero section with animated cards
- Feature highlights
- Statistics showcase
- Call-to-action sections

### Authentication
- Login and registration forms
- Form validation
- Error handling
- Visual feedback

### Send Package (Customer)
- Multi-step form
- Address input
- Package details
- Pricing information
- Success confirmation with tracking number

### Driver Dashboard
- Available shipments grid
- Active deliveries management
- Status updates
- Earnings tracking

### My Packages
- Package list with search
- Status filtering
- Timeline visualization
- Tracking information
- Cancellation option

## Environment Variables

- `VITE_API_URL` - Backend API base URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
