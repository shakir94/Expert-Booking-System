require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Expert = require('../models/Expert');

const experts = [
  {
    name: 'Dr. Sarah Mitchell',
    category: 'Technology',
    specialization: 'AI & Machine Learning',
    experience: 12,
    rating: 4.9,
    bio: 'PhD in Computer Science from MIT. Former Google AI researcher with expertise in deep learning and NLP.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    hourlyRate: 150,
    availableSlots: generateSlots(),
  },
  {
    name: 'James Rodriguez',
    category: 'Finance',
    specialization: 'Investment Strategy',
    experience: 15,
    rating: 4.8,
    bio: 'CFA charterholder with 15 years on Wall Street. Specializes in portfolio management and risk assessment.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    hourlyRate: 200,
    availableSlots: generateSlots(),
  },
  {
    name: 'Dr. Priya Sharma',
    category: 'Healthcare',
    specialization: 'Mental Health & Wellness',
    experience: 10,
    rating: 4.7,
    bio: 'Licensed psychologist specializing in cognitive behavioral therapy and stress management.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    hourlyRate: 120,
    availableSlots: generateSlots(),
  },
  {
    name: 'Marcus Thompson',
    category: 'Business',
    specialization: 'Startup Strategy & Growth',
    experience: 8,
    rating: 4.6,
    bio: 'Serial entrepreneur who has founded 3 successful startups. Expert in go-to-market strategy.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    hourlyRate: 175,
    availableSlots: generateSlots(),
  },
  {
    name: 'Emma Chen',
    category: 'Technology',
    specialization: 'UI/UX Design',
    experience: 7,
    rating: 4.8,
    bio: 'Senior product designer at top tech companies. Expert in user research and design systems.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    hourlyRate: 130,
    availableSlots: generateSlots(),
  },
  {
    name: 'Robert Davis',
    category: 'Legal',
    specialization: 'Corporate Law',
    experience: 20,
    rating: 4.9,
    bio: 'Partner at a leading law firm with expertise in M&A, IP, and startup legal needs.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    hourlyRate: 300,
    availableSlots: generateSlots(),
  },
  {
    name: 'Dr. Lisa Nguyen',
    category: 'Healthcare',
    specialization: 'Nutrition & Dietetics',
    experience: 9,
    rating: 4.5,
    bio: 'Registered dietitian and sports nutritionist working with professional athletes and executives.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    hourlyRate: 100,
    availableSlots: generateSlots(),
  },
  {
    name: 'Alex Turner',
    category: 'Marketing',
    specialization: 'Digital Marketing & SEO',
    experience: 6,
    rating: 4.4,
    bio: 'Growth hacker who has scaled multiple brands from 0 to 7 figures using data-driven strategies.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    hourlyRate: 110,
    availableSlots: generateSlots(),
  },
  {
    name: 'Jennifer Walsh',
    category: 'Business',
    specialization: 'Executive Coaching',
    experience: 18,
    rating: 4.7,
    bio: 'ICF-certified executive coach who has worked with C-suite leaders at Fortune 500 companies.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    hourlyRate: 250,
    availableSlots: generateSlots(),
  },
  {
    name: 'David Kim',
    category: 'Finance',
    specialization: 'Tax Planning & Accounting',
    experience: 14,
    rating: 4.6,
    bio: 'CPA with expertise in individual and corporate tax optimization strategies.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    hourlyRate: 160,
    availableSlots: generateSlots(),
  },
  {
    name: 'Sophia Patel',
    category: 'Technology',
    specialization: 'Cybersecurity',
    experience: 11,
    rating: 4.8,
    bio: 'CISSP certified security expert. Former NSA consultant specializing in enterprise security architecture.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    hourlyRate: 190,
    availableSlots: generateSlots(),
  },
  {
    name: 'Carlos Mendez',
    category: 'Marketing',
    specialization: 'Brand Strategy',
    experience: 13,
    rating: 4.5,
    bio: 'Brand strategist with experience building global campaigns for Nike, Apple, and Fortune 500 brands.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    hourlyRate: 145,
    availableSlots: generateSlots(),
  },
];

function generateSlots() {
  const slots = [];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  for (let d = 1; d <= 14; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue; 
    const dateStr = date.toISOString().split('T')[0];
    times.forEach((time) => {
      slots.push({ date: dateStr, time, isBooked: false });
    });
  }
  return slots;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expert-booking');
    await Expert.deleteMany({});
    await Expert.insertMany(experts);
    console.log(`Seeded ${experts.length} experts successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
