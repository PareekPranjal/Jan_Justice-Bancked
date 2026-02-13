import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import connectDB from '../config/database.js';

dotenv.config();

const courses = [
  {
    title: 'Contract Law Fundamentals',
    description: 'Master the essential principles of contract law and drafting',
    detailedDescription: 'This comprehensive course covers the fundamental principles of contract law, including formation, interpretation, performance, and breach. Learn to draft, review, and negotiate contracts with confidence. Perfect for legal professionals, business owners, and law students.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    duration: '8 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 1234,
    certified: true,
    price: {
      current: 299,
      original: 499,
      currency: 'USD',
    },
    discount: 40,
    features: [
      'Comprehensive video lectures',
      'Interactive case studies',
      'Downloadable templates',
      'Certificate of completion',
      'Lifetime access to materials',
      'Expert instructor support',
    ],
    modules: [
      {
        title: 'Introduction to Contract Law',
        lessons: [
          'What is a Contract?',
          'Elements of a Valid Contract',
          'Types of Contracts',
          'Contract vs. Agreement',
        ],
      },
      {
        title: 'Contract Formation',
        lessons: [
          'Offer and Acceptance',
          'Consideration',
          'Intention to Create Legal Relations',
          'Capacity to Contract',
        ],
      },
      {
        title: 'Contract Terms and Interpretation',
        lessons: [
          'Express and Implied Terms',
          'Conditions and Warranties',
          'Exclusion Clauses',
          'Rules of Interpretation',
        ],
      },
      {
        title: 'Contract Performance and Breach',
        lessons: [
          'Performance and Discharge',
          'Breach of Contract',
          'Remedies for Breach',
          'Damages and Specific Performance',
        ],
      },
      {
        title: 'Contract Drafting',
        lessons: [
          'Drafting Best Practices',
          'Common Contract Clauses',
          'Review and Negotiation',
          'Practical Exercises',
        ],
      },
    ],
    instructor: {
      name: 'Prof. Michael Chen',
      title: 'Senior Partner at Chen & Associates',
      bio: 'Professor Michael Chen brings over 20 years of experience in contract law and commercial litigation. He has taught at leading law schools and advises Fortune 500 companies on complex contractual matters.',
      initials: 'MC',
    },
    category: 'Contract Law',
    videoHours: '24 hours',
    resources: 45,
    isActive: true,
  },
  {
    title: 'Advanced Corporate Law & Mergers',
    description: 'Expert-level insights into corporate governance and M&A transactions',
    detailedDescription: 'Dive deep into advanced corporate law topics including mergers and acquisitions, corporate governance, securities law, and regulatory compliance. This course is designed for experienced legal professionals looking to specialize in corporate law and M&A transactions.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    duration: '12 weeks',
    level: 'Advanced',
    rating: 4.9,
    students: 856,
    certified: true,
    price: {
      current: 599,
      original: 999,
      currency: 'USD',
    },
    discount: 40,
    features: [
      'Advanced case analysis',
      'Real M&A transaction reviews',
      'Due diligence frameworks',
      'Professional certification',
      'Networking opportunities',
      'Guest lectures from industry experts',
    ],
    modules: [
      {
        title: 'Corporate Governance',
        lessons: [
          'Board of Directors Duties',
          'Shareholder Rights',
          'Corporate Compliance',
          'Regulatory Framework',
        ],
      },
      {
        title: 'Mergers and Acquisitions',
        lessons: [
          'M&A Transaction Structure',
          'Due Diligence Process',
          'Valuation Methods',
          'Deal Documentation',
        ],
      },
      {
        title: 'Securities Law',
        lessons: [
          'Securities Regulation Overview',
          'Public Offerings',
          'Private Placements',
          'Disclosure Requirements',
        ],
      },
      {
        title: 'Corporate Restructuring',
        lessons: [
          'Bankruptcy and Insolvency',
          'Debt Restructuring',
          'Asset Sales',
          'Spin-offs and Divestitures',
        ],
      },
      {
        title: 'International Corporate Law',
        lessons: [
          'Cross-border Transactions',
          'Foreign Investment',
          'Tax Considerations',
          'Regulatory Compliance',
        ],
      },
      {
        title: 'Practical Applications',
        lessons: [
          'Case Studies',
          'Transaction Simulations',
          'Drafting Exercises',
          'Final Project',
        ],
      },
    ],
    instructor: {
      name: 'Dr. Sarah Williams',
      title: 'Former M&A Partner at Global Law Firm',
      bio: 'Dr. Sarah Williams has led over $50 billion in M&A transactions throughout her career. She specializes in cross-border deals and corporate governance, and has been recognized as one of the top corporate lawyers globally.',
      initials: 'SW',
    },
    category: 'Corporate Law',
    videoHours: '40 hours',
    resources: 78,
    isActive: true,
  },
  {
    title: 'International Trade Law',
    description: 'Navigate the complexities of global trade regulations and agreements',
    detailedDescription: 'Explore the legal framework governing international trade, including WTO agreements, trade remedies, customs law, and international commercial transactions. Learn to advise clients on cross-border trade compliance and dispute resolution.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    duration: '10 weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 967,
    certified: true,
    price: {
      current: 399,
      original: 699,
      currency: 'USD',
    },
    discount: 43,
    features: [
      'WTO case law analysis',
      'Trade agreement templates',
      'Customs compliance guides',
      'International arbitration insights',
      'Global trade updates',
      'Certificate of completion',
    ],
    modules: [
      {
        title: 'Foundations of International Trade',
        lessons: [
          'History and Evolution',
          'Key International Organizations',
          'Trade Theories and Principles',
          'Legal Framework Overview',
        ],
      },
      {
        title: 'WTO Law and Agreements',
        lessons: [
          'GATT Principles',
          'WTO Dispute Settlement',
          'Services Trade (GATS)',
          'TRIPS Agreement',
        ],
      },
      {
        title: 'Regional Trade Agreements',
        lessons: [
          'FTA Structures',
          'EU Trade Law',
          'USMCA and NAFTA',
          'Asia-Pacific Agreements',
        ],
      },
      {
        title: 'Trade Remedies',
        lessons: [
          'Anti-dumping Measures',
          'Countervailing Duties',
          'Safeguards',
          'Investigation Procedures',
        ],
      },
      {
        title: 'Customs and Compliance',
        lessons: [
          'Customs Valuation',
          'Rules of Origin',
          'Import/Export Controls',
          'Trade Sanctions',
        ],
      },
      {
        title: 'International Commercial Contracts',
        lessons: [
          'Incoterms',
          'Letters of Credit',
          'International Arbitration',
          'Cross-border Disputes',
        ],
      },
    ],
    instructor: {
      name: 'Ambassador James Rodriguez',
      title: 'Former Trade Negotiator & Legal Advisor',
      bio: 'Ambassador Rodriguez served as chief trade negotiator for multiple international agreements and has extensive experience in WTO dispute settlement. He currently advises governments and multinational corporations on trade policy.',
      initials: 'JR',
    },
    category: 'International Law',
    videoHours: '32 hours',
    resources: 62,
    isActive: true,
  },
  {
    title: 'Intellectual Property Essentials',
    description: 'Protect and leverage intellectual property rights effectively',
    detailedDescription: 'Gain a comprehensive understanding of intellectual property law covering patents, trademarks, copyrights, and trade secrets. Learn to protect IP assets, draft licensing agreements, and handle IP disputes in the digital age.',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
    duration: '6 weeks',
    level: 'Beginner',
    rating: 4.6,
    students: 1543,
    certified: true,
    price: {
      current: 249,
      original: 449,
      currency: 'USD',
    },
    discount: 45,
    features: [
      'IP portfolio management',
      'Patent search tools',
      'Trademark registration guide',
      'Copyright best practices',
      'Licensing agreement templates',
      'Digital IP protection strategies',
    ],
    modules: [
      {
        title: 'Introduction to IP Law',
        lessons: [
          'What is Intellectual Property?',
          'Types of IP Rights',
          'IP Protection Strategies',
          'International IP Framework',
        ],
      },
      {
        title: 'Patent Law',
        lessons: [
          'Patentability Requirements',
          'Patent Application Process',
          'Patent Prosecution',
          'Patent Infringement',
        ],
      },
      {
        title: 'Trademark Law',
        lessons: [
          'Trademark Basics',
          'Registration Process',
          'Trademark Enforcement',
          'Domain Names and Trademarks',
        ],
      },
      {
        title: 'Copyright Law',
        lessons: [
          'Copyright Protection',
          'Fair Use Doctrine',
          'Digital Copyright Issues',
          'Copyright Registration',
        ],
      },
      {
        title: 'Trade Secrets',
        lessons: [
          'Trade Secret Protection',
          'Confidentiality Agreements',
          'Employee IP Rights',
          'Trade Secret Litigation',
        ],
      },
      {
        title: 'IP Licensing and Commercialization',
        lessons: [
          'Licensing Fundamentals',
          'Technology Transfer',
          'Royalty Structures',
          'IP Valuation',
        ],
      },
    ],
    instructor: {
      name: 'Lisa Park',
      title: 'IP Attorney & Tech Startup Advisor',
      bio: 'Lisa Park has prosecuted hundreds of patents for tech companies and startups. She specializes in software patents, trademark portfolio management, and IP strategy for emerging technologies including AI and blockchain.',
      initials: 'LP',
    },
    category: 'Intellectual Property',
    videoHours: '18 hours',
    resources: 38,
    isActive: true,
  },
];

const seedCourses = async () => {
  try {
    await connectDB();

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Courses cleared');

    // Insert sample courses
    await Course.insertMany(courses);
    console.log('Sample courses added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
