# STCOGA National Executive Council Elections - Voting Application

## 🎯 Project Overview

A comprehensive voting system for STCOGA (Scripture Truth Christian Overcomers Church of God Assembly) National Executive Council Elections with separate interfaces for administrators and voters.

## ✅ COMPLETED - Backend API (100%)

### Database Models
All MongoDB models have been created:
- ✅ **Admin** - Admin user authentication
- ✅ **Voter** - Voter profiles with activation status
- ✅ **Position** - Election positions (National/State categories)
- ✅ **Contestant** - Candidates running for positions
- ✅ **Vote** - Individual vote records
- ✅ **ElectionSettings** - Election dates and times

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /admin/login` - Admin login
- `POST /voter/login` - Voter login (email + phone number)
- `POST /admin/create` - Create admin account

#### Positions (`/api/positions`)
- `GET /` - Get all positions (with filters)
- `POST /` - Create new position (Admin only)
- `PUT /:id` - Update position (Admin only)
- `DELETE /:id` - Delete position (Admin only)
- `GET /states/list` - Get list of all Nigerian states

#### Contestants (`/api/contestants`)
- `GET /` - Get all contestants
- `GET /position/:positionId` - Get contestants for a position
- `POST /` - Create new contestant (Admin only)
- `PUT /:id` - Update contestant (Admin only)
- `DELETE /:id` - Delete contestant (Admin only)

#### Voters (`/api/voters`)
- `GET /` - Get all voters (Admin only)
- `GET /stats` - Get voter statistics (Admin only)
- `POST /` - Create single voter (Admin only)
- `PUT /:id` - Update voter (Admin only)
- `PUT /:id/toggle-status` - Activate/deactivate voter (Admin only)
- `DELETE /:id` - Delete voter (Admin only)
- `POST /upload` - Upload voters from Excel (Admin only)

#### Voting (`/api/votes`)
- `POST /submit` - Submit votes (Voter only)
- `GET /status` - Get voter's voting status (Voter only)
- `GET /available-elections` - Get available elections (Voter only)

#### Elections (`/api/elections`)
- `GET /` - Get all election settings (Admin only)
- `POST /` - Create election setting (Admin only)
- `PUT /:id` - Update election setting (Admin only)
- `DELETE /:id` - Delete election setting (Admin only)

#### Results (`/api/results`)
- `GET /` - Get results by category (Admin only)
- `GET /analytics` - Get dashboard analytics (Admin only)
- `GET /export` - Export results to Excel (Admin only)
- `GET /position/:id` - Get detailed result for position (Admin only)

### Key Features Implemented

1. **Excel Upload**: Admin can upload Excel file with voter information (email, phone number, first name, maiden name, last name)
2. **Voter Management**: Activate/deactivate voters
3. **Election Scheduling**: Set start and end dates for elections
4. **Two Categories**: Support for National and State elections
5. **Nigerian States**: All 37 Nigerian states (including FCT) supported
6. **Vote Validation**: Prevents duplicate voting, validates election dates
7. **Results & Analytics**: Real-time results and comprehensive analytics
8. **Excel Export**: Export election results to Excel format

## ✅ COMPLETED - Frontend Foundation (40%)

### Services Created
- ✅ **AuthService** - Authentication management
- ✅ **ApiService** - All API calls to backend
- ✅ **Models** - TypeScript interfaces for all data types

### Project Structure
```
frontend/crimson-arc-frontend/src/app/
├── models/
│   └── models.ts
├── services/
│   ├── auth.service.ts
│   └── api.service.ts
├── components/
│   ├── admin/         (To be created)
│   ├── voter/         (To be created)
│   └── shared/        (To be created)
└── assets/
    └── bg-image.jpeg  (Background image)
```

## 🚧 REMAINING - Frontend Components

### 1. Login Page Component
**File**: `components/shared/login/login.component.ts`

**Features Needed**:
- Toggle between Admin and Voter login
- Admin: Email + Password
- Voter: Email + Phone Number
- Error handling
- Redirect after successful login
- Use background image from assets

**Template Structure**:
```html
<div class="login-container" [style.background-image]="'url(assets/bg-image.jpeg)'">
  <div class="login-card">
    <h1>STCOGA Elections</h1>
    <mat-tab-group>
      <mat-tab label="Voter Login">
        <!-- Voter login form -->
      </mat-tab>
      <mat-tab label="Admin Login">
        <!-- Admin login form -->
      </mat-tab>
    </mat-tab-group>
  </div>
