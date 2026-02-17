# Data Hardening - Edge Case Verification

## Detailed Edge Case Scenarios & Expected Behavior

This document shows **what should happen** for each edge case, helping you verify the hardening is working correctly.

---

## Edge Case #1: Empty JD Analysis

**Scenario:** User clicks Analyze with empty JD textarea

**Expected Behavior:**
```
❌ Red error banner: "Job Description is required"
❌ Analyze button: DISABLED
📊 Analysis: NOT performed
💾 Entry: NOT saved
```

**How to Test:**
1. Go to `/analyze`
2. Leave JD empty
3. Click "Analyze" (if button is enabled, this is a bug)

**Success Criteria:** ✓ Button disabled, ✓ Error shows, ✓ Nothing saved

---

## Edge Case #2: Very Short JD (Under 100 chars)

**Scenario:** User submits JD with only 50 characters

**Expected Behavior:**
```
⚠️  Amber warning banner: "This JD is too short to analyze deeply"
📝 Character counter: "50 more characters for best results"
✅ Analyze button: ENABLED (user choice to proceed)
💾 Entry: SAVED (analysis proceeds despite warning)
🤖 Skills: Defaults used if nothing detected
```

**How to Test:**
```javascript
// In JD field, paste:
"Senior developer, 5+ years experience needed"
// Click Analyze
```

**Success Criteria:**
- ✓ Warning visible with character count
- ✓ Button enabled (not disabled)
- ✓ Analysis proceeds when clicked
- ✓ Entry saved in history

---

## Edge Case #3: Perfect JD (250+ chars)

**Scenario:** User submits complete JD with 250+ characters

**Expected Behavior:**
```
✅ No warnings or errors
✅ Analyze button: ENABLED
💾 Entry: SAVED with full extraction
🤖 Skills: Detected from keywords (Communication, DSA, Web, etc.)
📊 Score: Calculated normally (likely 60-75 range)
```

**How to Test:**
```javascript
// In JD field, paste this exact text:
"Senior Full Stack Developer at Tech Company
We are looking for a software engineer with 5+ years experience.
Strong DSA skills and system design knowledge required.
Tech stack: Java, Python, JavaScript, React, Node.js, MongoDB, PostgreSQL.
Must understand OOP, design patterns, and architectural principles.
Strong communication and mentoring skills needed."
// Click Analyze
```

**Success Criteria:**
- ✓ No warnings
- ✓ Entry saved
- ✓ Score shows detected skills (NOT all defaults)
- ✓ In history: entry appears with matching score

---

## Edge Case #4: Generic/Minimal JD

**Scenario:** JD has no technical keywords (communication only)

**Expected Behavior:**
```
⚠️  Amber warning: "This JD is too short to analyze deeply"
💾 Entry: SAVED
🤖 Skills: ALL show as "other" category with DEFAULT SKILLS
📝 Detected Skills: coreCS=[], languages=[], web=[], data=[], cloudDevOps=[], testing=[], other=[Communication, Problem solving, Basic coding, Projects]
✅ isEmpty: true
```

**How to Test:**
```javascript
// In JD field, paste:
"We need a developer who can work well in teams and communicate effectively."
// Click Analyze
// Go to Results → Skills tab
// Check "Other" category
```

**Success Criteria:**
- ✓ Warning shows (under 200 chars)
- ✓ Default skills appear in "Other" category
- ✓ Other 6 categories completely empty
- ✓ Console shows isEmpty: true

---

## Edge Case #5: Empty Company/Role

**Scenario:** User submits analysis without filling Company or Role

**Expected Behavior:**
```
💾 Entry: SAVED
📋 Company: Stored as ""
👤 Role: Stored as ""
🏷️  Display - Results page: "Unknown Company" / "Unknown Role"
🏷️  Display - History page: "Unknown Company" / "Unknown Role"
```

**How to Test:**
1. Go to `/analyze`
2. Leave Company empty
3. Leave Role empty
4. Paste valid JD
5. Click "Analyze"
6. ✓ Results show "Unknown Company" and "Unknown Role"
7. Go to `/history`
8. ✓ History item shows "Unknown Company" and "Unknown Role"

