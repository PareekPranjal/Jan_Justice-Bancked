import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Job from '../models/Job.js';

dotenv.config();

const sampleJobs = [
  {
    title: "Senior Legal Associate",
    company: "LexIsis Legal Partners",
    department: "Corporate Law",
    description: "We are seeking an experienced Senior Legal Associate with 5-7 years of experience in Corporate Litigation and Mergers & Acquisitions.",
    detailedDescription: "LexIsis Legal Partners is a leading corporate law firm in Mumbai with over 20 years of excellence in serving Fortune 500 companies. We're expanding our Corporate Law division and seeking a talented Senior Legal Associate to join our dynamic team. This role offers exceptional growth opportunities and exposure to high-profile M&A transactions.",
    responsibilities: [
      "Draft and negotiate complex commercial agreements and M&A documents",
      "Conduct comprehensive legal due diligence for acquisitions",
      "Advise clients on corporate governance and regulatory compliance",
      "Represent clients in corporate litigation and arbitration proceedings",
      "Mentor junior associates and coordinate with cross-functional teams",
      "Maintain relationships with key clients and stakeholders"
    ],
    qualifications: [
      "LLB from a recognized university with 5-7 years of relevant experience",
      "Strong expertise in Corporate Law, M&A, and Commercial Contracts",
      "Excellent drafting, negotiation, and communication skills",
      "Experience handling high-value transactions (100Cr+)",
      "Bar Council registration is mandatory",
      "Proficiency in legal research tools and MS Office"
    ],
    benefits: [
      "Competitive salary package with performance bonuses",
      "Health insurance for self and family",
      "Professional development and CLE programs",
      "Flexible work arrangements",
      "Annual performance-based increments",
      "Collaborative work environment with senior partners"
    ],
    location: "Mumbai, India",
    workMode: "Hybrid",
    salary: {
      min: 800000,
      max: 1500000,
      currency: "INR"
    },
    experienceRequired: {
      min: 5,
      max: 7
    },
    skills: ["Corporate Law", "M&A", "Contract Negotiation", "Legal Research", "Due Diligence"],
    employmentType: "Full-time",
    isActive: true,
    contactEmail: "careers@lexisis.com",
    contactPhone: "+91-22-4567-8901",
    companyWebsite: "https://www.lexisis.com",
    numberOfOpenings: 2,
    education: "LLB/LLM",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    jobDescriptionPdf: {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      filename: "Senior_Legal_Associate_Job_Description.pdf",
      size: 13264
    }
  },
  {
    title: "Patent Attorney",
    company: "High Court of Bombay",
    department: "IP Rights",
    description: "Looking for a registered Patent Attorney to assist with drafting patent specifications and handling IP portfolio management.",
    detailedDescription: "The High Court of Bombay is seeking a skilled Patent Attorney to handle intellectual property matters. This is a prestigious position offering the opportunity to work on cutting-edge technology patents and represent clients in IP disputes.",
    responsibilities: [
      "Draft patent specifications and file patent applications",
      "Conduct patentability searches and freedom-to-operate analyses",
      "Prosecute patent applications before the Patent Office",
      "Manage IP portfolios for multiple clients",
      "Handle patent opposition and infringement matters",
      "Provide strategic IP counseling to clients"
    ],
    qualifications: [
      "Patent Agent registration with Indian Patent Office",
      "LLB or Technical degree (B.Tech/M.Tech) with 3-6 years experience",
      "Strong understanding of patent law and prosecution procedures",
      "Experience in drafting and prosecuting patent applications",
      "Excellent technical and legal writing skills",
      "Knowledge of international patent systems (PCT, EPO, USPTO) is a plus"
    ],
    benefits: [
      "Government job benefits and security",
      "Health and life insurance coverage",
      "Pension and retirement benefits",
      "Paid leave and holidays",
      "Professional development opportunities",
      "Work-life balance"
    ],
    location: "Mumbai, India",
    workMode: "On-site",
    salary: {
      min: 600000,
      max: 1200000,
      currency: "INR"
    },
    experienceRequired: {
      min: 3,
      max: 6
    },
    skills: ["Patent Law", "IP Rights", "Technical Writing", "Patent Prosecution"],
    employmentType: "Full-time",
    isActive: true,
    contactEmail: "hr@bombayhighcourt.gov.in",
    contactPhone: "+91-22-2262-6565",
    companyWebsite: "https://www.bombaycourt.nic.in",
    numberOfOpenings: 1,
    education: "LLB + Patent Agent Registration",
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    jobDescriptionPdf: {
      url: "https://www.africau.edu/images/default/sample.pdf",
      filename: "Patent_Attorney_Job_Description.pdf",
      size: 3028
    }
  },
  {
    title: "Associate Counsel",
    company: "TechLaw Solutions",
    department: "Technology Law",
    description: "Join our growing team to provide legal support for technology companies, including contracts, privacy, and regulatory compliance.",
    detailedDescription: "TechLaw Solutions is India's premier technology law firm specializing in fintech, SaaS, and e-commerce legal services. We're looking for an Associate Counsel to work with innovative startups and established tech giants on cutting-edge legal matters.",
    responsibilities: [
      "Draft and negotiate technology agreements (SaaS, licensing, APIs)",
      "Advise on data privacy and GDPR/DPDP Act compliance",
      "Handle regulatory compliance for fintech and e-commerce clients",
      "Review and draft terms of service, privacy policies, and user agreements",
      "Manage intellectual property matters including software licensing",
      "Support fundraising activities and investor documentation"
    ],
    qualifications: [
      "LLB with 4-8 years of experience in technology law",
      "Deep understanding of IT Act, DPDP Act, and technology regulations",
      "Experience with SaaS agreements and cloud computing contracts",
      "Knowledge of data privacy laws (GDPR, CCPA, DPDP)",
      "Strong commercial acumen and tech-savvy mindset",
      "Excellent communication and client management skills"
    ],
    benefits: [
      "Competitive compensation with equity options",
      "Work with cutting-edge technology companies",
      "Remote work flexibility",
      "Learning and development budget",
      "Health and wellness programs",
      "Annual team retreats and events"
    ],
    location: "Bangalore, India",
    workMode: "Remote",
    salary: {
      min: 900000,
      max: 1600000,
      currency: "INR"
    },
    experienceRequired: {
      min: 4,
      max: 8
    },
    skills: ["Technology Law", "Data Privacy", "GDPR", "Contract Management", "SaaS Agreements"],
    employmentType: "Full-time",
    isActive: true,
    contactEmail: "recruitment@techlaw.com",
    contactPhone: "+91-80-4567-8901",
    companyWebsite: "https://www.techlawsolutions.in",
    numberOfOpenings: 3,
    education: "LLB/LLM (Technology Law preferred)",
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    jobDescriptionPdf: {
      url: "https://www.clickdimensions.com/links/TestPDFfile.pdf",
      filename: "Associate_Counsel_Job_Description.pdf",
      size: 4342
    }
  },
  {
    title: "Real Estate Attorney",
    company: "Metro Legal Group",
    department: "Real Estate",
    description: "Handle commercial real estate transactions, title review, and lease negotiations for our diverse client portfolio.",
    detailedDescription: "Metro Legal Group is a boutique law firm specializing in real estate law with a strong presence in Delhi NCR. We handle high-value commercial transactions and represent leading real estate developers and corporate clients.",
    responsibilities: [
      "Draft and negotiate commercial real estate agreements",
      "Conduct title due diligence and clearance",
      "Handle lease agreements and tenant disputes",
      "Advise on RERA compliance and real estate regulations",
      "Manage property transactions and registration",
      "Represent clients in real estate litigation"
    ],
    qualifications: [
      "LLB with 3-7 years of experience in real estate law",
      "Strong knowledge of property laws and RERA regulations",
      "Experience in title search and due diligence",
      "Expertise in drafting real estate agreements",
      "Good understanding of stamp duty and registration procedures",
      "Litigation experience is a plus"
    ],
    benefits: [
      "Attractive salary with performance incentives",
      "Exposure to high-value transactions",
      "Health insurance and medical benefits",
      "Professional development support",
      "Flexible working hours",
      "Annual bonus based on performance"
    ],
    location: "Delhi, India",
    workMode: "Hybrid",
    salary: {
      min: 700000,
      max: 1300000,
      currency: "INR"
    },
    experienceRequired: {
      min: 3,
      max: 7
    },
    skills: ["Real Estate Law", "Property Law", "Contract Negotiation", "RERA", "Title Due Diligence"],
    employmentType: "Full-time",
    isActive: true,
    contactEmail: "jobs@metrolegal.com",
    contactPhone: "+91-11-2345-6789",
    companyWebsite: "https://www.metrolegalgroup.in",
    numberOfOpenings: 2,
    education: "LLB",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    jobDescriptionPdf: {
      url: "https://www.orimi.com/pdf-test.pdf",
      filename: "Real_Estate_Attorney_Job_Description.pdf",
      size: 1042157
    }
  },
  {
    title: "Junior Legal Associate",
    company: "Supreme Court Legal Aid",
    department: "Civil Rights",
    description: "Entry-level position for recent law graduates passionate about civil rights and public interest litigation.",
    detailedDescription: "Supreme Court Legal Aid is a non-profit organization dedicated to providing free legal services to underprivileged communities. This is an excellent opportunity for fresh law graduates to gain hands-on experience in public interest litigation and make a real difference in society.",
    responsibilities: [
      "Assist senior advocates in drafting petitions and legal documents",
      "Conduct legal research on constitutional and civil rights matters",
      "Interview clients and gather case information",
      "Attend court proceedings and take notes",
      "Prepare case summaries and legal memorandums",
      "Coordinate with NGOs and social welfare organizations"
    ],
    qualifications: [
      "LLB from a recognized university (0-2 years experience)",
      "Strong interest in civil rights and social justice",
      "Excellent legal research and writing skills",
      "Knowledge of constitutional law and PIL procedures",
      "Ability to work with diverse communities",
      "Bar Council enrollment is required"
    ],
    benefits: [
      "Invaluable experience in public interest litigation",
      "Mentorship from senior Supreme Court advocates",
      "Stipend with annual increments",
      "Certificate and recommendation letters",
      "Exposure to high-impact social cases",
      "Networking opportunities in legal community"
    ],
    location: "New Delhi, India",
    workMode: "On-site",
    salary: {
      min: 400000,
      max: 600000,
      currency: "INR"
    },
    experienceRequired: {
      min: 0,
      max: 2
    },
    skills: ["Legal Research", "Litigation", "Civil Rights", "Constitutional Law"],
    employmentType: "Full-time",
    isActive: true,
    contactEmail: "careers@sclegalaid.gov.in",
    contactPhone: "+91-11-2338-8888",
    companyWebsite: "https://www.sclegalaid.gov.in",
    numberOfOpenings: 5,
    education: "LLB",
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    jobDescriptionPdf: {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      filename: "Junior_Legal_Associate_Job_Description.pdf",
      size: 13264
    }
  },
  {
    title: "Tax Attorney",
    company: "FinLaw Advisors",
    department: "Tax & Finance",
    description: "Advise clients on tax planning, compliance, and representation in tax disputes. Experience with GST and Income Tax is essential.",
    detailedDescription: "FinLaw Advisors is a leading tax and corporate advisory firm with offices across major cities in India. We're seeking an experienced Tax Attorney to handle complex tax matters for our corporate and HNI clients.",
    responsibilities: [
      "Provide tax advisory on corporate restructuring and M&A transactions",
      "Handle GST and Income Tax compliance and litigation",
      "Represent clients before tax authorities and tribunals",
      "Draft tax opinions and advisory memorandums",
      "Conduct tax due diligence for transactions",
      "Advise on international taxation and transfer pricing"
    ],
    qualifications: [
      "LLB/CA/CS with 5-10 years of tax law experience",
      "Deep expertise in GST, Income Tax, and corporate taxation",
      "Experience in tax litigation and representation",
      "Knowledge of international taxation is highly preferred",
      "Strong analytical and problem-solving skills",
      "Excellent client relationship management"
    ],
    benefits: [
      "Industry-leading compensation package",
      "Performance bonuses and profit sharing",
      "Comprehensive health insurance",
      "Professional certification support (LLM, CPA)",
      "International exposure and training",
      "Modern office facilities and tools"
    ],
    location: "Chennai, India",
    workMode: "Hybrid",
    salary: {
      min: 1000000,
      max: 1800000,
      currency: "INR"
    },
    experienceRequired: {
      min: 5,
      max: 10
    },
    skills: ["Tax Law", "GST", "Income Tax", "Tax Planning", "Transfer Pricing"],
    employmentType: "Full-time",
    isActive: true,
    contactEmail: "hr@finlaw.com",
    contactPhone: "+91-44-2345-6789",
    companyWebsite: "https://www.finlawadvisors.com",
    numberOfOpenings: 2,
    education: "LLB/CA/CS",
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    jobDescriptionPdf: {
      url: "https://www.africau.edu/images/default/sample.pdf",
      filename: "Tax_Attorney_Job_Description.pdf",
      size: 3028
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    const jobs = await Job.insertMany(sampleJobs);
    console.log(`Successfully seeded ${jobs.length} jobs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
