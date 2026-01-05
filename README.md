# E-Commerce Admin Dashboard

A modern, server-side rendered (SSR) admin dashboard for managing products in an e-commerce system. Built with Next.js 16, MongoDB, and Cloudinary, this application provides administrators with a powerful interface to manage product catalogs, track sales analytics, and handle inventory.

## Features

- **Server-Side Rendering (SSR)**: Fast page loads and improved SEO with Next.js 16
- **Complete Product Management**: Full CRUD operations for products
- **Multi-Step Product Forms**: Intuitive wizard interface with Zod validation
- **Secure Image Upload**: Cloud storage integration with Cloudinary
- **Interactive Analytics**: Real-time sales and stock metrics with Recharts
- **Authentication & Authorization**: Secure JWT-based admin authentication
- **Dark Theme UI**: Modern, professional interface with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with connection pooling
- **Authentication**: Custom JWT authentication with bcrypt
- **Form Validation**: Zod schemas
- **Image Storage**: Cloudinary
- **Charts**: Recharts with shadcn/ui chart components
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── products/          # Product CRUD endpoints
│   │   └── upload/            # Image upload endpoint
│   ├── dashboard/             # Admin dashboard pages
│   │   ├── analytics/         # Analytics page
│   │   ├── products/          # Product management pages
│   │   └── settings/          # Settings page
│   └── login/                 # Login page
├── components/                # React components
│   ├── ui/                    # shadcn/ui components
│   ├── *-chart.tsx           # Chart components
│   ├── *-form.tsx            # Form components
│   └── *.tsx                 # Other components
├── lib/                       # Utilities and configurations
│   ├── auth.ts               # Authentication utilities
│   ├── cloudinary.ts         # Cloudinary integration
│   ├── mongodb.ts            # Database connection
│   ├── types.ts              # TypeScript types
│   └── validations.ts        # Zod schemas
├── scripts/                   # Database seeding scripts
│   ├── seed-admin.mjs        # Create demo admin
│   └── seed-products.mjs     # Seed sample products
└── proxy.ts                   # Middleware for route protection
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (Atlas or local)
- Cloudinary account

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ecommerce-admin-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Seed the database**

```bash
# Create demo admin (email: admin@demo.com, password: admin123)
node scripts/seed-admin.mjs

# Seed sample products
node scripts/seed-products.mjs
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Demo Credentials

- **Email**: admin@demo.com
- **Password**: admin123

## Key Features Explained

### Authentication System

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Protected routes using Next.js middleware
- Session management with 7-day expiration

### Product Management

- Multi-step form wizard for creating/editing products:
  1. Basic Info (name, description, category)
  2. Images (upload up to 5 images with Cloudinary)
  3. Pricing & Stock (price, SKU, inventory)
  4. Status (active, draft, archived)
- Real-time form validation with Zod
- Server-side validation on API routes

### Image Upload

- Secure upload to Cloudinary
- File type and size validation (max 5MB)
- Multiple image support with primary image designation
- Image preview and management in the form

### Analytics Dashboard

- Monthly sales and revenue trends (line chart)
- Stock levels by category (bar chart)
- Sales distribution by category (pie chart)
- Top selling products (horizontal bar chart)

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/session` - Get current session

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Upload

- `POST /api/upload` - Upload image to Cloudinary

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

Ensure all environment variables from `.env.local` are added to your Vercel project settings.

## Development Workflow

1. **Database Changes**: Update MongoDB collections and run migration scripts
2. **API Changes**: Modify route handlers in `app/api/`
3. **UI Changes**: Update components and pages
4. **Validation**: Update Zod schemas in `lib/validations.ts`

## Performance Optimizations

- Server-side rendering for fast initial page loads
- MongoDB connection pooling for efficient database queries
- Image optimization with Next.js Image component
- Proper caching headers on API routes

## Security Best Practices

- HTTP-only cookies for session management
- CSRF protection via SameSite cookie attribute
- Server-side validation for all inputs
- Secure password hashing with bcrypt
- Protected API routes with authentication middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue in the GitHub repository.

---

Built with Next.js 16, MongoDB, and Cloudinary