**Success Criteria:**
- ✓ No crashes with empty strings
- ✓ Display fallbacks work
- ✓ Data persists correctly

---

## Edge Case #6: Very Long Company/Role

**Scenario:** User pastes 150-character company name

**Expected Behavior:**
```
📝 Company input: CAPPED at 100 characters (HTML maxlength)
📝 Role input: CAPPED at 100 characters (HTML maxlength)
💾 Entry: SAVED with truncated value
```

**How to Test:**
1. Go to `/analyze`
2. Try to paste: `"This is a very long company name that goes way over 100 characters to test the maximum length validation and truncation behavior"`
3. ✓ Input stops around character 100
4. Click "Analyze"
5. ✓ Entry saves with capped value

**Success Criteria:**
- ✓ Input prevents typing beyond 100 chars
- ✓ Paste is truncated to 100 chars
- ✓ Entry saved with capped value

---

## Edge Case #7: Special Characters in JD

**Scenario:** JD contains emojis, symbols, HTML-like characters

**Expected Behavior:**
```
🧹 Sanitization: Special chars kept (no XSS vulnerability)
💾 Entry: SAVED safely
🤖 Skill extraction: Continues normally
📊 Score: Calculated correctly
```

**How to Test:**
```javascript
// In JD field, paste:
"Senior Dev & Full-Stack Engineer (5+ yrs) 🚀
Skills: <Java>, [Python], {JavaScript}, @React, #NodeJS!
Exp: DSA, OOP, DB (SQL/NoSQL), API design & System Design."
// Click Analyze
```

**Success Criteria:**
- ✓ Analysis completes without errors
- ✓ Skills still extracted correctly
- ✓ No console errors about XSS

---

## Edge Case #8: Duplicate Company Name

**Scenario:** User submits 2 analyses with same company name

**Expected Behavior:**
```
💾 Entry 1: SAVED with Google
💾 Entry 2: SAVED with Google (separate entry)
📋 History: 2 items shown, both with "Google"
🎯 Company Intel: Generated for both independently
🎭 Round Mapping: Generated for both independently
```

**How to Test:**
1. First analysis: Company = "Google", any valid JD
2. Click "Analyze"
3. Go to `/history`
4. Create second analysis: Company = "Google", different JD
5. Click "Analyze"
6. Go to `/history`
7. ✓ Shows 2 entries
8. ✓ Both have "Google" as company
9. ✓ Different scores (based on different JDs)

**Success Criteria:**
- ✓ Duplicate company names allowed
- ✓ Both entries persistent in history
- ✓ Each has independent company intel + round mapping

---

## Edge Case #9: Skill Confidence Toggle Stability

**Scenario:** User marks skill as confident, then marks as "Need practice", then back to confident

**Expected Behavior:**
```
📊 Base Score: NEVER changes
📊 Final Score: Increases with confidence, decreases with "Need practice"
💾 updatedAt: Updates on each change
📝 Skill confidence: Persists correctly
```

**How to Test:**
1. Create/view analysis with multiple extracted skills
2. Note base score: "X (X base)"
3. Click skill marked as "I know this"
4. ✓ Final score increases (e.g., 55 → 57)
5. ✓ Base score still "X base"
6. Click same skill again → "Need practice"
7. ✓ Final score decreases (e.g., 57 → 50)
8. ✓ Base score still "X base"
9. Click again → "I know this"
10. ✓ Final score back to increased (57)
11. ✓ Base score ALWAYS "X base"

**Success Criteria:**
- ✓ Base score never changes
- ✓ Final score responds to confidence
- ✓ toggles work in both directions
- ✓ Changes persist across page refresh

---

## Edge Case #10: Corrupted localStorage Entry

**Scenario:** One entry in localStorage is corrupt JSON

**Expected Behavior:**
```
⚠️  Amber error banner in /history: "Data Loading Issue"
📝 Message: "One saved entry couldn't be loaded. Create a new analysis."
✅ Other valid entries: Still displayed normally
💾 Corrupted entry: Silently skipped (not displayed)
```

