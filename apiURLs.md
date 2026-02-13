# LegalHub API Endpoints

Base URL: `http://localhost:5001`

---

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status check |

---

## Jobs (`/api/jobs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| POST | `/api/jobs` | Create a job (multipart: `pdf`, `image`) |
| GET | `/api/jobs/:id` | Get job by ID |
| PUT | `/api/jobs/:id` | Update job (multipart: `pdf`, `image`) |
| DELETE | `/api/jobs/:id` | Delete job |

### Test URLs
```
GET    http://localhost:5001/api/jobs
POST   http://localhost:5001/api/jobs
GET    http://localhost:5001/api/jobs/682abc123def456
PUT    http://localhost:5001/api/jobs/682abc123def456
DELETE http://localhost:5001/api/jobs/682abc123def456
```

---

## Courses (`/api/courses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Create a course |
| GET | `/api/courses/:id` | Get course by ID |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Test URLs
```
GET    http://localhost:5001/api/courses
POST   http://localhost:5001/api/courses
GET    http://localhost:5001/api/courses/682abc123def456
PUT    http://localhost:5001/api/courses/682abc123def456
DELETE http://localhost:5001/api/courses/682abc123def456
```

---

## Appointments (`/api/appointments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Create an appointment |
| GET | `/api/appointments/availability/:date` | Get available slots for a date |
| GET | `/api/appointments/confirmation/:confirmationNumber` | Get appointment by confirmation number |
| GET | `/api/appointments/:id` | Get appointment by ID |
| PUT | `/api/appointments/:id` | Update appointment |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| DELETE | `/api/appointments/:id` | Cancel appointment |

### Test URLs
```
GET    http://localhost:5001/api/appointments
POST   http://localhost:5001/api/appointments
GET    http://localhost:5001/api/appointments/availability/2026-02-10
GET    http://localhost:5001/api/appointments/confirmation/CONF-12345
GET    http://localhost:5001/api/appointments/682abc123def456
PUT    http://localhost:5001/api/appointments/682abc123def456
PUT    http://localhost:5001/api/appointments/682abc123def456/status
DELETE http://localhost:5001/api/appointments/682abc123def456
```

---

## Stats (`/api/stats`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get dashboard statistics |

### Test URLs
```
GET    http://localhost:5001/api/stats
```

---

## Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| DELETE | `/api/users/:id` | Delete user |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/profile` | Create or update profile |
| GET | `/api/users/profile/:email` | Get user profile by email |

### User Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/stats/:email` | Get user stats by email |

### Saved Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/saved-jobs/:email` | Get saved jobs by email |
| POST | `/api/users/saved-jobs` | Save a job |
| DELETE | `/api/users/saved-jobs/:savedJobId` | Unsave a job |

### Course Enrollments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/enrollments/:email` | Get enrollments by email |
| POST | `/api/users/enrollments` | Enroll in a course |
| PUT | `/api/users/enrollments/:enrollmentId` | Update course progress |

### Test URLs
```
GET    http://localhost:5001/api/users
DELETE http://localhost:5001/api/users/682abc123def456

POST   http://localhost:5001/api/users/profile
GET    http://localhost:5001/api/users/profile/user@example.com

GET    http://localhost:5001/api/users/stats/user@example.com

GET    http://localhost:5001/api/users/saved-jobs/user@example.com
POST   http://localhost:5001/api/users/saved-jobs
DELETE http://localhost:5001/api/users/saved-jobs/682abc123def456

GET    http://localhost:5001/api/users/enrollments/user@example.com
POST   http://localhost:5001/api/users/enrollments
PUT    http://localhost:5001/api/users/enrollments/682abc123def456
```

---

## Static Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/uploads/*` | Serve uploaded files (images, PDFs) |

### Test URL
```
GET    http://localhost:5001/uploads/filename.jpg
```
