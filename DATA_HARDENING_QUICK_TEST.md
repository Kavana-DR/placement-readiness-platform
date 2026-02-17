# Data Hardening - Quick Test Guide

## 🧪 5-Minute Hardening Verification

Run these tests to verify all hardening features work correctly.

---

## Test 1: Input Validation (2 minutes)

### 1.1 Empty JD
1. Go to `/analyze`
2. Leave JD empty, click "Analyze"
3. ✓ Alert: "Job Description is required"

### 1.2 Short JD (< 200 chars)
1. In JD field, type: "Senior developer, 5+ years, strong communication"
2. ✓ Amber warning appears: "This JD is too short to analyze deeply"
3. ✓ Shows: "76 more characters for best results"
4. ✓ "Analyze" button still enabled

### 1.3 Valid JD (200+ chars)
1. Paste full JD:
```
Senior Full Stack Developer at Google
We are looking for a software engineer with strong DSA skills.
Experience required: Java, Python, JavaScript, React, Node.js.
Must understand databases (SQL, MongoDB), system design.
Background in algorithms, data structures, and OOP principles.
```
2. ✓ Warning disappears
3. ✓ "Analyze" button enabled
4. Click "Analyze"
5. ✓ Analysis completes successfully

---

## Test 2: Schema Normalization (2 minutes)

### 2.1 Check Entry Schema
1. After analyzing (Test 1.3), open browser DevTools
2. Go to Results page
3. In console, run:
```javascript
// Check the entry retrieved
const entry = JSON.parse(localStorage.getItem('placement_history'))[0]
console.log('Skill categories:', Object.keys(entry.extractedSkills))
console.log('Base Score:', entry.baseScore)
console.log('Final Score:', entry.finalScore)
console.log('Updated At:', entry.updatedAt)
```

4. ✓ Outputs:
```
Skill categories: ["coreCS", "languages", "web", "data", "cloudDevOps", "testing", "other"]
Base Score: 70
Final Score: 70
Updated At: 2026-02-17T...
```

### 2.2 Default Skills When Empty
1. Go to `/analyze`
2. Paste generic JD:
```
We need a developer who can code well and communicate effectively.
```
3. ✓ Warning: "This JD is too short..."
4. Company: leave empty
5. Click "Analyze"
6. ✓ Goes to results
7. Click "Skills" tab
8. ✓ Under "Other" category, see: Communication, Problem solving, Basic coding, Projects
9. In console:
```javascript
const entry = JSON.parse(localStorage.getItem('placement_history'))[0]
console.log('Other skills:', entry.extractedSkills.other)
console.log('isEmpty:', entry.extractedSkills.isEmpty)
```
10. ✓ Shows default skills and isEmpty = true

---

## Test 3: Score Stability (2 minutes)