**How to Test - Advanced (DevTools required):**

1. Open DevTools Console
2. Create a valid entry by doing one analysis normally
3. Go to `/history` and verify it shows
4. In Console, run:
```javascript
// Get current history
let history = JSON.parse(localStorage.getItem('placement_history'))
console.log('Original count:', history.length)

// Add corrupted entry
history.push({
  id: "corrupted",
  createdAt: "invalid-date",
  // missing most required fields
})

// Save corrupted history
localStorage.setItem('placement_history', JSON.stringify(history))
console.log('Saved with corrupted entry')
```

5. Refresh page (Cmd+R / Ctrl+R)
6. ✓ Amber error banner appears
7. ✓ Valid entries still show in list
8. ✓ Corrupted entry NOT in list

**Success Criteria:**
- ✓ Error banner visible
- ✓ Valid entries persist and display
- ✓ No console crashes
- ✓ User can create new analysis to fix

---

## Edge Case #11: Empty History

**Scenario:** User has no saved analyses

**Expected Behavior:**
```
📋 History page: "No analyses yet"
💡 Empty state: Shows "Ready to start? Go to analyze page"
🔘 Button: "Create Your First Analysis" visible
```

**How to Test:**
1. Clear localStorage: Open Console, run `localStorage.clear()`
2. Go to `/history`
3. ✓ Sees empty state message
4. Click "Create Your First Analysis"
5. ✓ Navigates to `/analyze`

**Success Criteria:**
- ✓ Empty state displays correctly
- ✓ Button navigates to correct page

---

## Edge Case #12: Large Number of Entries

**Scenario:** History has 50+ analyses

**Expected Behavior:**
```
📋 History list: All entries display
⚡ Performance: Scroll is smooth (no lag)
💾 Load time: < 2 seconds
🔍 Delete: Single entry removal works instantly
🗑️  Clear all: Removes all instantly
```

**How to Test - Programming Required:**

