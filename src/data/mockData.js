// ─── Shared mock data for all 14 PRD features ───────────────────────────────

export const mockReadinessScore = 72

export const mockScoreHistory = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: Math.max(40, Math.min(100, 55 + Math.round(Math.sin(i / 3) * 10 + i * 0.5)))
}))

export const mockDailyBriefing = {
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  delta: +4,
  topJobs: [
    { title: 'Senior Frontend Engineer', company: 'Stripe', match: 91, location: 'Remote' },
    { title: 'Full Stack Developer', company: 'Notion', match: 87, location: 'San Francisco' },
    { title: 'React Developer', company: 'Vercel', match: 83, location: 'Remote' }
  ],
  skillGaps: ['System Design', 'GraphQL'],
  recommendedAction: 'Complete the System Design assessment to boost your score by +8 points',
  insight: 'Remote React roles are up 23% this month — companies are actively hiring mid-senior engineers.'
}

export const mockProfileDimensions = [
  { name: 'Basic Info', score: 90, max: 100, weight: 10 },
  { name: 'Skills Listed', score: 75, max: 100, weight: 15 },
  { name: 'Assessments', score: 60, max: 100, weight: 20 },
  { name: 'Work Experience', score: 80, max: 100, weight: 20 },
  { name: 'Projects', score: 55, max: 100, weight: 15 },
  { name: 'GitHub Activity', score: 70, max: 100, weight: 10 },
  { name: 'LeetCode Stats', score: 45, max: 100, weight: 5 },
  { name: 'Peer Endorsements', score: 30, max: 100, weight: 5 }
]

export const mockImprovements = [
  { action: 'Add 2 more projects to your portfolio', gain: 8, effort: 'Medium' },
  { action: 'Complete the React assessment', gain: 6, effort: 'Low' },
  { action: 'Connect your GitHub account', gain: 5, effort: 'Low' },
  { action: 'Add peer endorsements', gain: 4, effort: 'Medium' }
]

export const mockSkillNodes = [
  { id: 'react', label: 'React', status: 'known', demand: 95, x: 300, y: 200 },
  { id: 'nodejs', label: 'Node.js', status: 'known', demand: 88, x: 450, y: 150 },
  { id: 'typescript', label: 'TypeScript', status: 'learning', demand: 92, x: 200, y: 300 },
  { id: 'graphql', label: 'GraphQL', status: 'gap', demand: 72, x: 550, y: 280 },
  { id: 'docker', label: 'Docker', status: 'gap', demand: 80, x: 400, y: 350 },
  { id: 'aws', label: 'AWS', status: 'gap', demand: 85, x: 600, y: 180 },
  { id: 'python', label: 'Python', status: 'known', demand: 90, x: 150, y: 180 },
  { id: 'mongodb', label: 'MongoDB', status: 'known', demand: 70, x: 350, y: 100 },
  { id: 'redis', label: 'Redis', status: 'gap', demand: 65, x: 500, y: 400 },
  { id: 'kubernetes', label: 'Kubernetes', status: 'gap', demand: 75, x: 650, y: 320 },
  { id: 'nextjs', label: 'Next.js', status: 'learning', demand: 88, x: 250, y: 400 },
  { id: 'postgres', label: 'PostgreSQL', status: 'known', demand: 78, x: 100, y: 320 }
]

export const mockCodingProblems = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', company: 'Google',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: { javascript: 'var twoSum = function(nums, target) {\n    // Your solution here\n};\n', python: 'def twoSum(nums, target):\n    # Your solution here\n    pass\n' },
    xp: 10, solved: false
  },
  {
    id: 2, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', company: 'Meta',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: { javascript: 'var isValid = function(s) {\n    // Your solution here\n};\n', python: 'def isValid(s):\n    # Your solution here\n    pass\n' },
    xp: 10, solved: true
  },
  {
    id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', company: 'Amazon',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc"' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: { javascript: 'var lengthOfLongestSubstring = function(s) {\n    // Your solution here\n};\n', python: 'def lengthOfLongestSubstring(s):\n    # Your solution here\n    pass\n' },
    xp: 25, solved: false
  }
]