</div>
```

### 2. Admin Dashboard Component
**File**: `components/admin/dashboard/dashboard.component.ts`

**Features Needed**:
- Display analytics (from `apiService.getAnalytics()`)
- Show voter statistics
- Show voting progress
- Navigation to other admin sections

### 3. Admin Position Management
**File**: `components/admin/positions/positions.component.ts`

**Features Needed**:
- List all positions
- Filter by category (National/State)
- Create new position modal
- Edit position
- Delete position with confirmation
- For State category, show state selector with all Nigerian states

### 4. Admin Contestant Management
**File**: `components/admin/contestants/contestants.component.ts`

**Features Needed**:
- List all contestants
- Filter by position
- Create new contestant modal
- Edit contestant
- Delete contestant with confirmation
- Upload contestant photo

### 5. Admin Voter Management
**File**: `components/admin/voters/voters.component.ts`

**Features Needed**:
- List all voters with pagination
- Search/filter voters
- Create single voter form
- Upload Excel file for bulk voter import
  ```typescript
  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.apiService.uploadVotersExcel(file).subscribe(...)
  }
  ```
- Toggle voter status (activate/deactivate)
- Display voter statistics

**Excel Format Required**:
| email | phoneNumber | firstName | maidenName | lastName |
|-------|-------------|-----------|------------|----------|
| voter@example.com | 08012345678 | John | Mary | Doe |

### 6. Admin Results & Analytics
**File**: `components/admin/results/results.component.ts`

**Features Needed**:
- Select category (National/State)
- If State, show state selector
- Display results using `apiService.getResults(category, state)`
- Show charts/graphs for each position
- Display winner for each position
- Export button to download Excel
  ```typescript
  exportResults() {
    this.apiService.exportResults(category, state).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `results-${category}.xlsx`;
      a.click();
    });
  }
  ```

### 7. Voter Category Selection
**File**: `components/voter/category-selection/category-selection.component.ts`

**Features Needed**:
- Show two cards: National and State
- Disable card if already voted for that category
- National card redirects to national positions
- State card shows state selector, then redirects to state positions

**Template Structure**:
```html
<div class="categories-container">
  <div class="category-card" [class.voted]="votedCategories.national">
    <h2>National Elections</h2>
    <button (click)="selectCategory('National')" [disabled]="votedCategories.national">
      {{ votedCategories.national ? 'Already Voted' : 'Vote Now' }}
    </button>
  </div>
  
  <div class="category-card" [class.voted]="votedCategories.state">
    <h2>State Elections</h2>
    <button (click)="selectCategory('State')" [disabled]="votedCategories.state">
      {{ votedCategories.state ? 'Already Voted' : 'Select State' }}
    </button>
  </div>
</div>
```

### 8. Voter State Selection (For State Elections)
**File**: `components/voter/state-selection/state-selection.component.ts`

**Features Needed**:
- Get states using `apiService.getStates()`
- Display as grid of cards
- On select, navigate to positions for that state

### 9. Voter Positions & Voting
**File**: `components/voter/voting/voting.component.ts`

**Features Needed**:
- Get positions using `apiService.getPositions(category, state)`
- For each position, show as expandable card
- Click on position card to see contestants
- Get contestants using `apiService.getContestants(positionId)`
- Select radio button for chosen contestant
- Allow "Skip this position" option
- Track selections in component state
- Submit button at bottom
- Confirmation modal before submission

**Vote Submission Logic**:
```typescript
selectedVotes: { [positionId: string]: string | null } = {};

selectContestant(positionId: string, contestantId: string) {
  this.selectedVotes[positionId] = contestantId;
}

skipPosition(positionId: string) {
  this.selectedVotes[positionId] = null;
}

submitVotes() {
  // Check if has empty selections
  const emptyPositions = Object.keys(this.selectedVotes).filter(
    key => this.selectedVotes[key] === undefined
  );
  
  if (emptyPositions.length > 0) {
    // Show warning modal
    this.showEmptyVotesWarning(() => this.proceedToConfirmation());
  } else {
    this.proceedToConfirmation();
  }
}

