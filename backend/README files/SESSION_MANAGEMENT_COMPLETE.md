# Session Management - Single Device Login ✅

## 🎯 Overview
Implemented a robust session management system that prevents multiple concurrent logins for the same voter account. Only one active session is allowed per voter at any time.

---

## 🔐 Security Features

### **1. Single Session Enforcement**
- ✅ Only one active login per voter account
- ✅ New login automatically invalidates previous session
- ✅ Token validation on every request
- ✅ Session tracking with device and IP information

### **2. Session Timeout**
- ✅ Automatic session expiration after 24 hours of inactivity
- ✅ Last activity timestamp updated on each request
- ✅ Expired sessions allow new login without blocking

### **3. Device & IP Tracking**
- ✅ Records device information (User-Agent)
- ✅ Captures IP address
- ✅ Stores login time
- ✅ Tracks last activity time

---

## 📊 Implementation Details

### **1. Voter Model Update**

**File:** `/backend/models/Voter.js`

**Added Fields:**
```javascript
activeSession: {
  token: { type: String },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  loginTime: { type: Date },
  lastActivity: { type: Date }
}
```

### **2. Login Flow (authController.js)**

**Process:**
```
1. Voter provides email + phone number
   ↓
2. System checks credentials
   ↓
3. Check for existing active session
   ↓
4. If session exists and is valid (< 24 hours old)
   → BLOCK login with error message
   ↓
5. If no session or session expired
   → Generate new token
   → Save session info
   → Allow login
```

**Session Check:**
```javascript
if (voter.activeSession && voter.activeSession.token) {
  const sessionAge = Date.now() - new Date(voter.activeSession.lastActivity).getTime();
  const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

  if (sessionAge < maxSessionAge) {
    return res.status(403).json({ 
      message: 'Account is already logged in on another device...',
      sessionInfo: {
        deviceInfo: voter.activeSession.deviceInfo,
        loginTime: voter.activeSession.loginTime,
        ipAddress: voter.activeSession.ipAddress
      }
    });
  }
}
```

### **3. Middleware Validation (auth.js)**

**Token Validation:**
```javascript
// For voters only
if (req.user.activeSession.token !== token) {
  return res.status(401).json({ 
    message: 'Session expired. Account accessed from another device.',
    code: 'SESSION_REPLACED'
  });
}

// Update last activity on each request
req.user.activeSession.lastActivity = new Date();
await req.user.save();
```

### **4. Logout Endpoint**

**Route:** `POST /api/auth/voter/logout`

**Function:**
```javascript
voterLogout = async (req, res) => {
  // Clear active session
  voter.activeSession = {
    token: null,
    deviceInfo: null,
    ipAddress: null,
    loginTime: null,
    lastActivity: null
  };
  await voter.save();
}
```

---

## 🚀 API Endpoints

### **1. Voter Login**
```
POST /api/auth/voter/login

Body:
{
  "email": "voter@example.com",
  "phoneNumber": "08012345678"
}

Success Response (200):
{
  "_id": "...",
  "email": "voter@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "jwt-token-here",
  "votedCategories": { ... }
}

Blocked Response (403):
{
  "message": "Account is already logged in on another device. Please logout from the other device first.",
  "sessionInfo": {
    "deviceInfo": "Mozilla/5.0...",
    "loginTime": "2025-01-19T10:30:00.000Z",
    "ipAddress": "192.168.1.1"
  }
}
```

### **2. Voter Logout**
```
POST /api/auth/voter/logout
Authorization: Bearer <token>

Success Response (200):
{
  "message": "Logged out successfully"
}
```

---

## 🔄 Session Lifecycle

### **Login Flow:**
```
┌─────────────────────────────────────────────────────────┐
│ 1. User logs in from Device A                          │
│    ✅ Session created                                   │
│    Token: ABC123                                        │
│    Device: Chrome on Windows                            │
│    IP: 192.168.1.1                                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. User tries to login from Device B                   │
│    ❌ Login BLOCKED                                     │
│    Message: "Already logged in on another device"      │
│    Shows: Device A info, IP, login time                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. User logs out from Device A                         │
│    ✅ Session cleared                                   │
│    Token: null                                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. User can now login from Device B                    │
│    ✅ New session created                               │
│    Token: XYZ789                                        │
│    Device: Safari on iPhone                             │
│    IP: 192.168.1.2                                      │
└─────────────────────────────────────────────────────────┘
```

