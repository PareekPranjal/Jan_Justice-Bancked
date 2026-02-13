# LegalHub Backend API

Express.js and MongoDB backend for the LegalHub application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string if needed

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get job by ID |
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Query Parameters for GET /api/jobs

- `department` - Filter by department
- `company` - Filter by company name
- `employmentType` - Filter by employment type

### Example Request

Create a new job:
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Legal Associate",
    "company": "LexIsis Legal Partners",
    "department": "Corporate Law",
    "description": "Experienced legal professional needed",
    "employmentType": "Full-time"
  }'
```

## Database Schema

### Job Model

```javascript
{
  title: String (required),
  company: String (required),
  department: String (required),
  description: String (required),
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: String (default: 'INR')
  },
  experienceRequired: {
    min: Number,
    max: Number
  },
  skills: [String],
  employmentType: String (enum: Full-time, Part-time, Contract, Internship),
  isActive: Boolean (default: true),
  applicationDeadline: Date,
  contactEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   └── jobController.js  # Job CRUD operations
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling middleware
│   ├── models/
│   │   └── Job.js            # Job schema
│   ├── routes/
│   │   └── jobRoutes.js      # Job routes
│   └── server.js             # Express app entry point
├── .env                       # Environment variables
├── .env.example              # Example environment file
├── package.json
└── README.md
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## MongoDB Setup

### Local MongoDB
If you have MongoDB installed locally, it will connect to `mongodb://localhost:27017/legalhub`

### MongoDB Atlas (Cloud)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/legalhub
   ```

## Adding Sample Data

You can use this script to add sample jobs to your database:

```javascript
// Run in MongoDB shell or create a seed script
db.jobs.insertMany([
  {
    title: "Senior Legal Associate",
    company: "LexIsis Legal Partners",
    department: "Corporate Law",
    description: "We are seeking an experienced Senior Legal Associate with 5-7 years of experience in Corporate Litigation and Mergers & Acquisitions.",
    employmentType: "Full-time",
    isActive: true
  },
  {
    title: "Patent Attorney",
    company: "High Court of Bombay",
    department: "IP Rights",
    description: "Looking for a registered Patent Attorney to assist with drafting patent specifications and handling IP portfolio management.",
    employmentType: "Full-time",
    isActive: true
  }
]);
```