proceedToConfirmation() {
  // Show final confirmation modal
  this.showFinalConfirmation(() => this.finalSubmit());
}

finalSubmit() {
  const votes = Object.keys(this.selectedVotes).map(positionId => ({
    positionId,
    contestantId: this.selectedVotes[positionId]
  }));
  
  this.apiService.submitVotes(votes, this.category, this.state).subscribe(
    response => {
      // Show success message
      // Redirect to category selection or thank you page
    },
    error => {
      // Show error message
    }
  );
}
```

### 10. Confirmation Modals
**File**: `components/shared/confirmation-modal/confirmation-modal.component.ts`

**Two Types Needed**:

1. **Empty Votes Warning**:
```
"You have not selected candidates for X positions. 
Are you sure you want to continue without voting for these positions?"
[Go Back] [Continue]
```

2. **Final Confirmation**:
```
"You are about to submit your votes. 
This action cannot be undone. Are you sure?"
[Cancel] [Submit Votes]
```

## 🎨 Styling Guide

### Background Image
The background image is located at: `src/assets/bg-image.jpeg`

**Apply to components**:
```scss
.page-container {
  min-height: 100vh;
  background-image: url('/assets/bg-image.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

### Color Scheme
Based on "Crimson Arc" theme:
```scss
--primary: #dc143c;      // Crimson
--secondary: #8b0000;    // Dark red
--accent: #ff6b6b;       // Light crimson
--success: #2ecc71;
--warning: #f39c12;
--danger: #e74c3c;
--dark: #2c3e50;
--light: #ecf0f1;
```

### Components Styling
- Use Angular Material for UI components
- Cards should have semi-transparent backgrounds
- Buttons should use primary crimson color
- Forms should have good spacing and validation feedback

## 🚀 Getting Started

### 1. Install MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Create Initial Admin
```bash
# Using Postman or curl
POST http://localhost:3000/api/auth/admin/create
Body: {
  "email": "admin@stcoga.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User"
}
```

### 4. Start Frontend
```bash
cd frontend/crimson-arc-frontend
npm install
npm start
```

Frontend will run on `http://localhost:4200`

## 📝 Development Workflow

### Admin Workflow
1. Login as admin
2. Create election settings (set dates)
3. Create positions (National/State with specific states)
4. Add contestants to positions
5. Upload voters via Excel or add manually
6. Monitor voting progress
7. View results and analytics
8. Export results

### Voter Workflow
1. Login with email and phone number
2. See category selection (National/State)
3. Select category
4. If State, select which state
5. See list of positions
6. For each position, select contestant or skip
7. Review selections
8. Confirm submission (with warnings for empty votes)
9. Submit votes
10. See thank you/confirmation page

## 🔧 Recommended Libraries for Frontend

```bash
# Install Angular Material
ng add @angular/material

# Install Chart.js for analytics
npm install chart.js ng2-charts

# Install ExcelJS for client-side Excel handling (if needed)
npm install exceljs
```

## 📊 Sample Data for Testing

### Create Positions
```json
// National Positions
{
  "title": "National President",
  "description": "Head of the organization",
  "category": "National",
  "order": 1
}

// State Position (Example: Lagos)
{
  "title": "Lagos State Coordinator",
  "description": "Coordinator for Lagos State",
  "category": "State",
  "state": "Lagos",
  "order": 1
}
```

### Upload Voters Excel
Create an Excel file with columns:
- email
- phoneNumber  
- firstName
- maidenName (optional)
- lastName

## 🎯 Next Steps

1. Install Angular Material
2. Create login component
3. Create admin dashboard with analytics
4. Create position management
5. Create contestant management
6. Create voter management with Excel upload
7. Create voter voting interface
8. Add confirmation modals
9. Style with background image and crimson theme
10. Test complete workflow

## 🔐 Security Notes

- All admin routes are protected with JWT authentication
- Voters can only vote once per category
- Inactive voters cannot login
- Election dates are validated
- Vote submissions are validated against positions and contestants

## 📞 Support

For questions or issues, refer to the API documentation or check the backend logs.

---

**Built with ❤️ for STCOGA**