### 3.1 Base Score Immutable
1. Complete any analysis (you'll have multiple from tests)
2. Note the base score from score card (e.g., "55 (55 base)")
3. In "Skills" tab, hover over any skill
4. Click skill to mark as "I know this"
5. ✓ Final score changes (e.g., "57 (55 base)")
6. ✓ Base score in parentheses stays same
7. Mark another skill as "Need practice"
8. ✓ Final score decreases (e.g., "55 (55 base)")
9. ✓ Base score still unchanged

### 3.2 Final Score Persistence
1. From Test 3.1, note current finalScore
2. Go to `/history`
3. ✓ Score shown matches finalScore
4. Click "View" to open that entry
5. ✓ Score persists (same as history view)
6. Mark another skill with confidence
7. Refresh page (Cmd+R / Ctrl+R)
8. ✓ Score update persisted
9. ✓ Skill confidence preserved

---

## Test 4: History Robustness (2 minutes)

### 4.1 Multiple Entries
1. Create 3 analyses (can use different test JDs)
2. Go to `/history`
3. ✓ All 3 appear with correct scores
4. Click "View" on first entry
5. ✓ Opens correct entry with correct data
6. Back to /history using back button
7. ✓ History still shows all 3
8. Mark skill confidence on entry 1
9. Go back to /history
10. ✓ Score updated in history list

### 4.2 Delete Entry
1. In /history, click "Delete" on any entry
2. ✓ Confirm dialog appears
3. Click "Delete" (or "Cancel" to keep)
4. ✓ Entry removed from list immediately

### 4.3 Clear All
1. In /history with entries present
2. Click "Clear All" button
3. ✓ Confirm dialog: "Clear all history? This cannot be undone."
4. Click "Cancel"
5. ✓ Entries still there
6. Click "Clear All" again
7. Confirm deletion
8. ✓ All entries deleted
9. ✓ Shows "No analyses yet"

---

## Test 5: Optional Fields & Sanitization (1 minute)

### 5.1 Empty Company/Role
1. Go to `/analyze`
2. Leave Company and Role empty
3. Paste valid JD
4. Click "Analyze"
5. On results page
6. ✓ Title shows "Unknown Company"
7. ✓ Subtitle shows "Unknown Role"
8. Go to /history
9. ✓ Shows "Unknown Company" and "Unknown Role"

### 5.2 Long Company/Role
1. Go to `/analyze`
2. In Company field, try to type > 100 characters
3. ✓ Input stops at ~100 chars (HTML maxlength)
4. Same for Role field

---

## Test 6: Error Handling (Advanced - Optional)

### 6.1 Corrupted localStorage (Manual)
1. Open browser DevTools Console
2. Run:
```javascript
localStorage.setItem('placement_history', JSON.stringify([
  { id: "bad1", createdAt: "bad" },
  { id: "bad2" } // missing required fields
]))
```
3. Refresh page
4. Go to `/history`
5. ✓ Amber error banner appears: "Data Loading Issue"
6. ✓ Message: "One saved entry couldn't be loaded..."
7. ✓ "Create Your First Analysis" button shown
8. Create new analysis
9. ✓ Works normally

---

## Test 7: Visual Feedback (1 minute)

### 7.1 Validation Messages
1. Go to `/analyze`
2. JD textarea: type then delete to make empty
3. ✓ Red error banner appears: "Job Description is required"
4. Type 50 characters
5. ✓ Amber warning appears with remaining chars needed
6. Type 200+ characters
7. ✓ All warnings/errors disappear
8. ✓ "Analyze" button becomes enabled

### 7.2 Company/Role Max Length Visual
1. Try to paste long company name (> 100 chars)
2. ✓ Input caps at ~100 characters
3. Same for Role

---

## Verification Checklist

- [ ] Test 1: Input validation works (empty, short, valid)
- [ ] Test 2: Schema normalized with all 7 categories
- [ ] Test 2: Default skills populated when empty
- [ ] Test 3: Base score immutable, final score changes
- [ ] Test 3: Scores persist across page refresh
- [ ] Test 4: Multiple entries display correctly
- [ ] Test 4: Delete entry works
- [ ] Test 4: Clear all works with confirmation
- [ ] Test 5: Empty company/role shows "Unknown"
- [ ] Test 5: Input length capped at 100 chars
- [ ] Test 6: Corrupted data handled gracefully
- [ ] Test 7: Validation messages display correctly

---

## Common Issues & Troubleshooting

**Issue:** "Analyze" button always disabled
- Check JD textarea has > 0 characters and JD validation passes
- Console: `localStorage.setItem('placement_history', '[]')` to reset

**Issue:** Scores not persisting
- Check browser localStorage enabled
- Open DevTools → Application → Local Storage → check placement_history key
- Verify updatedAt timestamp is current on entry

**Issue:** Default skills not showing
- Paste very minimal JD
- Check console for skill extraction: `extractSkills("minimal text").isEmpty` should be true

**Issue:** History error banner won't go away
- Console: `localStorage.clear()` to reset
- Then refresh page

---

## Performance Notes

- Input validation is instant (client-side)
- Score calculations < 1ms
- localStorage read/write < 10ms
- Schema normalization < 5ms per entry
- All operations should feel snappy

---

## Success = Green ✅

When all 7 tests pass with ✓ marks, data hardening is complete and verified.

Expected time: ~10 minutes for full verification
