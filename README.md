# STCOGA National Executive Council Elections - Voting Application

## 🎯 Project Overview

A comprehensive full-stack voting system for **STCOGA (Scripture Truth Christian Overcomers Church of God Assembly)** National Executive Council Elections. The system includes separate interfaces for administrators to manage elections and voters to cast their votes.

## ✨ Features

### Admin Features
- ✅ **Dashboard** - Real-time analytics and voting statistics
- ✅ **Position Management** - Create and manage positions for National and State elections
- ✅ **Contestant Management** - Add candidates to positions
- ✅ **Voter Management** - Upload voters via Excel, activate/deactivate voter profiles
- ✅ **Election Settings** - Set start and end dates for elections
- ✅ **Results & Analytics** - View real-time results, export to Excel
- ✅ **State Support** - All 37 Nigerian states (including FCT)

### Voter Features
- ✅ **Secure Login** - Email and phone number authentication
- ✅ **Category Selection** - Choose between National and State elections
- ✅ **State Selection** - Select specific state for state elections
- ✅ **Voting Interface** - Vote for positions with contestant selection
- ✅ **Vote Validation** - Prevent duplicate voting, election date validation
- ✅ **Confirmation System** - Warnings and confirmations before submission

## 📊 Current Status

### ✅ COMPLETED (Backend - 100%)

All backend API endpoints are fully functional:

| Feature | Status | Endpoints |
|---------|--------|-----------|
| Authentication | ✅ Complete | Admin & Voter Login |
| Position Management | ✅ Complete | CRUD operations |
| Contestant Management | ✅ Complete | CRUD operations |
| Voter Management | ✅ Complete | CRUD + Excel upload |
| Voting System | ✅ Complete | Vote submission & validation |
| Election Settings | ✅ Complete | Date configuration |
| Results & Analytics | ✅ Complete | Real-time results + Excel export |

### 🚧 IN PROGRESS (Frontend - 60%)

| Component | Status |
|-----------|--------|
| Login Page | ✅ Complete |
| Auth Service | ✅ Complete |
| API Service | ✅ Complete |
| Models | ✅ Complete |
| Admin Dashboard | 🚧 To be created |
| Position Management | 🚧 To be created |
| Contestant Management | 🚧 To be created |
| Voter Management | 🚧 To be created |
| Results Page | 🚧 To be created |
| Category Selection | 🚧 To be created |
| Voting Interface | 🚧 To be created |
| Confirmation Modals | 🚧 To be created |

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v22.0.0 or higher)
- MongoDB (local or MongoDB Atlas)
- npm (v10.5.1 or higher)

### 1. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Or use MongoDB Atlas** (cloud) - Get connection string from [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stcoga-voting
JWT_SECRET=your-secret-key-change-in-production

# Start development server
npm run dev
```

**Backend runs on:** `http://localhost:3000`

### 3. Create Initial Admin Account

Use Postman, Thunder Client, or curl:

```bash
POST http://localhost:3000/api/auth/admin/create
Content-Type: application/json

{
  "email": "admin@stcoga.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User"
}
```

Save the returned token for subsequent requests.

### 4. Frontend Setup

```bash
cd frontend/crimson-arc-frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on:** `http://localhost:4200`

### 5. Login and Test

**Admin Login:**
- Navigate to `http://localhost:4200/login`
- Click "Admin Login" tab
- Email: `admin@stcoga.com`
- Password: `admin123`

**Voter Login:** (After creating voters via API or Excel)
- Click "Voter Login" tab
- Enter email and phone number from database

## 📁 Project Structure

```
crimson-arc-proj/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── positionController.js
│   │   ├── contestantController.js
│   │   ├── voterController.js
│   │   ├── voteController.js
│   │   ├── electionController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Voter.js
│   │   ├── Position.js
│   │   ├── Contestant.js
│   │   ├── Vote.js
│   │   └── ElectionSettings.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── positionRoutes.js
│   │   ├── contestantRoutes.js
│   │   ├── voterRoutes.js
│   │   ├── voteRoutes.js
│   │   ├── electionRoutes.js
│   │   └── resultRoutes.js
│   ├── utils/
│   │   └── constants.js
│   ├── uploads/
│   ├── index.js
│   ├── package.json
│   └── README.md
│
└── frontend/
    └── crimson-arc-frontend/
        ├── src/
        │   ├── app/
        │   │   ├── components/
        │   │   │   ├── admin/
        │   │   │   ├── voter/
        │   │   │   └── shared/
        │   │   │       └── login/
        │   │   ├── models/
        │   │   │   └── models.ts
        │   │   ├── services/
        │   │   │   ├── auth.service.ts
        │   │   │   └── api.service.ts
        │   │   ├── app.component.ts
        │   │   ├── app.config.ts
        │   │   └── app.routes.ts
        │   ├── assets/
        │   │   └── bg-image.jpeg
        │   └── index.html
        ├── angular.json
        ├── package.json
        └── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/admin/login      - Admin login
POST   /api/auth/voter/login      - Voter login (email + phone)
POST   /api/auth/admin/create     - Create admin account
```

