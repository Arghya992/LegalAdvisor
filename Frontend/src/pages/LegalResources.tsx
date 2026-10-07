import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceService } from '@/services/resourceService';
import { RESOURCE_CATEGORIES } from '@/data/legalData';
import type { LegalResource } from '@/types';
import { Search, X, ArrowLeft, FileText, BookOpen } from 'lucide-react';

const MASTER_LEGAL_RESOURCES: LegalResource[] = [
  // ==========================================
  // ACTS & STATUTES (10 items)
  // ==========================================
  {
    id: 'act-1',
    title: 'The Companies Act, 2013',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Comprehensive legal code regulating incorporation, responsibilities, governance, audits, corporate social responsibility, shareholder rights, and winding up of corporate entities in India.',
    metadata: { jurisdiction: 'India', year: '2013', authority: 'Ministry of Corporate Affairs' }
  },
  {
    id: 'act-2',
    title: 'The Indian Contract Act, 1872',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Defines elements of a valid contract including proposal, acceptance, consideration, void agreements, contingent contracts, performance, breach, quasi-contracts, indemnity, guarantee, bailment, agency.',
    metadata: { jurisdiction: 'India', year: '1872', authority: 'Parliament of India' }
  },
  {
    id: 'act-3',
    title: 'Arbitration and Conciliation Act, 1996',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Consolidates law relating to domestic arbitration, international commercial arbitration, enforcement of foreign arbitral awards, interim relief, and tribunal procedures.',
    metadata: { jurisdiction: 'India', year: '1996', authority: 'Ministry of Law and Justice' }
  },
  {
    id: 'act-4',
    title: 'Insolvency and Bankruptcy Code (IBC), 2016',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Reforms statutory framework for insolvency resolution of corporate persons, partnership firms, and individuals within timebound limits.',
    metadata: { jurisdiction: 'India', year: '2016', authority: 'Insolvency and Bankruptcy Board of India' }
  },
  {
    id: 'act-5',
    title: 'Negotiable Instruments Act, 1881',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Governs promissory notes, bills of exchange, cheques, and procedural remedies under Section 138 for dishonor of cheques.',
    metadata: { jurisdiction: 'India', year: '1881', authority: 'Parliament of India' }
  },
  {
    id: 'act-6',
    title: 'Transfer of Property Act, 1882',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Regulates voluntary transfers of immovable property including sale, mortgage, lease, exchange, gift, and actionable claims.',
    metadata: { jurisdiction: 'India', year: '1882', authority: 'Parliament of India' }
  },
  {
    id: 'act-7',
    title: 'Sale of Goods Act, 1930',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Codifies legal contracts for sale of goods, conditions, warranties, transfer of title, performance, unpaid seller rights, and remedies for breach.',
    metadata: { jurisdiction: 'India', year: '1930', authority: 'Parliament of India' }
  },
  {
    id: 'act-8',
    title: 'Limitation Act, 1963',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Prescribes periods of limitation for filing civil suits, appeals, applications, condonation of delay under Section 5, and computation of statutory periods.',
    metadata: { jurisdiction: 'India', year: '1963', authority: 'Parliament of India' }
  },
  {
    id: 'act-9',
    title: 'Indian Evidence Act, 1872',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Rules governing relevancy of facts, oral and documentary evidence, burden of proof, estoppel, and examination of witnesses.',
    metadata: { jurisdiction: 'India', year: '1872', authority: 'Parliament of India' }
  },
  {
    id: 'act-10',
    title: 'Competition Act, 2002',
    type: 'Statute',
    category: 'acts',
    isDemo: true,
    description: 'Prevents anti-competitive agreements, abuse of dominant position, and regulates combinations (mergers & acquisitions) to protect consumer interest.',
    metadata: { jurisdiction: 'India', year: '2002', authority: 'Competition Commission of India' }
  },

  // ==========================================
  // CONSTITUTION (10 items)
  // ==========================================
  {
    id: 'const-1',
    title: 'Article 21: Right to Life & Personal Liberty',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Core fundamental right ensuring no person is deprived of life or personal liberty except by procedure established by law. Includes right to privacy, clean environment, and speedy trial.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Supreme Court of India' }
  },
  {
    id: 'const-2',
    title: 'Article 19: Freedom of Speech & Expression',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Guarantees basic freedoms including speech, assembly, association, movement, residence, and trade/occupation subject to reasonable restrictions.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Constitution of India' }
  },
  {
    id: 'const-3',
    title: 'Article 32: Constitutional Remedies & Writs',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Heart and soul of Constitution allowing citizens to approach Supreme Court directly for enforcement of Fundamental Rights via writs.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Supreme Court of India' }
  },
  {
    id: 'const-4',
    title: 'Article 14: Equality Before Law',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Mandates state shall not deny equality before law or equal protection of laws within India; prohibits arbitrary state actions.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Supreme Court of India' }
  },
  {
    id: 'const-5',
    title: 'Article 226: Power of High Courts to Issue Writs',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Empowers High Courts to issue orders, directions, or writs for fundamental rights enforcement and other legal entitlements.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'High Courts of India' }
  },
  {
    id: 'const-6',
    title: 'Article 300A: Right to Property',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Constitutional right stating no person shall be deprived of property save by authority of law following 44th Amendment.',
    metadata: { jurisdiction: 'India', year: '1978', authority: 'Parliament of India' }
  },
  {
    id: 'const-7',
    title: 'Article 136: Special Leave Petition (SLP)',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Discretionary plenary jurisdiction of Supreme Court to grant special leave to appeal from any judgment or order of any tribunal or court.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Supreme Court of India' }
  },
  {
    id: 'const-8',
    title: 'Article 141: Law Declared by SC Binding on All Courts',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Establishes doctrine of binding precedent (stare decisis) across all Indian subordinate judicial authorities.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Supreme Court of India' }
  },
  {
    id: 'const-9',
    title: 'Article 15: Prohibition of Discrimination',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Prohibits discrimination on grounds of religion, race, caste, sex, or place of birth while permitting special affirmative action provisions.',
    metadata: { jurisdiction: 'India', year: '1950', authority: 'Constitution of India' }
  },
  {
    id: 'const-10',
    title: 'Article 51A: Fundamental Duties',
    type: 'Constitutional Provision',
    category: 'constitution',
    isDemo: true,
    description: 'Outlines moral obligations of all citizens to help promote patriotism, uphold unity, safeguard public property, and protect the environment.',
    metadata: { jurisdiction: 'India', year: '1976', authority: 'Parliament of India' }
  },

  // ==========================================
  // LEGAL PROCEDURES (10 items)
  // ==========================================
  {
    id: 'proc-1',
    title: 'RTI Filing & Appellate Mechanism',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Guidelines for drafting RTI requests, fee payments, filing First Appeal to FAA, and Second Appeal to Information Commissions.',
    metadata: { jurisdiction: 'India', year: '2005', authority: 'Central Information Commission' }
  },
  {
    id: 'proc-2',
    title: 'Civil Suit Pleadings & Written Statements',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Rules for drafting plaints under Order 6 & 7 CPC, calculating ad-valorem court fees, summons service, and set-offs.',
    metadata: { jurisdiction: 'India', year: '1908', authority: 'Civil Courts System' }
  },
  {
    id: 'proc-3',
    title: 'Criminal FIR Registration & Zero FIR Procedure',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Mandatory process for FIR registration under cognizable offences, Zero FIR cross-jurisdiction rules, and Section 156(3) remedies.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Police Administration & Courts' }
  },
  {
    id: 'proc-4',
    title: 'Bail Applications: Regular, Interim & Anticipatory',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'SOP for filing anticipatory bail applications in Sessions/High Court, bailable vs non-bailable terms, and bail bond execution.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Criminal Judicial Courts' }
  },
  {
    id: 'proc-5',
    title: 'PIL (Public Interest Litigation) Filing SOP',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Requirements for locus standi relaxation, drafting PIL petitions before High Courts and SC on fundamental rights and ecology.',
    metadata: { jurisdiction: 'India', year: '1980', authority: 'Supreme Court of India' }
  },
  {
    id: 'proc-6',
    title: 'Execution of Decrees & Orders Procedure',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Steps under Order 21 CPC for execution of money decrees, property attachment, arrest detention, and possession delivery.',
    metadata: { jurisdiction: 'India', year: '1908', authority: 'Civil Courts System' }
  },
  {
    id: 'proc-7',
    title: 'Summary Suit Procedure (Order 37 CPC)',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Fast-track judicial recovery of debts arising from bills of exchange, promissory notes, or written contracts with conditional leave to defend.',
    metadata: { jurisdiction: 'India', year: '1908', authority: 'Civil Courts System' }
  },
  {
    id: 'proc-8',
    title: 'Quashing of FIR / Criminal Proceedings',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'High Court inherent powers to quash frivolous, malicious, or settled criminal complaints to prevent abuse of court process.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'High Courts of India' }
  },
  {
    id: 'proc-9',
    title: 'Mutual Consent Divorce Procedure',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Step-by-step procedural timeline for filing First and Second Motion petitions, cooling-off period waivers, and settlement deeds.',
    metadata: { jurisdiction: 'India', year: '1955', authority: 'Family Courts' }
  },
  {
    id: 'proc-10',
    title: 'Caveat Petition Filing Guidelines',
    type: 'Procedure',
    category: 'procedures',
    isDemo: true,
    description: 'Preventative measure to ensure no ex-parte orders are passed against a party without prior notice and opportunity of hearing.',
    metadata: { jurisdiction: 'India', year: '1908', authority: 'Civil Courts System' }
  },

  // ==========================================
  // CONSUMER RIGHTS (8 items)
  // ==========================================
  {
    id: 'cons-1',
    title: 'Consumer Protection Act, 2019',
    type: 'Statute',
    category: 'consumer',
    isDemo: true,
    description: 'Overhauled framework introducing CCPA, product liability claims, unfair trade practice protections, and e-commerce rules.',
    metadata: { jurisdiction: 'India', year: '2019', authority: 'Ministry of Consumer Affairs' }
  },
  {
    id: 'cons-2',
    title: 'E-Daakhil Portal E-Filing Guidelines',
    type: 'Procedure',
    category: 'consumer',
    isDemo: true,
    description: 'Digital filing procedure for submitting consumer disputes online to District, State, and National Consumer Commissions (NCDRC).',
    metadata: { jurisdiction: 'India', year: '2020', authority: 'NCDRC' }
  },
  {
    id: 'cons-3',
    title: 'Product Liability & Deficiency of Service Rights',
    type: 'Guideline',
    category: 'consumer',
    isDemo: true,
    description: 'Legal standards for claiming compensation against product manufacturers and sellers for defective items or service delay.',
    metadata: { jurisdiction: 'India', year: '2019', authority: 'CCPA' }
  },
  {
    id: 'cons-4',
    title: 'Unfair Contract Terms & Misleading Ads Code',
    type: 'Guideline',
    category: 'consumer',
    isDemo: true,
    description: 'Protections against unilateral contracts, hidden charges, misleading celebrity endorsements, and dark patterns in e-commerce.',
    metadata: { jurisdiction: 'India', year: '2022', authority: 'Central Consumer Protection Authority' }
  },
  {
    id: 'cons-5',
    title: 'Consumer Mediation Rules & Settlement',
    type: 'Procedure',
    category: 'consumer',
    isDemo: true,
    description: 'Framework for referring consumer disputes to pre-litigation or court-annexed mediation cells for fast consensual settlement.',
    metadata: { jurisdiction: 'India', year: '2020', authority: 'Ministry of Consumer Affairs' }
  },
  {
    id: 'cons-6',
    title: 'E-Commerce Consumer Protection Rules, 2020',
    type: 'Rules',
    category: 'consumer',
    isDemo: true,
    description: 'Obligations on digital marketplaces regarding price transparency, return policies, country of origin disclosures, and grievance officers.',
    metadata: { jurisdiction: 'India', year: '2020', authority: 'Ministry of Consumer Affairs' }
  },
  {
    id: 'cons-7',
    title: 'Right to Refund and Cancellation Standards',
    type: 'Guideline',
    category: 'consumer',
    isDemo: true,
    description: 'Statutory guarantees protecting consumers from non-refundable terms on deficient services or fake goods delivery.',
    metadata: { jurisdiction: 'India', year: '2019', authority: 'National Consumer Forum' }
  },
  {
    id: 'cons-8',
    title: 'Medical Negligence Consumer Compensation Rules',
    type: 'Guideline',
    category: 'consumer',
    isDemo: true,
    description: 'Landmark rules regulating standard of care, medical service deficiency claims, and compensation calculation in hospital disputes.',
    metadata: { jurisdiction: 'India', year: '2019', authority: 'Supreme Court & Consumer Forum' }
  },

  // ==========================================
  // CYBER LAW (8 items)
  // ==========================================
  {
    id: 'cyb-1',
    title: 'Information Technology Act, 2000 (Amended 2008)',
    type: 'Statute',
    category: 'cyber',
    isDemo: true,
    description: 'Primary legal standard for cybercrimes, electronic contracts, digital signatures, hacking penal clauses, and identity theft.',
    metadata: { jurisdiction: 'India', year: '2000', authority: 'Ministry of Electronics & IT' }
  },
  {
    id: 'cyb-2',
    title: 'Digital Personal Data Protection (DPDP) Act, 2023',
    type: 'Statute',
    category: 'cyber',
    isDemo: true,
    description: 'Data privacy law governing processing of personal data, Data Fiduciaries obligations, and financial penalties up to ₹250 Crores.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Data Protection Board of India' }
  },
  {
    id: 'cyb-3',
    title: 'IT Intermediary Rules & Digital Media Code, 2021',
    type: 'Rules',
    category: 'cyber',
    isDemo: true,
    description: 'Mandates compliance, grievance officers, monthly reports, and traceability requirements for social media platforms and OTTs.',
    metadata: { jurisdiction: 'India', year: '2021', authority: 'MeitY & MIB' }
  },
  {
    id: 'cyb-4',
    title: 'CERT-In Cyber Security Directions',
    type: 'Guideline',
    category: 'cyber',
    isDemo: true,
    description: 'Mandatory 6-hour incident reporting requirements, log retention norms, and NTP synchronization for corporate bodies and VPNs.',
    metadata: { jurisdiction: 'India', year: '2022', authority: 'CERT-In' }
  },
  {
    id: 'cyb-5',
    title: 'Cyber Fraud Reporting & 1930 Helpline SOP',
    type: 'Procedure',
    category: 'cyber',
    isDemo: true,
    description: 'SOP for immediate reporting of online financial frauds to freeze siphoned funds via National Cyber Crime Reporting Portal (NCRP).',
    metadata: { jurisdiction: 'India', year: '2021', authority: 'MHA Indian Cyber Crime Coordination Centre' }
  },
  {
    id: 'cyb-6',
    title: 'Electronic Signature & Certifying Authority Regulations',
    type: 'Rules',
    category: 'cyber',
    isDemo: true,
    description: 'Technical and legal criteria for digital signature certificates (DSC), PKI infrastructure, and legal validity in court evidence.',
    metadata: { jurisdiction: 'India', year: '2000', authority: 'Controller of Certifying Authorities (CCA)' }
  },
  {
    id: 'cyb-7',
    title: 'Critical Information Infrastructure Protection Framework',
    type: 'Guideline',
    category: 'cyber',
    isDemo: true,
    description: 'Security policies for protecting power grids, banking, defense, and telecom data centers under NCIIPC mandates.',
    metadata: { jurisdiction: 'India', year: '2014', authority: 'NCIIPC' }
  },
  {
    id: 'cyb-8',
    title: 'Cyber Forensics & Admissibility Guidelines (Sec 63B BSA)',
    type: 'Procedure',
    category: 'cyber',
    isDemo: true,
    description: 'Standard chain-of-custody protocols for hash value generation, digital evidence extraction, and mandatory certificates.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Ministry of Home Affairs' }
  },

  // ==========================================
  // LABOUR LAW (8 items)
  // ==========================================
  {
    id: 'lab-1',
    title: 'Code on Wages, 2019',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Consolidates Payment of Wages, Minimum Wages, Payment of Bonus, and Equal Remuneration Acts into a single statutory wage code.',
    metadata: { jurisdiction: 'India', year: '2019', authority: 'Ministry of Labour & Employment' }
  },
  {
    id: 'lab-2',
    title: 'POSH Act (Prevention of Sexual Harassment), 2013',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Mandates Internal Complaints Committee (ICC), enquiry procedures, redressal mechanism, and safe working environment obligations.',
    metadata: { jurisdiction: 'India', year: '2013', authority: 'Ministry of Women & Child Development' }
  },
  {
    id: 'lab-3',
    title: 'Industrial Relations Code, 2020',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Amalgamates Trade Unions Act, Industrial Employment Standing Orders Act, and Industrial Disputes Act for industrial arbitration.',
    metadata: { jurisdiction: 'India', year: '2020', authority: 'Ministry of Labour & Employment' }
  },
  {
    id: 'lab-4',
    title: 'Code on Social Security, 2020',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Extends EPF, ESI, gratuity, and maternity benefits to unorganized workers, gig workers, and platform employees.',
    metadata: { jurisdiction: 'India', year: '2020', authority: 'Ministry of Labour & Employment' }
  },
  {
    id: 'lab-5',
    title: 'Occupational Safety, Health & Working Conditions Code, 2020',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Consolidates 13 labour laws regulating health standards, safety gear, working hours, and operational conditions in factories.',
    metadata: { jurisdiction: 'India', year: '2020', authority: 'Ministry of Labour & Employment' }
  },
  {
    id: 'lab-6',
    title: 'Maternity Benefit (Amendment) Act, 2017',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Mandates 26 weeks paid maternity leave, creche facilities in establishments with 50+ staff, and work-from-home options.',
    metadata: { jurisdiction: 'India', year: '2017', authority: 'Ministry of Labour & Employment' }
  },
  {
    id: 'lab-7',
    title: 'Employees Compensation Act, 1923',
    type: 'Statute',
    category: 'labour',
    isDemo: true,
    description: 'Statutory obligation on employers to pay compensation for personal injuries or death caused by accidents arising out of employment.',
    metadata: { jurisdiction: 'India', year: '1923', authority: 'Labour Courts' }
  },
  {
    id: 'lab-8',
    title: 'Gratuity Payment Rules & Tax Exemption Exemption Limits',
    type: 'Rules',
    category: 'labour',
    isDemo: true,
    description: 'Calculation formula for continuous service completion (5+ years) and statutory cap guidelines under Payment of Gratuity Act.',
    metadata: { jurisdiction: 'India', year: '1972', authority: 'Ministry of Labour & Employment' }
  },

  // ==========================================
  // CIVIL LAW (8 items)
  // ==========================================
  {
    id: 'civ-1',
    title: 'Code of Civil Procedure (CPC), 1908',
    type: 'Procedure',
    category: 'civil',
    isDemo: true,
    description: 'Master procedural code governing jurisdiction of courts, suits, pleadings, summons, discovery, and civil appeals.',
    metadata: { jurisdiction: 'India', year: '1908', authority: 'Supreme Court & High Courts' }
  },
  {
    id: 'civ-2',
    title: 'The Specific Relief Act, 1963',
    type: 'Statute',
    category: 'civil',
    isDemo: true,
    description: 'Grants civil remedies including specific performance of contracts, mandatory and permanent injunctions, and possession recovery.',
    metadata: { jurisdiction: 'India', year: '1963', authority: 'Parliament of India' }
  },
  {
    id: 'civ-3',
    title: 'The Registration Act, 1908',
    type: 'Statute',
    category: 'civil',
    isDemo: true,
    description: 'Law governing compulsory registration of documents relating to immovable property, sale deeds, gift deeds, and mortgages.',
    metadata: { jurisdiction: 'India', year: '1908', authority: 'Land Revenue & Registration Dept' }
  },
  {
    id: 'civ-4',
    title: 'The Stamp Act, 1899 & State Amendments',
    type: 'Statute',
    category: 'civil',
    isDemo: true,
    description: 'Regulates statutory fiscal duty payable on instruments/contracts, impounding of insufficiently stamped instruments, and evidence admissibility.',
    metadata: { jurisdiction: 'India', year: '1899', authority: 'Department of Revenue' }
  },
  {
    id: 'civ-5',
    title: 'Law of Torts: Negligence & Strict Liability',
    type: 'Legal Principles',
    category: 'civil',
    isDemo: true,
    description: 'Civil wrong remedies covering tortious liability, duty of care, professional negligence, absolute liability rule, and damages.',
    metadata: { jurisdiction: 'India', year: 'Common Law', authority: 'Judicial Precedents' }
  },
  {
    id: 'civ-6',
    title: 'Indian Succession Act, 1925',
    type: 'Statute',
    category: 'civil',
    isDemo: true,
    description: 'Governs testamentary and intestate succession, execution of wills, probate grants, letters of administration, and succession certificates.',
    metadata: { jurisdiction: 'India', year: '1925', authority: 'Civil Courts' }
  },
  {
    id: 'civ-7',
    title: 'Easements Act, 1882',
    type: 'Statute',
    category: 'civil',
    isDemo: true,
    description: 'Regulates easement rights, right of way, light, air, water flow rights over neighbor properties, and licenses.',
    metadata: { jurisdiction: 'India', year: '1882', authority: 'Parliament of India' }
  },
  {
    id: 'civ-8',
    title: 'Hindu Succession Act, 1956 (Amended 2005)',
    type: 'Statute',
    category: 'civil',
    isDemo: true,
    description: 'Codifies intestate succession among Hindus, conferring equal coparcenary rights to daughters by birth in ancestral property.',
    metadata: { jurisdiction: 'India', year: '2005', authority: 'Parliament of India' }
  },

  // ==========================================
  // CRIMINAL LAW (8 items)
  // ==========================================
  {
    id: 'crim-1',
    title: 'Bharatiya Nyaya Sanhita (BNS), 2023',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Replaced IPC. Defines criminal offences, community service penalties, organized crime, mob lynching, terrorism, and crimes against women.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Ministry of Home Affairs' }
  },
  {
    id: 'crim-2',
    title: 'Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023',
    type: 'Procedure',
    category: 'criminal',
    isDemo: true,
    description: 'Replaced CrPC. Governs timebound investigations, mandatory videography during searches, forensic evidence, and bail procedures.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Ministry of Home Affairs' }
  },
  {
    id: 'crim-3',
    title: 'Bharatiya Sakshya Adhiniyam (BSA), 2023',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Replaced Indian Evidence Act, giving full admissibility to electronic/digital records, secondary evidence standards, and forensics.',
    metadata: { jurisdiction: 'India', year: '2023', authority: 'Ministry of Home Affairs' }
  },
  {
    id: 'crim-4',
    title: 'POCSO Act, 2012',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Special legislation for protection of children from sexual offences with child-friendly reporting and designated special fast-track courts.',
    metadata: { jurisdiction: 'India', year: '2012', authority: 'Ministry of Women and Child Development' }
  },
  {
    id: 'crim-5',
    title: 'Prevention of Money Laundering Act (PMLA), 2002',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Prohibits money laundering, powers of ED for provisional asset attachment, search, seizure, and twin bail conditions.',
    metadata: { jurisdiction: 'India', year: '2002', authority: 'Enforcement Directorate / Ministry of Finance' }
  },
  {
    id: 'crim-6',
    title: 'NDPS (Narcotic Drugs & Psychotropic Substances) Act, 1985',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Strict penal provisions regarding illicit drug trafficking, search protocols, commercial quantity thresholds, and Section 37 bail restrictions.',
    metadata: { jurisdiction: 'India', year: '1985', authority: 'Narcotics Control Bureau' }
  },
  {
    id: 'crim-7',
    title: 'Protection of Women from Domestic Violence Act, 2005',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Provides civil-criminal remedies including protection orders, residence orders, monetary relief, and custody orders for aggrieved women.',
    metadata: { jurisdiction: 'India', year: '2005', authority: 'Magistrate Courts' }
  },
  {
    id: 'crim-8',
    title: 'Unlawful Activities Prevention Act (UAPA), 1967',
    type: 'Statute',
    category: 'criminal',
    isDemo: true,
    description: 'Special anti-terror legislation providing powers for designation of terrorist individuals/organizations, detention, and NIA investigations.',
    metadata: { jurisdiction: 'India', year: '1967', authority: 'National Investigation Agency (NIA)' }
  },

  // ==========================================
  // LEGAL GLOSSARY (8 items)
  // ==========================================
  {
    id: 'glo-1',
    title: 'Habeas Corpus',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'Prerogative writ issued by courts directing a detaining authority to produce an arrested or detained individual to examine detention legality.',
    metadata: { jurisdiction: 'Constitutional Law', year: 'Term', authority: 'Judicial Dictionary' }
  },
  {
    id: 'glo-2',
    title: 'Mens Rea & Actus Reus',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'Twin elements required to establish criminal guilt: Mens Rea (mental intent) and Actus Reus (physical prohibited act).',
    metadata: { jurisdiction: 'Criminal Jurisprudence', year: 'Term', authority: 'Common Law' }
  },
  {
    id: 'glo-3',
    title: 'Res Judicata (Section 11 CPC)',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'Doctrine barring courts from trying any suit or issue in which the matter has been directly and substantially decided in a former suit.',
    metadata: { jurisdiction: 'Civil Procedure', year: 'Term', authority: 'Civil Courts' }
  },
  {
    id: 'glo-4',
    title: 'Locus Standi',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'The legal standing or right of a party to bring an action, initiate litigation, or appear before a court of law.',
    metadata: { jurisdiction: 'General Law', year: 'Term', authority: 'Judicial Dictionary' }
  },
  {
    id: 'glo-5',
    title: 'Prima Facie',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'Sufficient evidence on first impression to establish a fact or raise a presumption unless disproved by contrary evidence.',
    metadata: { jurisdiction: 'Evidence Law', year: 'Term', authority: 'Judicial Dictionary' }
  },
  {
    id: 'glo-6',
    title: 'Ex Parte Order',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'A judicial order or decision granted by a court for the benefit of one party without hearing or notice to the opposing party in urgent cases.',
    metadata: { jurisdiction: 'Procedural Law', year: 'Term', authority: 'Judicial Dictionary' }
  },
  {
    id: 'glo-7',
    title: 'Amicus Curiae',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'Literally "friend of the court"; an impartial legal expert appointed by the court to assist on complex legal issues involved in a case.',
    metadata: { jurisdiction: 'General Jurisprudence', year: 'Term', authority: 'Judicial Dictionary' }
  },
  {
    id: 'glo-8',
    title: 'Sub Judice',
    type: 'Glossary Term',
    category: 'glossary',
    isDemo: true,
    description: 'A matter currently under judicial consideration or trial, restricting public comments that could influence or prejudice court proceedings.',
    metadata: { jurisdiction: 'Contempt Law', year: 'Term', authority: 'Judicial Dictionary' }
  },

  // ==========================================
  // GOVERNMENT RESOURCES (8 items)
  // ==========================================
  {
    id: 'gov-1',
    title: 'eCourts National Services Portal',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Centralized judiciary platform for case tracking, cause lists, daily orders, judgments, and court fee payments across District & High Courts.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'eCommittee Supreme Court of India' }
  },
  {
    id: 'gov-2',
    title: 'India Code Central & State Acts Repository',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Official repository containing all enacted Central and State Acts, rules, regulations, notifications, and amendments in digital format.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'Legislative Department, Ministry of Law' }
  },
  {
    id: 'gov-3',
    title: 'NALSA Legal Aid & Services Portal',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Free legal assistance booking, Lok Adalat schedules, and legal aid counsel assignment for marginalized citizens under Legal Services Act 1987.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'National Legal Services Authority' }
  },
  {
    id: 'gov-4',
    title: 'MCA21 Corporate Filing Portal',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Official portal for company incorporation, annual financial returns filing, director DIN allocation, charges registration, and e-governance.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'Ministry of Corporate Affairs' }
  },
  {
    id: 'gov-5',
    title: 'IP India Patents, Trademarks & Designs Portal',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Official online registry for trademark searches, e-filing patent applications, copyright registration, and opposition hearings.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'CGPDTM / DPIIT' }
  },
  {
    id: 'gov-6',
    title: 'National Consumer Dispute Redressal Portal (CONFONET)',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Networked IT infrastructure connecting all Consumer Commissions nationwide for online case status, order downloads, and cause lists.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'NCDRC & NIC' }
  },
  {
    id: 'gov-7',
    title: 'National Cyber Crime Reporting Portal (NCRP)',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Centralized government helpline and reporting portal for victims of online financial fraud, cyberbullying, and child abuse material.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'Ministry of Home Affairs' }
  },
  {
    id: 'gov-8',
    title: 'Shram Suvidha Unified Labour Portal',
    type: 'Portal',
    category: 'government',
    isDemo: true,
    description: 'Single-window portal for labor law compliance, Labour Identification Number (LIN) allocation, self-certifications, and joint inspections.',
    metadata: { jurisdiction: 'India', year: '2024', authority: 'Ministry of Labour & Employment' }
  }
];