export const mockLeaderboard = [
  { rank: 1, name: 'Priya S.', avatar: 'PS', solved: 3, xp: 85, streak: 12 },
  { rank: 2, name: 'Arjun M.', avatar: 'AM', solved: 3, xp: 75, streak: 7, isYou: true },
  { rank: 3, name: 'Rahul K.', avatar: 'RK', solved: 2, xp: 60, streak: 5 },
  { rank: 4, name: 'Sneha P.', avatar: 'SP', solved: 2, xp: 50, streak: 3 },
  { rank: 5, name: 'Dev T.', avatar: 'DT', solved: 1, xp: 25, streak: 1 }
]

export const mockActivityData = (() => {
  const weeks = []
  const now = new Date()
  for (let w = 51; w >= 0; w--) {
    const days = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (w * 7 + d))
      const rand = Math.random()
      days.push({
        date: date.toISOString().split('T')[0],
        count: rand > 0.4 ? Math.floor(rand * 6) : 0
      })
    }
    weeks.push(days)
  }
  return weeks
})()

export const mockLearningPath = {
  targetRole: 'Senior Frontend Engineer',
  totalDays: 60,
  currentDay: 18,
  estimatedReadyDate: 'June 15, 2026',
  weeks: [
    {
      week: 1, title: 'JavaScript Fundamentals', completed: true,
      objectives: ['Closures & Scope', 'Promises & Async/Await', 'ES6+ Features'],
      resources: [
        { title: 'JavaScript: The Hard Parts', platform: 'Frontend Masters', time: '4h', type: 'video', done: true },
        { title: 'Async JavaScript Deep Dive', platform: 'YouTube', time: '2h', type: 'video', done: true },
        { title: 'JS30 Challenge', platform: 'Wes Bos', time: '3h', type: 'practice', done: true }
      ]
    },
    {
      week: 2, title: 'React Advanced Patterns', completed: true,
      objectives: ['Custom Hooks', 'Context & State Management', 'Performance Optimization'],
      resources: [
        { title: 'Advanced React Patterns', platform: 'Kent C. Dodds', time: '5h', type: 'course', done: true },
        { title: 'React Performance', platform: 'YouTube', time: '1.5h', type: 'video', done: true },
        { title: 'Build a Custom Hook Library', platform: 'Platform', time: '2h', type: 'practice', done: false }
      ]
    },
    {
      week: 3, title: 'TypeScript Mastery', completed: false, current: true,
      objectives: ['Generics', 'Utility Types', 'Type Guards'],
      resources: [
        { title: 'TypeScript Handbook', platform: 'Official Docs', time: '3h', type: 'docs', done: true },
        { title: 'TypeScript with React', platform: 'Udemy', time: '4h', type: 'course', done: false },
        { title: 'TS Coding Challenge', platform: 'Platform', time: '1h', type: 'practice', done: false }
      ]
    },
    {
      week: 4, title: 'System Design Basics', completed: false,
      objectives: ['Scalability Concepts', 'Database Design', 'API Design'],
      resources: [
        { title: 'System Design Primer', platform: 'GitHub', time: '6h', type: 'docs', done: false },
        { title: 'Designing Data-Intensive Apps', platform: 'Book', time: '8h', type: 'reading', done: false }
      ]
    }
  ]
}

export const mockProjects = [
  {
    id: 1, title: 'Build a Real-Time Chat App', company: 'Stripe', companyLogo: '💳',
    domain: 'Frontend', difficulty: 'Medium', duration: '48h', reward: '$50 Gift Card',
    techStack: ['React', 'WebSocket', 'Node.js'], description: 'Build a real-time chat application with rooms, typing indicators, and message history.',
    applicants: 34, deadline: '48 hours', status: 'open'
  },
  {
    id: 2, title: 'Design a REST API for E-Commerce', company: 'Shopify', companyLogo: '🛍️',
    domain: 'Backend', difficulty: 'Hard', duration: '72h', reward: 'Fast Track Interview',
    techStack: ['Node.js', 'PostgreSQL', 'Redis'], description: 'Design and implement a scalable REST API for an e-commerce platform with cart, orders, and payments.',
    applicants: 21, deadline: '72 hours', status: 'open'
  },
  {
    id: 3, title: 'Data Visualization Dashboard', company: 'Tableau', companyLogo: '📊',
    domain: 'Frontend', difficulty: 'Easy', duration: '24h', reward: '$25 Gift Card',
    techStack: ['React', 'D3.js', 'CSS'], description: 'Create an interactive data visualization dashboard with charts, filters, and export functionality.',
    applicants: 58, deadline: '24 hours', status: 'open'
  }
]

