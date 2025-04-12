const readline = require('readline-sync');

// Data Configuration
const MAJORS = {
  CSE: {
    coreSubjects: ['IT', 'Higher Math', 'Physics'],
    secondarySubjects: ['Chemistry'],
    strengths: ['Problem-solving', 'Technical Aptitude', 'Creativity'],
    restricted: ['Commerce', 'Arts']
  },
  EEE: {
    coreSubjects: ['Physics', 'Higher Math', 'Chemistry'],
    secondarySubjects: ['IT', 'Biology'],
    strengths: ['Analytical Skills', 'Technical Aptitude'],
    restricted: ['Commerce', 'Arts']
  },
  BBA: {
    coreSubjects: ['Accounting', 'Finance', 'Economics'],
    secondarySubjects: ['Management', 'ICT'],
    strengths: ['Leadership', 'Communication'],
    restricted: []
  }
  // Add other majors similarly
};

const SUBJECTS_BY_STEM = {
  Science: ['Bangla', 'English', 'IT', 'Physics', 'Chemistry', 'Biology', 'Higher Math'],
  Commerce: ['Bangla', 'English', 'IT', 'Accounting', 'Finance', 'Management', 'Marketing', 'Economics'],
  Arts: ['Bangla', 'English', 'IT', 'Civic & Governance', 'Economics', 'History', 'Social Work', 'Sociology', 'Logic']
};

const STRENGTHS = ['Problem-solving', 'Analytical Skills', 'Memorization', 'Creativity', 'Communication', 'Technical Aptitude'];

// Helper Functions
function getRating(prompt, options) {
  let input;
  do {
    input = readline.question(prompt).trim().toLowerCase();
  } while (!['very good', 'average', 'not good'].includes(input));
  return input;
}

function calculateScore(major, subjects, strengths) {
  let total = 0;
  let maxPossible = 0;
  let missingCores = 0;

  // Calculate subject scores
  major.coreSubjects.forEach(subject => {
    const rating = subjects[subject] || 'Not Good';
    const weight = rating === 'Very Good' ? 3 : rating === 'Average' ? 2 : 0;
    total += weight * 3; // Core subjects have 3x weight
    maxPossible += 3 * 3;
    if (rating === 'Not Good') missingCores++;
  });

  major.secondarySubjects.forEach(subject => {
    const rating = subjects[subject] || 'Not Good';
    const weight = rating === 'Very Good' ? 3 : rating === 'Average' ? 2 : 0;
    total += weight * 1; // Secondary subjects have 1x weight
    maxPossible += 3 * 1;
  });

  // Calculate strength scores (40% weight)
  const strengthScore = major.strengths.reduce((acc, strength) => {
    return acc + (strengths[strength] === 'Very Good' ? 3 : 
                strengths[strength] === 'Average' ? 2 : 0);
  }, 0);
  
  const maxStrengthScore = major.strengths.length * 3;
  total += (strengthScore / maxStrengthScore) * (maxPossible * 0.4);

  // Apply penalties for missing core subjects
  if (missingCores > 0) total *= Math.max(0, 1 - (missingCores * 0.2));

  return (total / maxPossible) * 100;
}

// Main Flow
function main() {
  // Step 1: Get STEM
  const stem = readline.question('Which STEM did you study? (Science/Commerce/Arts): ').trim();

  // Step 2: Get subject ratings
  const subjects = {};
  SUBJECTS_BY_STEM[stem].forEach(subject => {
    subjects[subject] = getRating(`Rate your performance in ${subject} (Very Good/Average/Not Good): `);
  });

  // Step 3: Get strength ratings
  const strengths = {};
  STRENGTHS.forEach(strength => {
    strengths[strength] = getRating(`Rate your ${strength} (Very Good/Average/Not Good): `);
  });

  // Step 4: Calculate recommendations
  const recommendations = [];
  Object.entries(MAJORS).forEach(([majorName, majorData]) => {
    if (majorData.restricted.includes(stem)) return;

    const score = calculateScore(majorData, subjects, strengths);
    recommendations.push({
      name: majorName,
      score: score,
      tier: score >= 70 ? 'Tier 1' : score >= 50 ? 'Tier 2' : 'Tier 3'
    });
  });

  // Sort and display results
  recommendations.sort((a, b) => b.score - a.score);
  console.log('\nRecommendations:');
  recommendations.forEach(rec => {
    console.log(`${rec.name.padEnd(15)} ${Math.round(rec.score)}% ${rec.tier}`);
  });
}

main();