### **Activity Tracking:**
```
Every API request from voter:
  ↓
Middleware checks token
  ↓
If token matches stored session:
  ✅ Update lastActivity timestamp
  ✅ Allow request
  
If token doesn't match:
  ❌ Reject request
  ❌ Return SESSION_REPLACED error
  ❌ Frontend should logout user
```

### **Session Expiration:**
```
Check on login:
  ↓
Current Time - Last Activity > 24 hours?
  ↓
YES: Session expired
  ✅ Allow new login
  ✅ Create new session
  
NO: Session still active
  ❌ Block new login
  ❌ Show existing session info
```

---

## 🎨 User Experience

### **Scenario 1: Attempted Concurrent Login**
```
Device A (Logged in):
  ✅ Browsing voting page
  ✅ Active session

Device B (Attempting login):
  ❌ Login blocked
  📱 Error message: "Account is already logged in on another device"
  ℹ️  Shows: Last login from Chrome, IP: 192.168.1.1, Time: 2 hours ago
  🔄 User must logout from Device A first
```

### **Scenario 2: Session Expiration**
```
Device A (Last login 25 hours ago):
  ⏰ Session expired (> 24 hours)
  
Device B (Attempting login):
  ✅ Login allowed
  ✅ New session created
  
Device A (If tries to make request):
  ❌ Request rejected
  📱 Error: "Session expired. Account accessed from another device."
```

### **Scenario 3: Proper Logout**
```
Device A (Logged in):
  1. User clicks Logout
  2. POST /api/auth/voter/logout
  3. Session cleared in database
  
Device B (Attempting login):
  ✅ Login allowed
  ✅ New session created immediately
```

---

## 📱 Frontend Integration ✅

### **1. AuthService Update:**

**File:** `src/app/services/auth.service.ts`

**Implemented:**
```typescript
logout(): Observable<any> | void {
  const user = this.currentUserValue;
  
  // If user is a voter with a token, call logout endpoint to clear session
  if (user && 'phoneNumber' in user && user.token) {
    return this.http.post(`${this.apiUrl}/voter/logout`, {}, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    }).pipe(map(() => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      return true;
    }));
  } else {
    // For admins or users without tokens, just clear local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

// Force logout (for session expired scenarios)
forceLogout(): void {
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
}
```

### **2. Session Expired Modal:**

**File:** `src/app/components/shared/session-expired-modal.component.ts`

**Features:**
- ✅ Beautiful modal with gradient header
- ✅ Clear messaging about session replacement
- ✅ Professional UI with icons and styling
- ✅ Cannot be dismissed (backdrop: static)
- ✅ Redirects to login after acknowledgment

### **3. Active Session Modal:**

**File:** `src/app/components/shared/login/active-session-modal.component.ts`

**Features:**
- ✅ Shows existing session details (device, IP, login time)
- ✅ Displays how long ago the login occurred
- ✅ Professional warning UI with orange/amber theme
- ✅ Extracts browser info from User-Agent
- ✅ Clear instructions on what to do next

### **4. HTTP Interceptor:**

**File:** `src/app/interceptors/session.interceptor.ts`

**Implemented:**
```typescript
export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const modalService = inject(NgbModal);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if error is due to session being replaced (401 with SESSION_REPLACED code)
      if (error.status === 401 && error.error?.code === 'SESSION_REPLACED') {
        // Force logout
        authService.forceLogout();

        // Show session expired modal
        const modalRef = modalService.open(SessionExpiredModalComponent, {
          centered: true,
          backdrop: 'static',
          keyboard: false
        });

        modalRef.result.then(() => {
          router.navigate(['/login']);
        });
      }

      return throwError(() => error);
    })
  );
};
```

**Registered in:** `src/app/app.config.ts`
```typescript
provideHttpClient(withInterceptors([sessionInterceptor]))
```

### **5. Login Component Update:**