1. Open DevTools Console
2. Create 20+ entries quickly:
```javascript
// Warning: This will create 20 entries!
const entries = []
for (let i = 0; i < 20; i++) {
  entries.push({
    id: `test-${i}`,
    company: `Company ${i}`,
    role: `Role ${i}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    finalScore: Math.floor(Math.random() * 100),
    baseScore: Math.floor(Math.random() * 100),
    extractedSkills: {
      coreCS: ["DSA"],
      languages: ["Python"],
      web: [],
      data: [],
      cloudDevOps: [],
      testing: [],
      other: []
    },
    updatedAt: new Date().toISOString()
  })
}
localStorage.setItem('placement_history', JSON.stringify(entries))
console.log('Created 20 test entries')
```

3. Go to `/history`
4. ✓ All entries load in < 2 seconds
5. ✓ Scrolling smooth
6. ✓ Delete single entry works instantly
7. (Optional) Delete all works instantly

**Success Criteria:**
- ✓ All entries visible
- ✓ No lag on scroll
- ✓ Delete operations instant

---

## Edge Case #13: Rapid Skill Confidence Changes

**Scenario:** User rapidly clicks skill toggles (5+ times per second)

**Expected Behavior:**
```
📊 Score: Updates correctly for each click
💾 localStorage: Saves only valid final state
⏱️  No race conditions: All updates apply in order
📝 No data loss: All changes persisted
```

**How to Test:**
1. Open analysis with multiple skills
2. Rapidly click same skill 5+ times in quick succession
3. ✓ Score updates smoothly with each click
4. ✓ No console errors
5. Refresh page
6. ✓ Score matches last action
7. ✓ No intermediate states leaked

**Success Criteria:**
- ✓ No crashes under rapid input
- ✓ Final state correct
- ✓ No duplicate updates in localStorage

---

## Edge Case #14: Schema Migration (Old vs New Format)

**Scenario:** localStorage has old entry without baseScore/finalScore separation

**Expected Behavior:**
```
📝 Old format: readinessScore: 75 (no base/final separation)
🔧 Migration: normalizeEntry() converts to: baseScore: 75, finalScore: 75
💾 Storage: Updated entry saved with new format
📊 Display: Shows "75 (75 base)" in UI
```

**How to Test - Advanced:**

1. Open Console
2. Save old-format entry:
```javascript
localStorage.setItem('placement_history', JSON.stringify([{
  id: "old-entry",
  company: "Google",
  role: "SDE",
  createdAt: "2026-01-01T00:00:00Z",
  readinessScore: 75,  // Old format (no baseScore/finalScore)
  extractedSkills: {
    languages: ["Python", "Java"],
    other: []
    // Missing: coreCS, web, data, cloudDevOps, testing
  }
}]))
console.log('Saved old-format entry')
```

3. Go to `/history`
4. ✓ Entry displays (no crash)
5. Click "View"
6. ✓ Shows score correctly
7. In Console:
```javascript
const entry = JSON.parse(localStorage.getItem('placement_history'))[0]
console.log('Has baseScore:', entry.baseScore !== undefined)
console.log('Has finalScore:', entry.finalScore !== undefined)
console.log('All 7 categories:', Object.keys(entry.extractedSkills).length === 7)
```
8. ✓ Shows baseScore and finalScore exist
9. ✓ Shows all 7 skill categories exist

**Success Criteria:**
- ✓ Old entries load without crash
- ✓ Schema automatically normalized
- ✓ Score displays correctly

---

## Edge Case #15: Multiple Tabs Same Analysis

**Scenario:** User has same analysis open in 2 browser tabs

**Expected Behavior:**
```
📄 Tab 1 & Tab 2: Both show same analysis
📝 Skill toggle on Tab 1: Updates localStorage
📄 Tab 2: Shows stale data (no automatic sync across tabs)
🔄 Tab 2 refresh: Shows updated score from Tab 1
```

**How to Test:**
1. Create an analysis with detected skills
2. Open result in new tab (Cmd/Ctrl+Click on history item)
3. In Tab 1, mark a skill as confident
4. ✓ Tab 1 score updates immediately
5. Switch to Tab 2
6. ✓ Score still shows original (no automatic sync)
7. Refresh Tab 2
8. ✓ Score now matches Tab 1

**Success Criteria:**
- ✓ Tab 1 updates immediately
- ✓ Tab 2 mirrors after refresh
- ✓ No cross-tab conflicts

---

## Verification Checklist

All 15 edge cases should behave as documented:

- [ ] Edge Case #1: Empty JD blocked
- [ ] Edge Case #2: Short JD warned but allowed
- [ ] Edge Case #3: Perfect JD analyzed normally
- [ ] Edge Case #4: Generic JD uses defaults
- [ ] Edge Case #5: Empty company/role shows "Unknown"
- [ ] Edge Case #6: Long inputs capped at 100 chars
- [ ] Edge Case #7: Special characters handled safely
- [ ] Edge Case #8: Duplicate companies work independently
- [ ] Edge Case #9: Skill toggles stable and persistent
- [ ] Edge Case #10: Corrupted entry handled gracefully
- [ ] Edge Case #11: Empty history shows proper state
- [ ] Edge Case #12: Many entries perform well
- [ ] Edge Case #13: Rapid input doesn't crash
- [ ] Edge Case #14: Old schema migrates automatically
- [ ] Edge Case #15: Multi-tab works as expected

---

## Quick Command Reference

**Reset all data:**
```javascript
localStorage.clear()
```

**Check current entry:**
```javascript
const history = JSON.parse(localStorage.getItem('placement_history') || '[]')
console.log('Total entries:', history.length)
console.log('Latest entry:', history[0])
```

**Validate schema:**
```javascript
const e = history[0]
const hasAllKeys = ['coreCS', 'languages', 'web', 'data', 'cloudDevOps', 'testing', 'other']
  .every(k => k in e.extractedSkills)
console.log('Schema valid:', hasAllKeys)
```

---

**When all 15 edge cases behave as documented, data hardening is verified complete. ✅**
