export function format7DayPlan(plan) {
  let text = "7-DAY PREPARATION PLAN\n"
  text += "=".repeat(50) + "\n\n"

  plan.forEach(day => {
    text += `DAY ${day.day}: ${day.title}\n`
    text += `Focus: ${day.focus}\n`
    text += "-".repeat(40) + "\n"
    day.tasks.forEach(task => {
      text += `• ${task}\n`
    })
    text += "\n"
  })

  return text
}

export function formatChecklist(checklist) {
  let text = "INTERVIEW PREPARATION CHECKLIST\n"
  text += "=".repeat(50) + "\n\n"

  checklist.forEach(round => {
    text += `ROUND ${round.round}: ${round.title}\n`
    text += "-".repeat(40) + "\n"
    round.items.forEach(item => {
      text += `☐ ${item}\n`
    })
    text += "\n"
  })

  return text
}

export function formatQuestions(questions) {
  let text = "10 INTERVIEW QUESTIONS\n"
  text += "=".repeat(50) + "\n\n"

  questions.forEach((q, i) => {
    text += `${i + 1}. ${q}\n\n`
  })

  return text
}

export function formatCompleteExport(entry) {
  let text = `PLACEMENT READINESS ANALYSIS\n`
  text += `Company: ${entry.company}\n`
  text += `Role: ${entry.role}\n`
  text += `Date: ${new Date(entry.createdAt).toLocaleDateString()}\n`
  text += `Readiness Score: ${entry.readinessScore}/100\n`
  text += "=".repeat(50) + "\n\n"

  // Skills
  text += "KEY SKILLS EXTRACTED\n"
  text += "-".repeat(40) + "\n"
  Object.entries(entry.extractedSkills.categorized || {}).forEach(([key, keywords]) => {
    const categoryMap = {
      coreCS: 'Core CS',
      languages: 'Languages',
      web: 'Web',
      data: 'Data',
      cloudDevOps: 'Cloud/DevOps',
      testing: 'Testing'
    }
    text += `${categoryMap[key]}: ${keywords.join(', ')}\n`
  })
  text += "\n"

  // 7-Day Plan
  text += format7DayPlan(entry.plan)
  text += "\n"

  // Checklist
  text += formatChecklist(entry.checklist)
  text += "\n"

  // Questions
  text += formatQuestions(entry.questions)

  return text
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Copied to clipboard!')
      alert('Copied to clipboard!')
    })
    .catch(err => {
      console.error('Failed to copy:', err)
      alert('Failed to copy. Please try again.')
    })
}

export function downloadAsFile(text, filename = 'analysis.txt') {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
