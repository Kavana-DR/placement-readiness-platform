# Test Checklist Quick Start Guide

## 🚀 Quick Access

**Test Checklist Page:**  
👉 http://localhost:5174/prp/07-test

**Ship Page (locked until all tests pass):**  
👉 http://localhost:5174/prp/08-ship

---

## 📋 The 10 Pre-Ship Tests

### Test 1: JD Required Validation
**What to do:** Leave JD empty and click Analyze  
**What to see:** Red error message "Job Description is required."  
**Why:** Ensures input validation prevents empty submissions

### Test 2: Short JD Warning
**What to do:** Paste a JD with ~50 characters  
**What to see:** Amber warning "This JD is too short..." with character count  
**Why:** Validates edge case handling for minimal input

### Test 3: Skills Extraction
**What to do:** Analyze a JD with tech keywords, go to Results → Skills tab  
**What to see:** 6+ skill categories with detected keywords grouped  
**Why:** Confirms skill categorization logic works

### Test 4: Round Mapping Changes
**What to do:** Analyze 2 different JDs (different companies/skills)  
**What to see:** Round Mapping tab shows different rounds for each  
**Why:** Validates dynamic round generation based on context

### Test 5: Deterministic Scoring
**What to do:** Analyze the exact same JD twice  
**What to see:** Both analyses have identical baseScore (±0 variation)  
**Why:** Confirms score calculation is reproducible

### Test 6: Live Score Updates
**What to do:** On Results page, toggle a skill from "I know this" to "Need practice"  
**What to see:** Final score updates immediately in score card  
**Why:** Validates real-time UI updates work

### Test 7: Persistence After Refresh
**What to do:** Toggle a skill, then refresh the page (Ctrl+R)  
**What to see:** Skill toggle state and score persist after reload  
**Why:** Confirms localStorage persistence works

### Test 8: History Function
**What to do:** Create 3 analyses, go to History page  
**What to see:** All 3 analyses listed with correct scores  
**Why:** Validates entry saving and retrieval

### Test 9: Export Buttons
**What to do:** On Results page, click "Copy 7-Day Plan"  
**What to see:** Text copied to clipboard in correct format (can paste into notepad)  
**Why:** Confirms export utilities work

### Test 10: Console Cleanliness
**What to do:** Press F12, navigate through /analyze, /results, /history  
**What to see:** Console tab has zero errors (only info/warnings OK)  
**Why:** Ensures no critical runtime errors

---

## ✅ How to Use the Checklist

1. **Go to Test Checklist**
   ```
   http://localhost:5174/prp/07-test
   ```

2. **Run Each Test**
   - Read the test name
   - Click "💡 Hint" to see how to perform it
   - Perform the test in the app
   - Verify the expected result

3. **Check Off**
   - Click the checkbox to mark test as passed
   - Progress updates: "X / 10"

4. **Track Progress**
   - Watch the progress bar fill (0-100%)
   - When all 10 ✓: Green success banner appears

5. **Ship When Ready**
   - Button changes to "🚀 Ship to Production" (enabled)
   - Click to go to deployment page
   - Follow deployment instructions

---

## 🔓 Unlocking the Ship Page

**Before All Tests:** 
- ❌ `/prp/08-ship` is locked
- Shows red lock screen
- Auto-redirects to `/prp/07-test`

**After All 10 Tests Passed:**
- ✅ `/prp/08-ship` is unlocked
- Shows green success screen
- Provides deployment checklist

---

## 💾 localStorage Storage

**What's Saved:** Your test completion status  
**Where:** Browser Local Storage (`placement_test_checklist`)  
**How Long:** Persists until you clear browser data  
**Reset:** Click "Reset Checklist" button  

**To Check Storage:**
1. Press F12 (DevTools)
2. Go to Applications/Storage → Local Storage
3. Look for `placement_test_checklist` key
4. Should show JSON with 10 test items and true/false completed status

---

## 🚀 Deployment Flow

```
/prp/07-test (Checklist)
    ↓
Complete All 10 Tests
    ↓
Click "🚀 Ship to Production"
    ↓
/prp/08-ship (Deployment Info)
    ↓
Run: npm run build
    ↓
Deploy dist/ folder
    ↓
Success! 🎉
```

---

## ⚡ Quick Tests (5 minutes)

If you want quick validation without full testing:

1. **Validation Test**
   - Go to `/analyze`, leave JD empty, click Analyze
   - ✅ See red error

2. **Skill Test**
   - Paste JD, click Analyze
   - ✅ Results page loads with skills

3. **Persistence Test**
   - On Results, toggle a skill
   - Refresh page
   - ✅ Toggle state remains

4. **History Test**
   - Go to `/history`
   - ✅ Previous analysis shown

5. **Console Test**
   - Press F12
   - ✅ No errors in Console tab

---

## 📞 Troubleshooting

**Problem:** Checklist not saving  
**Solution:** Check browser localStorage is enabled (not in private mode)

**Problem:** Ship button disabled  
**Solution:** Make sure all 10 tests are checked (not 9/10)

**Problem:** Ship page shows lock screen  
**Solution:** Go back to `/prp/07-test` and check all remaining tests

**Problem:** Can't find test checklist  
**Solution:** Navigate to `http://localhost:5174/prp/07-test` manually

---

## ✨ Features

✅ 10-item quality gate checklist  
✅ Real-time progress tracking  
✅ localStorage persistence (survives refresh)  
✅ Ship route lock (until all tests pass)  
✅ Deployment screen with instructions  
✅ Reset capability  
✅ Premium UI design  
✅ No existing features removed  
✅ All routes preserved  

---

## 🎯 Next Steps

1. Go to: http://localhost:5174/prp/07-test
2. Run through the 10 tests
3. Check each one as you verify
4. Once all ✓: Deploy to production

**Estimated Time:** 20-30 minutes for full testing

Good luck! 🚀
