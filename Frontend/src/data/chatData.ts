import type {
  ChatMessage,
  Consultation,
  LegalResponseData,
  ProcessingStage,
} from '@/types';

export const PROCESSING_STAGES: ProcessingStage[] = [
  { id: 'understanding', label: 'Understanding your question' },
  { id: 'identifying', label: 'Identifying legal area' },
  { id: 'retrieving', label: 'Retrieving relevant information' },
  { id: 'preparing', label: 'Preparing explanation' },
];

export const DEMO_CONSULTATIONS: Consultation[] = [
  {
    id: 'c1',
    title: 'Unpaid salary — employer dispute',
    category: 'labour',
    preview: 'My employer has not paid my salary for two months...',
    date: '2 hours ago',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'My employer has not paid my salary for two months. What legal options might I have?',
        timestamp: '10:24 AM',
        category: 'labour',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: '',
        timestamp: '10:24 AM',
        category: 'labour',
        response: {
          understanding: 'You are describing a situation where your employer has not disbursed your salary for two consecutive months. This falls under labour and employment law, specifically relating to wage payment obligations.',
          relevantLaw: 'The Payment of Wages Act regulates the timely payment of wages to employed persons. Employers are generally required to pay wages on a fixed date. Delayed or non-payment may constitute a violation, and mechanisms exist to recover unpaid wages through labour authorities.',
          explanation: 'In plain terms, your employer has a legal obligation to pay your wages on time. When salary is withheld without lawful reason, you may have the right to raise a formal grievance. The law provides avenues to recover unpaid wages, and in some cases, additional compensation. The first step is typically to issue a written demand to the employer. If unresolved, the matter can be escalated to the labour authority or court.',
          nextSteps: [
            'Issue a written demand to your employer requesting payment of the unpaid salary.',
            'Gather employment records — appointment letter, salary slips, bank statements, and communication.',
            'If unresolved, file a complaint with the labour authority having jurisdiction.',
            'Consider consulting a labour law practitioner to assess your specific situation.',
          ],
          sources: [
            { id: 's1', act: 'Payment of Wages Act', section: 'Section 15', provision: 'Time of payment of wages', reference: 'Demo reference — wage payment obligation', isDemo: true },
            { id: 's2', act: 'Payment of Wages Act', section: 'Section 17', provision: 'Claims for deducted or delayed wages', reference: 'Demo reference — recovery mechanism', isDemo: true },
          ],
        },
      },
    ],
  },
  {
    id: 'c2',
    title: 'Civil vs criminal case distinction',
    category: 'civil',
    preview: 'What is the difference between a civil and criminal case?',
    date: 'Yesterday',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What is the difference between a civil and criminal case?',
        timestamp: '4:10 PM',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: '',
        timestamp: '4:10 PM',
        response: {
          understanding: 'You are asking about the fundamental distinction between civil and criminal cases in the legal system.',
          relevantLaw: 'Civil law deals with disputes between individuals or entities — contracts, property, torts. Criminal law deals with acts classified as offences against the state or society, carrying penalties such as imprisonment or fines.',
          explanation: 'A civil case typically involves a dispute between two parties — for example, a disagreement over a contract or property. The goal is usually compensation or a court order. A criminal case involves an act considered an offence against society — for example, theft or assault. The state prosecutes, and the outcome may include imprisonment or fines. The standard of proof also differs: civil cases use a balance of probabilities, while criminal cases require proof beyond reasonable doubt.',
          nextSteps: [
            'Identify whether your matter involves a dispute with another party or an offence.',
            'For civil disputes, consider whether negotiation or mediation is appropriate first.',
            'For criminal matters, report to the appropriate authority or seek legal counsel.',
          ],
          sources: [
            { id: 's1', act: 'General Legal Framework', section: 'Civil Procedure', provision: 'Dispute resolution between parties', reference: 'Demo reference — civil matters', isDemo: true },
            { id: 's2', act: 'General Legal Framework', section: 'Criminal Procedure', provision: 'Offences against the state or society', reference: 'Demo reference — criminal matters', isDemo: true },
          ],
        },
      },
    ],
  },
  {
    id: 'c3',
    title: 'Understanding a legal notice',
    category: 'civil',
    preview: 'How can I understand this legal notice I received?',
    date: '3 days ago',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'How can I understand this legal notice I received?',
        timestamp: '9:02 AM',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: '',
        timestamp: '9:02 AM',
        response: {
          understanding: 'You have received a legal notice and want to understand its contents and implications.',
          relevantLaw: 'A legal notice is a formal communication that typically states a claim, demand, or intention to take legal action. It may relate to a contract, property, employment, or other civil matter.',
          explanation: 'A legal notice usually identifies the sender, the recipient, the subject matter, and the demand or action required. It may set a time limit to respond. Receiving a notice does not automatically mean legal proceedings have started — it is often a preliminary step. The notice should be read carefully to understand what is being claimed and what response is expected.',
          nextSteps: [
            'Read the notice carefully and note the deadline for response.',
            'Identify the sender, the legal basis of the claim, and the specific demand.',
            'Do not ignore the notice — non-response may have consequences.',
            'Consult a qualified legal professional to draft an appropriate response.',
          ],
          sources: [
            { id: 's1', act: 'General Legal Practice', section: 'Legal Notices', provision: 'Formal demand and response procedure', reference: 'Demo reference — legal notices', isDemo: true },
          ],
        },
      },
    ],
  },
];