export default function LegalResources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [resources, setResources] = useState<LegalResource[]>(MASTER_LEGAL_RESOURCES);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterData = (dataList: LegalResource[]) => {
      return dataList.filter((res) => {
        const matchesCat = activeCategory === 'all' || res.category === activeCategory;
        const matchesQuery =
          !searchQuery ||
          res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
      });
    };

    resourceService
      .getResources(activeCategory, searchQuery)
      .then((apiData: LegalResource[]) => {
        if (!isMounted) return;
        if (apiData && apiData.length > 0) {
          const combined = [...apiData, ...MASTER_LEGAL_RESOURCES];
          const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
          setResources(filterData(unique));
        } else {
          setResources(filterData(MASTER_LEGAL_RESOURCES));
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error('API call failed, fallback to Master Dataset:', err);
        setResources(filterData(MASTER_LEGAL_RESOURCES));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, searchQuery]);

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  if (selectedResource) {
    return (
      <div className="pt-14 min-h-screen">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
          <button
            onClick={() => setSelectedResource(null)}
            className="text-sm text-ivory-muted hover:text-bronze-300 mb-8 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </button>

          <div className="border border-ink-600 bg-ink-800 p-8 sm:p-12">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-4 h-4 text-bronze-400" strokeWidth={1.5} />
              <span className="eyebrow">{selectedResource.type}</span>
              {selectedResource.isDemo && (
                <span className="text-[9px] uppercase tracking-label text-bronze-500/80 border border-bronze-500/30 px-1.5 py-0.5">
                  Demo Resource
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-ivory mb-8 leading-tight">
              {selectedResource.title}
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 border-y border-ink-600 py-6">
              {selectedResource.metadata?.jurisdiction && (
                <div>
                  <p className="text-[10px] uppercase tracking-label text-ivory-muted mb-1">Jurisdiction</p>
                  <p className="text-sm text-ivory">{selectedResource.metadata.jurisdiction}</p>
                </div>
              )}
              {selectedResource.metadata?.year && (
                <div>
                  <p className="text-[10px] uppercase tracking-label text-ivory-muted mb-1">Year</p>
                  <p className="text-sm text-ivory">{selectedResource.metadata.year}</p>
                </div>
              )}
              {selectedResource.metadata?.authority && (
                <div>
                  <p className="text-[10px] uppercase tracking-label text-ivory-muted mb-1">Authority</p>
                  <p className="text-sm text-ivory">{selectedResource.metadata.authority}</p>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-ivory/90 leading-relaxed text-base">
                {selectedResource.description}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-ink-600">
              <p className="text-xs text-ivory-muted leading-relaxed">
                This is a demo resource for illustration purposes. In the production
                system, this view will contain the full text of the provision,
                related sections, case references, and cross-links to the legal
                knowledge base.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <p className="section-label mb-6">Legal Resources</p>
        <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl mb-6 text-balance">
          Your legal reference library.
        </h1>
        <p className="text-base text-ivory-muted max-w-xl mb-12">
          Browse acts, statutes, constitutional provisions, legal procedures, and a
          plain-language glossary. All resources are clearly marked as demo data.
        </p>

        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="input-field pl-11"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-muted hover:text-bronze-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`text-[12px] uppercase tracking-label px-4 py-2 border transition-colors duration-200 ${
              activeCategory === 'all'
                ? 'border-bronze-500 text-bronze-300 bg-bronze-500/10'
                : 'border-ink-500 text-ivory-muted hover:border-bronze-500/40 hover:text-ivory'
            }`}
          >
            All
          </button>
          {RESOURCE_CATEGORIES.map((cat: { id: string; name: string }) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`text-[12px] uppercase tracking-label px-4 py-2 border transition-colors duration-200 ${
                activeCategory === cat.id
                  ? 'border-bronze-500 text-bronze-300 bg-bronze-500/10'
                  : 'border-ink-500 text-ivory-muted hover:border-bronze-500/40 hover:text-ivory'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ivory-muted">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-ink-500 mx-auto mb-4" strokeWidth={1} />
            <p className="text-sm text-ivory-muted">No resources found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource: LegalResource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="card-surface p-6 text-left hover:border-bronze-500/50 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-label text-bronze-400">
                    {resource.type}
                  </span>
                  {resource.isDemo && (
                    <span className="text-[9px] uppercase tracking-label text-ivory-muted border border-ink-500 px-1.5 py-0.5">
                      Demo
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg text-ivory mb-3 group-hover:text-bronze-300 transition-colors leading-snug">
                  {resource.title}
                </h3>
                <p className="text-xs text-ivory-muted leading-relaxed line-clamp-3">
                  {resource.description}
                </p>
                <div className="flex items-center gap-1 mt-4 text-[11px] text-bronze-400 uppercase tracking-label opacity-0 group-hover:opacity-100 transition-opacity">
                  View Resource <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}