**File:** `src/app/components/shared/login/login.component.ts`

**Implemented:**
```typescript
voterLogin() {
  this.authService.voterLogin(this.voterEmail, this.voterPhone)
    .subscribe({
      next: (user) => {
        this.router.navigate(['/voter/categories']);
      },
      error: (err) => {
        // Check if error is due to active session (403)
        if (err.status === 403 && err.error?.sessionInfo) {
          // Show active session modal
          const modalRef = this.modalService.open(ActiveSessionModalComponent, {
            centered: true,
            backdrop: 'static',
            size: 'lg'
          });
          modalRef.componentInstance.message = err.error.message;
          modalRef.componentInstance.sessionInfo = err.error.sessionInfo;
        } else {
          // Show regular error message
          this.error = err.error?.message || 'Login failed...';
        }
      }
    });
}
```

### **6. Component Logout Updates:**

**File:** `src/app/components/voter/categories/categories.component.ts`

**Implemented:**
```typescript
logout() {
  const logoutResult = this.authService.logout();
  
  // If logout returns an Observable (voter with session), subscribe to it
  if (logoutResult) {
    logoutResult.subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Still navigate to login even if API call fails
        this.router.navigate(['/login']);
      }
    });
  } else {
    // Admin or already logged out
    this.router.navigate(['/login']);
  }
}
```

---

## 🛡️ Security Benefits

### **1. Account Protection**
- ✅ Prevents unauthorized simultaneous access
- ✅ Reduces risk of credential sharing
- ✅ Limits vote manipulation attempts

### **2. Audit Trail**
- ✅ Tracks login device and IP
- ✅ Records login and activity times
- ✅ Can identify suspicious activity

### **3. Session Control**
- ✅ Automatic timeout prevents stale sessions
- ✅ Explicit logout clears session immediately
- ✅ Token validation on every request

---

## ⚙️ Configuration

### **Session Timeout:**
```javascript
// In authController.js
const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

// Can be changed to:
// 1 hour: 60 * 60 * 1000
// 12 hours: 12 * 60 * 60 * 1000
// 48 hours: 48 * 60 * 60 * 1000
```

### **IP Detection:**
```javascript
// Checks multiple headers for IP
const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                  req.headers['x-real-ip'] || 
                  req.socket.remoteAddress || 
                  'Unknown IP';
```

---

## 🧪 Testing Checklist

- [ ] Login from Device A → Success
- [ ] Try login from Device B while A is active → Blocked
- [ ] Logout from Device A
- [ ] Login from Device B → Success
- [ ] Try to use Device A with old token → Rejected
- [ ] Wait 24+ hours → Session expires
- [ ] Login from any device → Success
- [ ] Verify sessionInfo is returned on blocked login
- [ ] Verify lastActivity updates on each request
- [ ] Verify logout clears session properly

---

## 📊 Database Schema

### **Voter Document:**
```json
{
  "_id": "...",
  "email": "voter@example.com",
  "phoneNumber": "08012345678",
  "firstName": "John",
  "lastName": "Doe",
  "status": "active",
  "hasVoted": false,
  "votedCategories": {
    "national": false,
    "state": false
  },
  "lastLogin": "2025-01-19T10:30:00.000Z",
  "activeSession": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "deviceInfo": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "ipAddress": "192.168.1.1",
    "loginTime": "2025-01-19T10:30:00.000Z",
    "lastActivity": "2025-01-19T12:45:00.000Z"
  },
  "createdAt": "2025-01-15T08:00:00.000Z"
}
```

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| **Backend** |  |  |
| Voter Model Update | ✅ Complete | Added activeSession field |
| Login Session Check | ✅ Complete | Blocks concurrent logins |
| Token Validation | ✅ Complete | Middleware checks token |
| Activity Tracking | ✅ Complete | Updates on each request |
| Logout Endpoint | ✅ Complete | Clears session |
| Session Timeout | ✅ Complete | 24-hour expiration |
| Device & IP Tracking | ✅ Complete | Recorded on login |
| Error Messages | ✅ Complete | Clear, informative |
| Backend Routes | ✅ Complete | Added logout route |
| **Frontend** |  |  |
| AuthService Logout | ✅ Complete | Calls API endpoint |
| HTTP Interceptor | ✅ Complete | Global session handling |
| Active Session Modal | ✅ Complete | Beautiful warning UI |
| Session Expired Modal | ✅ Complete | Auto-logout modal |
| Login Error Handling | ✅ Complete | Shows session info |
| Component Logout Updates | ✅ Complete | Proper API calls |
| **Testing** |  |  |
| Login Blocking Test | ⏳ Ready to Test | Test concurrent logins |
| Session Expiration Test | ⏳ Ready to Test | Wait 24+ hours |
| Logout Flow Test | ⏳ Ready to Test | Test session clearing |
| Token Validation Test | ⏳ Ready to Test | Test token mismatch |
| Modal Display Test | ⏳ Ready to Test | Test UI feedback |
| End-to-End Flow | ⏳ Ready to Test | Complete user journey |

