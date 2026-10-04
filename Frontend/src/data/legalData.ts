import type {
  LegalCategory,
  LegalResource,
  ResourceCategory,
  FutureItem,
  PipelineStep,
  Problem,
  Principle,
} from '@/types';

export const LEGAL_CATEGORIES: LegalCategory[] = [
  { id: 'constitutional', name: 'Constitutional Law', description: 'Fundamental rights, constitutional provisions, and state structure.', icon: 'Landmark' },
  { id: 'criminal', name: 'Criminal Law', description: 'Offences, procedure, bail, and criminal defences.', icon: 'Gavel' },
  { id: 'civil', name: 'Civil Law', description: 'Civil disputes, contracts, torts, and civil procedure.', icon: 'Scale' },
  { id: 'consumer', name: 'Consumer Rights', description: 'Consumer protection, disputes, and remedies.', icon: 'ShieldCheck' },
  { id: 'cyber', name: 'Cyber Law', description: 'Digital offences, data protection, and online rights.', icon: 'Lock' },
  { id: 'labour', name: 'Labour Law', description: 'Employment rights, wages, workplace disputes.', icon: 'Briefcase' },
  { id: 'family', name: 'Family Law', description: 'Marriage, divorce, maintenance, and custody.', icon: 'Users' },
  { id: 'property', name: 'Property Law', description: 'Property rights, transfers, and disputes.', icon: 'Building2' },
];

export const PROBLEMS: Problem[] = [
  {
    number: '01',
    title: 'Complex Legal Language',
    description: 'Legal terminology can make basic rights and procedures difficult to understand for those without formal training.',
  },
  {
    number: '02',
    title: 'Time-Consuming Research',
    description: 'Finding relevant legal provisions and trusted information across scattered sources can take significant time.',
  },
  {
    number: '03',
    title: 'Limited Legal Awareness',
    description: 'Many people do not know where to begin when facing a legal problem, or what their basic rights and options are.',
  },
];

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'question', number: '01', label: 'User Question', description: 'A person describes their legal question in natural language.' },
  { id: 'understanding', number: '02', label: 'AI Understanding', description: 'The system interprets intent, context, and the legal area involved.' },
  { id: 'retrieval', number: '03', label: 'Legal Knowledge Retrieval', description: 'Relevant provisions and legal concepts are retrieved from the knowledge base.' },
  { id: 'provisions', number: '04', label: 'Relevant Provisions', description: 'Applicable sections and frameworks are identified and structured.' },
  { id: 'explanation', number: '05', label: 'Clear Explanation', description: 'Complex legal language is translated into clear, understandable terms.' },
  { id: 'next-steps', number: '06', label: 'Possible Next Steps', description: 'Practical actions the user may consider, with sources for reference.' },
];

export const PRINCIPLES: Principle[] = [
  { title: 'Clarity', description: 'Complex legal concepts should be explained in understandable language, without unnecessary jargon.', icon: 'Eye' },
  { title: 'Sources', description: 'Legal information should be traceable to trusted sources, with references provided for verification.', icon: 'BookOpen' },
  { title: 'Responsibility', description: 'AI-generated information should not replace advice from a qualified legal professional.', icon: 'ShieldCheck' },
];

export const FUTURE_ITEMS: FutureItem[] = [
  { id: 'voice', title: 'Voice Assistance', description: 'Ask legal questions by voice and receive spoken explanations.', icon: 'Mic' },
  { id: 'languages', title: 'Multiple Indian Languages', description: 'Access legal information in regional languages across India.', icon: 'Languages' },
  { id: 'ocr', title: 'OCR for Legal Documents', description: 'Scan and interpret printed or handwritten legal documents.', icon: 'ScanText' },
  { id: 'tracking', title: 'Court Case Tracking', description: 'Follow case status, hearings, and judgments across courts.', icon: 'CalendarClock' },
  { id: 'appointments', title: 'Legal Appointment Assistance', description: 'Find and connect with qualified legal professionals.', icon: 'CalendarPlus' },
  { id: 'portal', title: 'Government Portal Integration', description: 'Connect with government legal services and official databases.', icon: 'Building2' },
  { id: 'mobile', title: 'Mobile Application', description: 'Full-featured mobile experience for legal assistance on the go.', icon: 'Smartphone' },
  { id: 'verification', title: 'Document Verification', description: 'Verify the authenticity and status of legal documents.', icon: 'FileCheck' },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { id: 'acts', name: 'Acts & Statutes', description: 'Major legislative acts and statutes.', count: 12 },
  { id: 'constitution', name: 'Constitution', description: 'Constitutional provisions and amendments.', count: 8 },
  { id: 'procedures', name: 'Legal Procedures', description: 'Civil and criminal procedural frameworks.', count: 10 },
  { id: 'consumer', name: 'Consumer Rights', description: 'Consumer protection and dispute resolution.', count: 6 },
  { id: 'cyber', name: 'Cyber Law', description: 'Digital and information technology law.', count: 7 },
  { id: 'labour', name: 'Labour Law', description: 'Employment, wages, and workplace rights.', count: 9 },
  { id: 'civil', name: 'Civil Law', description: 'Contracts, torts, and civil disputes.', count: 11 },
  { id: 'criminal', name: 'Criminal Law', description: 'Offences, defences, and criminal procedure.', count: 14 },
  { id: 'glossary', name: 'Legal Glossary', description: 'Plain-language definitions of legal terms.', count: 24 },
  { id: 'government', name: 'Government Resources', description: 'Official portals and public legal services.', count: 5 },
];