export const mockInterviewQuestions = {
  hr: [
    'Tell me about yourself and your background.',
    'Why are you interested in this role?',
    'Describe a challenging project you worked on.',
    'How do you handle tight deadlines?',
    'Where do you see yourself in 5 years?'
  ],
  technical: [
    'Explain the difference between var, let, and const in JavaScript.',
    'What is the virtual DOM and how does React use it?',
    'Describe the event loop in Node.js.',
    'How would you optimize a slow React application?',
    'Explain RESTful API design principles.',
    'What is the difference between SQL and NoSQL databases?',
    'Describe a system design for a URL shortener.',
    'How does HTTPS work?'
  ]
}

export const mockReputationData = {
  score: 742,
  tier: 'Gold',
  percentile: 88,
  signals: [
    { name: 'GitHub Activity', score: 168, max: 200, icon: '🐙', trend: +12 },
    { name: 'LeetCode Rank', score: 145, max: 200, icon: '💻', trend: +8 },
    { name: 'Platform XP', score: 180, max: 200, icon: '⚡', trend: +25 },
    { name: 'Peer Ratings', score: 132, max: 200, icon: '⭐', trend: +5 },
    { name: 'Employer Endorsements', score: 117, max: 200, icon: '🏆', trend: +3 }
  ],
  history: [
    { month: 'Nov', score: 580 }, { month: 'Dec', score: 610 }, { month: 'Jan', score: 645 },
    { month: 'Feb', score: 672 }, { month: 'Mar', score: 710 }, { month: 'Apr', score: 742 }
  ]
}

export const mockOpportunityJobs = [
  { id: 1, title: 'Senior React Developer', company: 'Stripe', location: 'Remote', salary: '$140k–$180k', opportunityScore: 92, urgency: 'hot', matchPct: 91, applicants: 23, posted: '2 days ago', factors: { posting_age: 95, applicant_volume: 88, hiring_velocity: 94, role_match: 91, competition: 85 } },
  { id: 2, title: 'Full Stack Engineer', company: 'Notion', location: 'SF / Remote', salary: '$130k–$160k', opportunityScore: 78, urgency: 'warm', matchPct: 87, applicants: 67, posted: '5 days ago', factors: { posting_age: 80, applicant_volume: 72, hiring_velocity: 78, role_match: 87, competition: 70 } },
  { id: 3, title: 'Frontend Engineer', company: 'Linear', location: 'Remote', salary: '$120k–$150k', opportunityScore: 85, urgency: 'hot', matchPct: 89, applicants: 31, posted: '1 day ago', factors: { posting_age: 98, applicant_volume: 82, hiring_velocity: 88, role_match: 89, competition: 80 } },
  { id: 4, title: 'React Native Developer', company: 'Airbnb', location: 'NYC', salary: '$150k–$190k', opportunityScore: 44, urgency: 'cool', matchPct: 72, applicants: 189, posted: '14 days ago', factors: { posting_age: 40, applicant_volume: 35, hiring_velocity: 55, role_match: 72, competition: 30 } }
]

export const mockPeerRooms = [
  { id: 1, name: 'LeetCode Hard Grind', topic: 'Dynamic Programming', participants: 3, maxParticipants: 4, language: 'Python', difficulty: 'Hard', host: 'Priya S.' },
  { id: 2, name: 'System Design Practice', topic: 'System Design', participants: 2, maxParticipants: 4, language: 'Any', difficulty: 'Medium', host: 'Rahul K.' },
  { id: 3, name: 'JS Interview Prep', topic: 'JavaScript', participants: 1, maxParticipants: 4, language: 'JavaScript', difficulty: 'Easy', host: 'Sneha P.' }
]
