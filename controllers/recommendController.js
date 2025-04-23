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
    coreSubjects: [
      "Accounting",
      "Finance",
      "Business Organization and Management",
      "Marketing",
    ],
    secondarySubjects: ["Management", "Economics"],
    strengths: ["Leadership", "Communication"],
    restricted: [],
  },

  Civil_Engineering: {
    coreSubjects: ["Physics", "Chemistry", "Higher Math"],
    secondarySubjects: ["ICT"],
    strengths: ["Problem-solving", "Analytical Skills", "Teamwork"],
    restricted: ["Commerce", "Arts"],
  },

  Pharmacy: {
    coreSubjects: ["Biology", "Chemistry", "Higher Math"],
    secondarySubjects: ["Physics", "ICT"],
    strengths: ["Memorization", "Attention to Detail"],
    restricted: ["Commerce", "Arts"],
  },
  Biochemistry: {
    coreSubjects: ["Biology", "Chemistry", "Higher Math"],
    secondarySubjects: ["Physics", "ICT"],
    strengths: ["Memorization", "Attention to Detail", "Critical Thinking"],
    restricted: ["Commerce", "Arts"],
  },

  Law: {
    coreSubjects: ["Civic & Governance", "English", "Logic"],
    secondarySubjects: ["Sociology", "History"],
    strengths: ["Logical Reasoning", "Memorization", "Communication"],
    restricted: [],
  },

  Media_Studies: {
    coreSubjects: ["Social Work"],
    secondarySubjects: ["ICT"],
    strengths: ["Creativity", "Communication", "Critical Thinking"],
    restricted: [],
  },
  English: {
    coreSubjects: ["English", "Bangla", "Literature"],
    secondarySubjects: ["History", "Social Work"],
    strengths: ["Communication", "Creativity", "Critical Analysis"],
    restricted: [],
  },
  Bangla: {
    coreSubjects: ["English", "Bangla", "Literature"],
    secondarySubjects: ["History", "Social Work"],
    strengths: ["Communication", "Creativity", "Critical Analysis"],
    restricted: [],
  },

  Economics: {
    coreSubjects: ["Economics", "Math", "Accounting"],
    secondarySubjects: ["Finance", "ICT"],
    strengths: ["Analytical Skills"],
    restricted: [],
  },
  Social_Science: {
    coreSubjects: ["Social Work", "Sociology", "Civic"],
    secondarySubjects: ["English", "ICT"],
    strengths: ["Teamwork", "Communication"],
    restricted: [],
  },
};

const calculateScore = (major, subjects, strengths) => {
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
};

const getRecommendations = (req, res) => {
  console.log(req.body);
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
};

module.exports = {
  getRecommendations,
};