---

## 🚀 Testing Guide

### **Test 1: Concurrent Login Blocking**
```
1. Open Browser A (Chrome)
2. Login as voter: test@example.com
3. Verify login successful
4. Open Browser B (Firefox)
5. Try to login with same credentials
6. Expected: Active Session Modal appears
7. Verify modal shows:
   - Device info (Chrome)
   - IP address
   - Login time (e.g., "5 minutes ago")
8. Click "OK, I Understand"
9. Modal closes, still on login page
10. ✅ Test passed if login blocked
```

### **Test 2: Proper Logout Flow**
```
1. Login on Browser A
2. Click logout button
3. Verify redirected to login page
4. Check browser network tab
5. Verify POST /api/auth/voter/logout called
6. Login again on Browser A
7. ✅ Test passed if login successful
```

### **Test 3: Session Replacement**
```
1. Login on Browser A
2. Keep Browser A open
3. On Browser B, logout from active session
4. Login on Browser B
5. On Browser A, try to make any action (e.g., vote)
6. Expected: Session Expired Modal appears
7. Verify modal says "accessed from another device"
8. Click "OK, Login Again"
9. Verify redirected to login page
10. ✅ Test passed if session properly invalidated
```

### **Test 4: Session Timeout (24 hours)**
```
1. Login as voter
2. Wait 24+ hours (or manually update DB)
3. Try to login again
4. Expected: Login successful (old session expired)
5. ✅ Test passed if no blocking occurs
```

### **Test 5: Token Validation**
```
1. Login on Browser A
2. Copy token from localStorage
3. Login on Browser B (replaces session)
4. On Browser A, manually call API with old token
5. Expected: 401 error with SESSION_REPLACED code
6. Session Expired Modal should appear
7. ✅ Test passed if properly detected
```

---

## 📋 Frontend Files Created/Modified

### **New Files:**
1. ✅ `src/app/components/shared/login/active-session-modal.component.ts`
2. ✅ `src/app/components/shared/session-expired-modal.component.ts`
3. ✅ `src/app/interceptors/session.interceptor.ts`

### **Modified Files:**
1. ✅ `src/app/services/auth.service.ts` - Added logout endpoint call
2. ✅ `src/app/components/shared/login/login.component.ts` - Handle 403 errors
3. ✅ `src/app/components/voter/categories/categories.component.ts` - Updated logout
4. ✅ `src/app/app.config.ts` - Registered interceptor

---

## 🎨 Modal Features

### **Active Session Modal (Orange Theme):**
- 🎨 Gradient orange/amber header
- 📱 Shows device information
- 🗺️ Displays IP address
- ⏰ Shows login time with relative formatting
- ℹ️ Clear instructions box
- 🔒 Cannot be dismissed (must acknowledge)

### **Session Expired Modal (Red Theme):**
- 🎨 Gradient red header
- 🚪 Clear "Session Expired" messaging
- 💡 Explains why (accessed from another device)
- ℹ️ Instructions to login again
- 🔒 Cannot be dismissed (must acknowledge)
- ➡️ Auto-redirects to login page

---

**🎉 Single device login security feature is now FULLY implemented on both backend and frontend!** 🔒✨

**Ready for testing!** 🧪

