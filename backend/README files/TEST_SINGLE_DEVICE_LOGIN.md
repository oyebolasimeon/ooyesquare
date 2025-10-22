# 🧪 Testing Single Device Login Feature

## Quick Test Guide

---

## ✅ **Test 1: Block Concurrent Login (5 minutes)**

### Steps:
1. **Open Chrome browser**
   - Navigate to `http://localhost:4200/login`
   - Login as voter:
     - Email: `simeon@zap.africa`
     - Phone: `8033537505`
   - ✅ Should login successfully
   - ✅ Should see voter categories page

2. **Open Firefox browser** (or Incognito Chrome)
   - Navigate to `http://localhost:4200/login`
   - Try to login with **same credentials**:
     - Email: `simeon@zap.africa`
     - Phone: `8033537505`
   - Click "Login as Voter"

### Expected Result:
- ❌ Login should be **BLOCKED**
- ✅ Beautiful modal should appear with:
  - Orange/amber gradient header
  - Warning icon
  - Message: "Account is already logged in on another device..."
  - Session details:
    - Device: "Chrome Browser" (or similar)
    - IP Address: Your local IP
    - Login Time: "X minutes ago"
  - Info box with instructions
  - Button: "OK, I Understand"

### What to Check:
- [ ] Modal appears immediately
- [ ] Modal shows correct device info
- [ ] Modal shows IP address
- [ ] Modal shows relative time
- [ ] Modal cannot be dismissed by clicking outside
- [ ] Clicking "OK, I Understand" closes modal
- [ ] User remains on login page (not logged in)

### Screenshot Locations:
Take screenshots and save as:
- `test-screenshots/concurrent-login-blocked.png`

---

## ✅ **Test 2: Proper Logout Flow (3 minutes)**

