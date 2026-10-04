import type {
  ChatMessage,
  Consultation,
  LegalResponseData,
} from '@/types';

import {
  createNewConsultation,
  createUserMessage,
  createAssistantMessage,
  PROCESSING_STAGES,
} from '@/data/chatData';

/**
 * Backend API base URL.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api';

/**
 * Processing stage callback.
 */
export type ProcessingStageCallback = (
  stageIndex: number
) => void;

/**
 * API error with HTTP status information.
 */
export class LegalAdvisorApiError extends Error {
  status?: number;
  details?: string;

  constructor(
    message: string,
    status?: number,
    details?: string
  ) {
    super(message);
    this.name = 'LegalAdvisorApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Build request headers using the authenticated user stored by login/register flow.
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const stored = localStorage.getItem('legal_advisor_user');

    if (!stored) {
      return headers;
    }

    const parsed = JSON.parse(stored) as {
      token?: string;
    };

    if (parsed?.token) {
      headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch {
    // Ignore malformed localStorage data.
  }

  return headers;
}

/**
 * Safely parse an API response.
 */
async function parseResponse<T>(
  response: Response
): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let details = '';

    try {
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        details =
          errorData?.detail ||
          errorData?.message ||
          JSON.stringify(errorData);
      } else {
        details = await response.text();
      }
    } catch {
      details = 'Unable to read server error response.';
    }

    throw new LegalAdvisorApiError(
      `API request failed with status ${response.status}.`,
      response.status,
      details
    );
  }

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  throw new LegalAdvisorApiError(
    'Backend returned a non-JSON response.',
    response.status
  );
}

/**
 * Legal Advisor frontend service.
 */
export const legalAdvisorService = {
  /**
   * Fetch consultations belonging to the authenticated user.
   */
  async getConsultations(): Promise<Consultation[]> {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await parseResponse<Consultation[]>(response);
  },

  /**
   * Create a new consultation in the backend.
   */
  async createConsultation(
    category?: string
  ): Promise<Consultation> {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        category: category?.trim() || 'General Law',
      }),
    });

    const data = await parseResponse<{
      id: string;
      status?: string;
    }>(response);

    const fallback = createNewConsultation(category);

    return {
      ...fallback,
      id: data.id,
      category: category?.trim() || 'General Law',
      messages: [],
    };
  },

  /**
   * Send a legal question to FastAPI.
   */
  async sendMessage(
    consultationId: string,
    content: string,
    category: string = 'General Law',
    onStage?: ProcessingStageCallback
  ): Promise<{
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
  }> {
    const cleanedContent = content.trim();

    if (!cleanedContent) {
      throw new LegalAdvisorApiError(
        'Legal question cannot be empty.'
      );
    }

    if (!consultationId) {
      throw new LegalAdvisorApiError(
        'Consultation ID is missing.'
      );
    }

    const userMessage = createUserMessage(cleanedContent);

    let stageInterval: ReturnType<typeof setInterval> | undefined;

    if (onStage) {
      let currentStage = 0;
      onStage(0);

      stageInterval = setInterval(() => {
        if (currentStage < PROCESSING_STAGES.length - 1) {
          currentStage += 1;
          onStage(currentStage);
        }
      }, 400);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/consultations/${encodeURIComponent(
          consultationId
        )}/messages`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            content: cleanedContent,
            category: category?.trim() || 'General Law',
          }),
        }
      );

      const data = await parseResponse<LegalResponseData>(response);

      if (onStage) {
        onStage(PROCESSING_STAGES.length - 1);
      }

      const assistantMessage = createAssistantMessage(data);

      return {
        userMessage,
        assistantMessage,
      };
    } catch (error) {
      console.error('FastAPI request failed:', error);

      if (error instanceof LegalAdvisorApiError) {
        throw error;
      }

      throw new LegalAdvisorApiError(
        'Unable to connect to the legal advisor backend.'
      );
    } finally {
      if (stageInterval !== undefined) {
        clearInterval(stageInterval);
      }
    }
  },
};