### Positions
```
GET    /api/positions             - Get all positions
POST   /api/positions             - Create position (Admin)
PUT    /api/positions/:id         - Update position (Admin)
DELETE /api/positions/:id         - Delete position (Admin)
GET    /api/positions/states/list - Get Nigerian states
```

### Contestants
```
GET    /api/contestants           - Get all contestants
POST   /api/contestants           - Create contestant (Admin)
PUT    /api/contestants/:id       - Update contestant (Admin)
DELETE /api/contestants/:id       - Delete contestant (Admin)
```

### Voters
```
GET    /api/voters                - Get all voters (Admin)
GET    /api/voters/stats          - Get voter statistics (Admin)
POST   /api/voters                - Create voter (Admin)
POST   /api/voters/upload         - Upload Excel (Admin)
PUT    /api/voters/:id            - Update voter (Admin)
PUT    /api/voters/:id/toggle-status - Activate/deactivate (Admin)
DELETE /api/voters/:id            - Delete voter (Admin)
```

### Voting
```
POST   /api/votes/submit          - Submit votes (Voter)
GET    /api/votes/status          - Get voting status (Voter)
GET    /api/votes/available-elections - Get available elections (Voter)
```

### Elections
```
GET    /api/elections             - Get election settings (Admin)
POST   /api/elections             - Create election (Admin)
PUT    /api/elections/:id         - Update election (Admin)
DELETE /api/elections/:id         - Delete election (Admin)
```

### Results
```
GET    /api/results               - Get results by category (Admin)
GET    /api/results/analytics     - Get analytics (Admin)
GET    /api/results/export        - Export to Excel (Admin)
GET    /api/results/position/:id  - Get position details (Admin)
```

## 📝 Creating Sample Data

### 1. Create Positions (via API)

**National Position:**
```json
POST /api/positions
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "title": "National President",
  "description": "Head of the organization",
  "category": "National",
  "order": 1
}
```

**State Position:**
```json
POST /api/positions
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "title": "State Coordinator",
  "description": "Lagos State Coordinator",
  "category": "State",
  "state": "Lagos",
  "order": 1
}
```

### 2. Create Contestants

```json
POST /api/contestants
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "firstName": "John",
  "lastName": "Doe",
  "maidenName": "",
  "position": "POSITION_ID_FROM_STEP_1",
  "bio": "Experienced leader with 10 years of service",
  "order": 1
}
```

### 3. Upload Voters via Excel

**Excel Format:**
| email | phoneNumber | firstName | maidenName | lastName |
|-------|-------------|-----------|------------|----------|
| john.doe@example.com | 08012345678 | John | - | Doe |
| jane.smith@example.com | 08098765432 | Jane | Johnson | Smith |

```
POST /api/voters/upload
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data

file: [Your Excel file]
```

### 4. Set Election Dates

```json
POST /api/elections
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "category": "National",
  "startDate": "2025-01-15T00:00:00Z",
  "endDate": "2025-01-22T23:59:59Z"
}
```

## 🎨 Design & Styling

### Color Scheme (Crimson Arc Theme)
```css
--primary: #dc143c      /* Crimson */
--secondary: #8b0000    /* Dark Red */
--accent: #ff6b6b       /* Light Crimson */
--success: #2ecc71
--warning: #f39c12
--danger: #e74c3c
```

### Background Image
Location: `frontend/crimson-arc-frontend/src/assets/bg-image.jpeg`

Used on all major pages with overlay for better readability.

## 📚 Documentation

- **[VOTING_APP_GUIDE.md](VOTING_APP_GUIDE.md)** - Comprehensive development guide
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current project status and next steps
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Admin and Voter roles with different permissions
- **Vote Validation** - Prevents duplicate voting and validates election dates
- **Voter Status** - Activate/deactivate voter accounts
- **Password Hashing** - bcrypt for admin passwords
- **Protected Routes** - Middleware protection for all sensitive endpoints

## 🎯 Next Steps for Development

1. **Create Admin Components**
   - Dashboard with analytics
   - Position management interface
   - Contestant management interface
   - Voter management with Excel upload
   - Results and export functionality

2. **Create Voter Components**
   - Category selection page
   - State selection page
   - Voting interface with contestant cards
   - Confirmation modals
   - Thank you page

3. **Add Enhancements**
   - Photo upload for contestants
   - Advanced analytics charts
   - Email notifications
   - Mobile optimization
   - Print ballot functionality

See **[VOTING_APP_GUIDE.md](VOTING_APP_GUIDE.md)** for detailed implementation instructions.

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill

# Or change port in backend/.env
PORT=3001
```

### Frontend Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support & Contact

For questions or issues:
1. Check the documentation files
2. Review API endpoint documentation
3. Check backend logs for errors
4. Verify MongoDB connection

## 📄 License

ISC

## 👥 Credits

Built for STCOGA (Scripture Truth Christian Overcomers Church of God Assembly)

---

**Last Updated:** October 2025  
**Version:** 1.0.0  
**Status:** Backend Complete, Frontend In Progress  

Built with ❤️ using Angular & Express