export const LEGAL_RESOURCES: LegalResource[] = [
  { id: 'r1', title: 'Constitution of India — Fundamental Rights', category: 'constitution', type: 'Constitutional Provision', description: 'Overview of fundamental rights guaranteed under Part III of the Constitution, including equality, freedom, and constitutional remedies.', isDemo: true, metadata: { jurisdiction: 'India', year: '1950', authority: 'Constituent Assembly' } },
  { id: 'r2', title: 'Indian Penal Code — Overview', category: 'criminal', type: 'Statute', description: 'General framework defining criminal offences, penalties, and classifications of acts as offences against the state, person, and property.', isDemo: true, metadata: { jurisdiction: 'India', year: '1860', authority: 'Legislature' } },
  { id: 'r3', title: 'Code of Criminal Procedure', category: 'procedures', type: 'Procedural Law', description: 'Procedural framework for the administration of criminal law, including arrest, bail, trial, and appeal procedures.', isDemo: true, metadata: { jurisdiction: 'India', year: '1973', authority: 'Legislature' } },
  { id: 'r4', title: 'Consumer Protection Act', category: 'consumer', type: 'Statute', description: 'Framework for consumer disputes, rights of consumers, and the establishment of consumer dispute redressal mechanisms.', isDemo: true, metadata: { jurisdiction: 'India', year: '2019', authority: 'Legislature' } },
  { id: 'r5', title: 'Information Technology Act', category: 'cyber', type: 'Statute', description: 'Legal framework for electronic governance, digital signatures, cyber offences, and data protection provisions.', isDemo: true, metadata: { jurisdiction: 'India', year: '2000', authority: 'Legislature' } },
  { id: 'r6', title: 'Payment of Wages Act', category: 'labour', type: 'Statute', description: 'Regulation of wage payment timing, deductions, and enforcement mechanisms for employed persons.', isDemo: true, metadata: { jurisdiction: 'India', year: '1936', authority: 'Legislature' } },
  { id: 'r7', title: 'Contract Act — Essentials', category: 'civil', type: 'Statute', description: 'Core principles of contract formation, performance, breach, and available remedies in civil disputes.', isDemo: true, metadata: { jurisdiction: 'India', year: '1872', authority: 'Legislature' } },
  { id: 'r8', title: 'Transfer of Property Act', category: 'civil', type: 'Statute', description: 'Principles governing the transfer of property, including sale, mortgage, lease, and gift.', isDemo: true, metadata: { jurisdiction: 'India', year: '1882', authority: 'Legislature' } },
  { id: 'r9', title: 'Glossary: Habeas Corpus', category: 'glossary', type: 'Legal Term', description: 'A writ requiring a person under arrest to be brought before a court to secure their release unless lawful grounds are shown.', isDemo: true, metadata: { jurisdiction: 'General' } },
  { id: 'r10', title: 'Glossary: Mens Rea', category: 'glossary', type: 'Legal Term', description: 'The mental element of a crime — the intention or knowledge of wrongdoing that constitutes part of a criminal offence.', isDemo: true, metadata: { jurisdiction: 'General' } },
  { id: 'r11', title: 'Glossary: Locus Standi', category: 'glossary', type: 'Legal Term', description: 'The right or capacity to bring an action or to appear before a court.', isDemo: true, metadata: { jurisdiction: 'General' } },
  { id: 'r12', title: 'National Legal Services Authority', category: 'government', type: 'Government Resource', description: 'Public resource providing free legal aid and services to eligible persons across the country.', isDemo: true, metadata: { jurisdiction: 'India', authority: 'Government' } },
];

export const DISCLAIMER = 'This system provides general legal information and is not a substitute for advice from a qualified legal professional.';