export const SAMPLE_QUESTIONS = [
  'My employer has not paid my salary for two months. What legal options might I have?',
  'What is the difference between a civil and criminal case?',
  'How can I understand this legal notice I received?',
  'What are my rights as a consumer if a product I bought is defective?',
  'What constitutes cyber harassment and what can I do about it?',
];

export function generateDemoResponse(question: string): LegalResponseData {
  const lower = question.toLowerCase();

  let category = 'General Legal Information';
  if (lower.includes('salary') || lower.includes('employer') || lower.includes('work') || lower.includes('job')) {
    category = 'Labour Law';
  } else if (lower.includes('criminal') || lower.includes('crime') || lower.includes('arrest')) {
    category = 'Criminal Law';
  } else if (lower.includes('consumer') || lower.includes('product') || lower.includes('defective')) {
    category = 'Consumer Rights';
  } else if (lower.includes('cyber') || lower.includes('online') || lower.includes('harassment')) {
    category = 'Cyber Law';
  } else if (lower.includes('property') || lower.includes('land')) {
    category = 'Property Law';
  } else if (lower.includes('family') || lower.includes('divorce') || lower.includes('marriage')) {
    category = 'Family Law';
  } else if (lower.includes('notice') || lower.includes('contract') || lower.includes('civil')) {
    category = 'Civil Law';
  } else if (lower.includes('right') || lower.includes('constitution')) {
    category = 'Constitutional Law';
  }

  return {
    understanding: `You are asking a question related to ${category.toLowerCase()}. The system has interpreted your query and identified the relevant legal area for analysis.`,
    relevantLaw: `Based on the legal area identified (${category}), relevant provisions and legal frameworks would be retrieved from the knowledge base. In a production system, specific sections and acts would be referenced here.`,
    explanation: `In plain language, your question touches on ${category.toLowerCase()}. The relevant legal framework provides certain rights, obligations, and procedures. A complete explanation would break down the applicable provisions and what they mean in practical terms, translating complex legal language into understandable concepts.`,
    nextSteps: [
      'Review the relevant legal provisions identified in the sources panel.',
      'Gather any documents or records related to your situation.',
      'Consider whether negotiation or formal action is appropriate.',
      'Consult a qualified legal professional for advice specific to your circumstances.',
    ],
    sources: [
      { id: 's1', act: `${category} — Demo Act`, section: 'Section 1', provision: 'Relevant provision (demo)', reference: 'Demo source — illustrative reference', isDemo: true },
      { id: 's2', act: `${category} — Demo Act`, section: 'Section 2', provision: 'Related provision (demo)', reference: 'Demo source — illustrative reference', isDemo: true },
    ],
  };
}

export function createNewConsultation(category?: string): Consultation {
  return {
    id: `c${Date.now()}`,
    title: 'New Consultation',
    category: category || 'general',
    preview: 'Start by describing your legal question...',
    date: 'Just now',
    messages: [],
  };
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: `m${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export function createAssistantMessage(response: LegalResponseData): ChatMessage {
  return {
    id: `m${Date.now() + 1}`,
    role: 'assistant',
    content: '',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    response,
  };
}
