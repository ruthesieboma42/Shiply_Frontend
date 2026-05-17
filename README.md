# Shiply Frontend

A modern, responsive logistics platform frontend built with React, Vite, and Framer Motion.

## Features

-  Fast development with Vite
-  Beautiful UI with custom design system
-  JWT authentication
-  Fully responsive design
-  Smooth animations with Framer Motion
-  Role-based routing (Customer/Driver)
-  Package tracking and management

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Custom CSS** - Styling with CSS variables




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

## What I Learned
- Structuring data flow across multiple UI layers
- Handling shared state across different user roles
- Designing reusable components for scalable frontend systems
- Organizing frontend logic for real-time-like experiences