### Steps:
1. **In Chrome** (where you're logged in from Test 1)
   - Navigate to voter categories page
   - Click the **Logout** button (top right)

2. **Check Network Tab**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Look for: `POST /api/auth/voter/logout`

3. **Try to login again**
   - On the login page
   - Login with same credentials:
     - Email: `simeon@zap.africa`
     - Phone: `8033537505`

### Expected Result:
- ✅ Logout should redirect to login page
- ✅ API call should be visible in Network tab
- ✅ Login should be **SUCCESSFUL** (no blocking)
- ✅ Should reach voter categories page

### What to Check:
- [ ] Logout redirects to login page
- [ ] Network tab shows `/api/auth/voter/logout` call
- [ ] Logout response is 200 OK
- [ ] Can immediately login from same browser
- [ ] Can also login from Firefox now

---

## ✅ **Test 3: Session Replacement & Auto-Logout (5 minutes)**

### Steps:
1. **Setup:**
   - Login on Chrome
   - Navigate to voter categories page
   - **Keep Chrome open**

2. **On Firefox:**
   - Go to login page
   - Login with same credentials

3. **Back on Chrome:**
   - Try to click on a category (e.g., "National Election")
   - Or refresh the page

### Expected Result:
- ✅ Firefox login should be **SUCCESSFUL** (replaces session)
- ✅ Chrome should show **Session Expired Modal**:
  - Red gradient header
  - Exclamation icon
  - Message: "Your Session Has Expired"
  - Explanation: "accessed from another device"
  - Info box: "Please login again"
  - Button: "OK, Login Again"
- ✅ Clicking button redirects to login page

### What to Check:
- [ ] Firefox login succeeds (no blocking)
- [ ] Chrome detects session replacement
- [ ] Session Expired Modal appears in Chrome
- [ ] Modal shows correct messaging
- [ ] Modal cannot be dismissed by clicking outside
- [ ] Clicking button redirects to login
- [ ] Chrome's localStorage is cleared

### Debug Check:
In Chrome Console:
```javascript
// Before session replacement
localStorage.getItem('currentUser')
// Should show user object with token

// After session expired modal
localStorage.getItem('currentUser')
// Should be null
```

---

## ✅ **Test 4: Session Info Details (2 minutes)**

### Steps:
1. **Login on Chrome**
   - Login successfully
   - Note the browser and device

2. **Try to login on Firefox**
   - Attempt login with same account
   - Modal should appear

3. **Check Modal Details**
   - Read the device information
   - Check the IP address
   - Verify the time display

### Expected Result:
- ✅ Device info should extract browser name
  - "Chrome Browser" for Chrome
  - "Firefox Browser" for Firefox
  - "Safari Browser" for Safari
- ✅ IP address should be displayed
  - Local: `127.0.0.1` or `::1`
  - Network: Your LAN IP (e.g., `192.168.1.X`)
- ✅ Time should be relative
  - "5 minutes ago"
  - "2 hours ago"
  - Falls back to full date if > 24 hours

---

## ✅ **Test 5: Multiple Logout Locations (3 minutes)**

### Test voter categories page logout:
1. Login and go to categories page
2. Click logout
3. Verify API call and redirect

### Test other pages (if logout available):
- Voting page
- States page
- Results page

### Expected Result:
- ✅ All logout buttons call API endpoint
- ✅ All redirect to login page after logout
- ✅ Session is cleared in database

---

## 🐛 **Edge Cases to Test**

### Edge Case 1: Network Failure During Logout
1. Login on Chrome
2. Disable network (or use DevTools to block request)
3. Click logout
4. **Expected:** Should still redirect to login (local logout)

### Edge Case 2: Rapid Login Attempts
1. Login on Chrome
2. Immediately try to login on Firefox (within 1 second)
3. **Expected:** Second login should be blocked
4. First session should remain active

### Edge Case 3: Session After 24 Hours
1. Login as voter
2. Wait 24+ hours (or manually update DB)
   ```javascript
   // In MongoDB shell or Compass:
   db.voters.updateOne(
     { email: "simeon@zap.africa" },
     { $set: { "activeSession.lastActivity": new Date(Date.now() - 25*60*60*1000) } }
   )
   ```
3. Try to login again
4. **Expected:** Login should succeed (session expired)

---

## 📊 **Test Results Checklist**

### Backend Session Management
- [ ] Login blocks concurrent attempts
- [ ] Session info is stored in database
- [ ] Token is validated on each request
- [ ] Last activity is updated
- [ ] Logout clears session
- [ ] Session expires after 24 hours

### Frontend Error Handling
- [ ] Active Session Modal appears on 403
- [ ] Modal shows correct session details
- [ ] Modal displays properly styled UI
- [ ] Session Expired Modal appears on 401
- [ ] Interceptor catches all session errors
- [ ] Force logout works correctly

### User Experience
- [ ] Modals are visually appealing
- [ ] Messages are clear and helpful
- [ ] Buttons work as expected
- [ ] Redirects happen smoothly
- [ ] No errors in browser console
- [ ] Loading states work properly

---

## 🔍 **Debugging Tips**

### Check Backend Logs
```bash
# In backend terminal
# Should see logs for:
- Login attempts
- Session checks
- Token validation
- Logout calls
```

### Check MongoDB Data
```javascript
// In MongoDB Compass or Shell
db.voters.findOne({ email: "simeon@zap.africa" })

// Should see:
{
  activeSession: {
    token: "eyJhbGc...",
    deviceInfo: "Mozilla/5.0...",
    ipAddress: "127.0.0.1",
    loginTime: ISODate("..."),
    lastActivity: ISODate("...")
  }
}
```

### Check Browser Console
```javascript
// In Chrome DevTools Console
localStorage.getItem('currentUser')
// Should show user object with token

// Check network requests
// Filter by: /api/auth/
// Should see login, logout calls
```

### Common Issues & Solutions

**Issue:** Modal doesn't appear
- **Check:** Browser console for errors
- **Check:** ng-bootstrap is imported
- **Check:** Modal component is registered

**Issue:** Login not blocked
- **Check:** Backend is running latest code
- **Check:** Database has activeSession field
- **Check:** Session age calculation is correct

**Issue:** Interceptor not working
- **Check:** app.config.ts has interceptor registered
- **Check:** Session error code is 'SESSION_REPLACED'
- **Check:** Error response structure matches

---

## ✅ **Success Criteria**

All tests should pass with:
- ✅ Concurrent login blocked with modal
- ✅ Session details displayed correctly
- ✅ Logout calls API and clears session
- ✅ Session replacement detected
- ✅ Auto-logout with modal
- ✅ Proper redirects to login page
- ✅ No console errors
- ✅ Beautiful, professional UI

---

## 📸 **Screenshots to Capture**

1. `active-session-modal.png` - Orange modal with session details
2. `session-expired-modal.png` - Red modal with expired message
3. `network-logout-call.png` - DevTools showing logout API call
4. `mongodb-session-data.png` - Database showing activeSession field
5. `concurrent-login-flow.png` - Side-by-side browsers during test

---

**Ready to test! Start with Test 1 and work your way through.** 🧪✨

