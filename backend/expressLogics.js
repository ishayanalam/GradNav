// routes/recommendation.js

const express = require("express");
const router = express.Router();

// ======= Data Configuration =======
const MAJORS = {
  CSE: {
    coreSubjects: ["ICT", "Higher Math", "Physics"],
    secondarySubjects: ["Chemistry"],
    strengths: ["Problem-solving", "Technical Aptitude", "Creativity"],
    restricted: ["Commerce", "Arts"],
  },
  EEE: {
    coreSubjects: ["Physics", "Higher Math", "Chemistry"],
    secondarySubjects: ["ICT", "Biology"],
    strengths: ["Analytical Skills", "Technical Aptitude"],
    restricted: ["Commerce", "Arts"],
  },
  BBA: {
    coreSubjects: ["Accounting", "Finance", "Economics"],
    secondarySubjects: ["Management", "ICT"],
    strengths: ["Leadership", "Communication"],
    restricted: [],
  },
};

const STRENGTHS = [
  "Problem-solving",
  "Analytical Skills",
  "Memorization",
  "Creativity",
  "Communication",
  "Technical Aptitude",
];

// ======= Helper Functions =======
function calculateScore(major, subjects, strengths) {
  let total = 0;
  let maxPossible = 0;
  let missingCores = 0;

  major.coreSubjects.forEach((subject) => {
    const rating = subjects[subject] || "Not Good";
    const weight = rating === "Very Good" ? 3 : rating === "Average" ? 2 : 0;
    total += weight * 3;
    maxPossible += 3 * 3;
    if (rating === "Not Good") missingCores++;
  });

  major.secondarySubjects.forEach((subject) => {
    const rating = subjects[subject] || "Not Good";
    const weight = rating === "Very Good" ? 3 : rating === "Average" ? 2 : 0;
    total += weight * 1;
    maxPossible += 3 * 1;
  });

  const strengthScore = major.strengths.reduce((acc, strength) => {
    return (
      acc +
      (strengths[strength] === "Very Good"
        ? 3
        : strengths[strength] === "Average"
        ? 2
        : 0)
    );
  }, 0);

  const maxStrengthScore = major.strengths.length * 3;
  total += (strengthScore / maxStrengthScore) * (maxPossible * 0.4);

  if (missingCores > 0) total *= Math.max(0, 1 - missingCores * 0.2);

  return (total / maxPossible) * 100;
}

// ======= Route Handler =======
router.post("/recommendations", (req, res) => {
  const { stem, subjects, strengths } = req.body;

  if (!stem || !subjects || !strengths) {
    return res.status(400).json({ message: "Missing data in request body" });
  }

  const recommendations = [];
  Object.entries(MAJORS).forEach(([majorName, majorData]) => {
    if (majorData.restricted.includes(stem)) return;

    const score = calculateScore(majorData, subjects, strengths);
    recommendations.push({
      name: majorName,
      score: Math.round(score),
      tier: score >= 70 ? "Tier 1" : score >= 50 ? "Tier 2" : "Tier 3",
    });
  });

  recommendations.sort((a, b) => b.score - a.score);
  res.json({ recommendations });
});

module.exports = router;
