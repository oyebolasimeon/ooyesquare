# 🚀 STCOGA Elections - Quick Start Guide

## 🎯 Get Started in 3 Steps!

---

## ✅ Step 1: Access the Application

### Frontend (Already Running)
```
🌐 URL: http://localhost:4911
```

### Backend API (Already Deployed)
```
🌐 URL: https://stcoga-be.onrender.com/api
```

---

## 🔐 Step 2: Login Credentials

### As Admin
```
📧 Email: admin@stcoga.com
🔑 Password: Admin@123
```

### As Voter (test accounts)
```
📧 Email: voter1@stcoga.com
📱 Phone: 08012345671

OR

📧 Email: voter2@stcoga.com
📱 Phone: 08012345672
```

---

## 🎓 Step 3: Complete Workflow

### Admin Workflow
1. **Login** → Use admin credentials at http://localhost:4911/login
2. **Create Positions** → Click "Positions" in sidebar
   - Add National positions (President, Vice President, etc.)
   - Add State positions (select state from dropdown)
3. **Add Contestants** → Click "Contestants" in sidebar
   - Select position
   - Enter contestant name and bio
4. **Upload Voters** → Click "Voters" in sidebar
   - Download template or upload Excel file
   - Required columns: email, phoneNumber, firstName, lastName, maidenName
5. **Set Election Dates** → Click "Elections" in sidebar
   - Set start date/time
   - Set end date/time
   - Toggle "Enable Election"
6. **View Results** → Click "Results" in sidebar
   - See vote counts
   - Export to Excel

### Voter Workflow
1. **Login** → Use voter credentials at http://localhost:4911/login
2. **Select Category** → Choose National or State
3. **Select State** (if State category) → Pick your state
4. **Vote** → 
   - Click on a position to expand
   - Select your preferred candidate
   - Repeat for all positions
5. **Submit** → Review and confirm your votes
6. **Success** → Thank you page displayed

---

## 📊 Test With Sample Data

### Quick Seed Script (Optional)
If you want to test with pre-populated data:

```bash
cd backend
node scripts/seedData.js
```

This creates:
- ✅ 5 Positions (3 National, 2 State)
- ✅ 8 Contestants
- ✅ 3 Sample voters
- ✅ Active election settings

---

## 🎨 What You'll See

### Beautiful UI Features
✨ **Animations**
- Smooth page transitions
- Card hover effects
- Button lift animations
- Loading spinners
- Success animations

✨ **Design**
- STCOGA blue and brown branding
- Modern gradient backgrounds
- Clean typography
- Responsive on all devices
- Professional sidebar navigation

✨ **UX**
- Intuitive navigation
- Clear status indicators
- Helpful tooltips
- Confirmation dialogs
- Error messages

---

## 📱 Responsive Testing

### Desktop (>1200px)
- Full sidebar visible
- Grid layouts
- All features accessible

### Tablet (768px - 1200px)
- Sidebar visible
- Adjusted spacing
- Touch-friendly

### Mobile (<768px)
- Sidebar collapses
- Stacked layouts
- Large touch targets

---

## 🐛 Troubleshooting

### Issue: Frontend not loading
**Solution**: 
```bash
cd frontend/crimson-arc-frontend
npm install
npm run dev
```

### Issue: Can't login as admin
**Solution**: Check credentials are exactly:
- Email: `admin@stcoga.com`
- Password: `Admin@123`

### Issue: Backend API not responding
**Solution**: The backend is deployed at https://stcoga-be.onrender.com/api
Test it: `curl https://stcoga-be.onrender.com/api/health`

### Issue: Can't see animations
**Solution**: 
1. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check if browser supports CSS animations
3. Check if "Reduce Motion" is disabled in OS settings

---

## ✅ Features Checklist

### Try These Features:

**Admin:**
- [ ] Login as admin
- [ ] Create a National position
- [ ] Create a State position (with state selection)
- [ ] Add 2-3 contestants to a position
- [ ] Upload voters from Excel
- [ ] Set election start/end dates
- [ ] Enable the election
- [ ] View dashboard statistics
- [ ] Check results page
- [ ] Export results to Excel

**Voter:**
- [ ] Login as voter
- [ ] Select National category
- [ ] View and vote for positions
- [ ] Skip a position
- [ ] Submit votes
- [ ] See thank you page
- [ ] Try to vote again (should be blocked)

---

## 🎯 Pro Tips

1. **Navigation** → Use sidebar to quickly jump between sections
2. **Keyboard** → Tab navigation works throughout
3. **Search** → Use browser's Cmd/Ctrl+F to find things
4. **Excel** → Sample Excel format in voters upload dialog
5. **Results** → Refresh to see updated vote counts
6. **Logout** → Always available in sidebar footer

---

## 📞 Need Help?

Check these files:
- `PROJECT_COMPLETE.md` - Complete feature list
- `TEST_API.md` - API endpoint reference
- `ADMIN_NAVIGATION_COMPLETE.md` - Admin UI guide
- `README.md` - Project overview

---

## 🎉 You're Ready!

The application is **fully functional** and ready to use!

**Enjoy the STCOGA Elections Platform! 🗳️**

---

*Built with Angular 18, Node.js, MongoDB, and PrimeNG*



