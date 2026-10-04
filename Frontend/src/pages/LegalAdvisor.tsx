import {
  useState,
  useEffect,
  useRef,
} from 'react';

import ChatSidebar from '@/components/ChatSidebar';
import ChatMessageView from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SourcePanel from '@/components/SourcePanel';
import ProcessingState from '@/components/ProcessingState';

import {
  legalAdvisorService,
  LegalAdvisorApiError,
} from '@/services/legalAdvisorService';

import type {
  ChatMessage,
  Consultation,
  LegalSource,
} from '@/types';

import { DISCLAIMER } from '@/data/legalData';

export default function LegalAdvisor() {
  const [consultations, setConsultations] =
    useState<Consultation[]>([]);

  const [activeId, setActiveId] =
    useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [processingStage, setProcessingStage] =
    useState(0);

  const [currentSources, setCurrentSources] =
    useState<LegalSource[]>([]);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadConsultations = async () => {
      try {
        const data =
          await legalAdvisorService.getConsultations();

        if (!mounted) return;

        setConsultations(data);

        if (data.length > 0) {
          const firstConsultation = data[0];

          setActiveId(firstConsultation.id);

          setMessages(
            firstConsultation.messages || []
          );

          setCurrentSources(
            firstConsultation.messages
              ?.find((message) => message.response)
              ?.response?.sources || []
          );

          if (firstConsultation.category) {
            setSelectedCategory(
              firstConsultation.category
            );
          }
        }
      } catch (error) {
        console.error(
          'Failed to load consultations:',
          error
        );
      }
    };

    loadConsultations();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [
    messages,
    isProcessing,
    processingStage,
  ]);

  const handleSelectConsultation = (
    id: string
  ) => {
    const consultation =
      consultations.find(
        (item) => item.id === id
      );

    if (!consultation) return;

    setActiveId(id);

    setMessages(
      consultation.messages || []
    );

    setCurrentSources(
      consultation.messages
        ?.find((message) => message.response)
        ?.response?.sources || []
    );

    if (consultation.category) {
      setSelectedCategory(
        consultation.category
      );
    }

    setMobileSidebarOpen(false);
  };

  const handleNewConsultation = async () => {
    try {
      const consultation =
        await legalAdvisorService.createConsultation(
          selectedCategory || undefined
        );

      setConsultations((previous) => [
        consultation,
        ...previous,
      ]);

      setActiveId(consultation.id);
      setMessages([]);
      setCurrentSources([]);
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error(
        'Failed to create consultation:',
        error
      );
    }
  };

  const handleSelectCategory = (
    category: string
  ) => {
    setSelectedCategory(category);
  };

  const handleSend = async (
    content: string
  ) => {
    const cleanedContent = content.trim();

    if (!cleanedContent || isProcessing) {
      return;
    }

    let currentId = activeId;

    if (!currentId) {
      currentId = `c-${Date.now()}`;
      setActiveId(currentId);
    }

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: cleanedContent,
      timestamp: new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      ),
      category:
        selectedCategory || undefined,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setIsProcessing(true);
    setProcessingStage(0);
    setCurrentSources([]);

    try {
      const { assistantMessage } =
        await legalAdvisorService.sendMessage(
          currentId,
          cleanedContent,
          selectedCategory || 'General Law',
          (stage: number) => {
            setProcessingStage(stage);
          }
        );

      /*
       * Backend returns:
       *
       * {
       *   understanding,
       *   relevantLaw,
       *   explanation,
       *   nextSteps,
       *   sources
       * }
       *
       * Make sure the chat bubble always has
       * visible text even if the service returned
       * an empty `content` field.
       */
      const normalizedAssistantMessage: ChatMessage = {
        ...assistantMessage,

        content:
          assistantMessage.content?.trim() ||
          assistantMessage.response?.understanding ||
          assistantMessage.response?.explanation ||
          'Legal response received.',
      };

      setMessages((previous) => [
        ...previous,
        normalizedAssistantMessage,
      ]);

      setCurrentSources(
        normalizedAssistantMessage.response?.sources ||
          []
      );

      setConsultations((previous) => {
        const exists = previous.some(
          (consultation) =>
            consultation.id === currentId
        );

        if (exists) {
          return previous.map(
            (consultation) =>
              consultation.id === currentId
                ? {
                    ...consultation,

                    title:
                      cleanedContent.length > 45
                        ? `${cleanedContent.slice(
                            0,
                            45
                          )}...`
                        : cleanedContent,

                    preview: cleanedContent,

                    messages: [
                      ...(consultation.messages ||
                        []),
                      userMessage,
                      normalizedAssistantMessage,
                    ],
                  }
                : consultation
          );
        }

        return [
          {
            id: currentId!,
            title:
              cleanedContent.length > 45
                ? `${cleanedContent.slice(
                    0,
                    45
                  )}...`
                : cleanedContent,

            category:
              selectedCategory ||
              'General Law',

            preview: cleanedContent,

            date: new Date().toISOString(),

            messages: [
              userMessage,
              normalizedAssistantMessage,
            ],
          },
          ...previous,
        ];
      });
    } catch (error) {
      console.error(
        'Legal Advisor API Error:',
        error
      );

      let errorText =
        'Failed to connect to the backend server.';

      if (
        error instanceof LegalAdvisorApiError
      ) {
        if (error.status === 401) {
          errorText =
            'Authentication failed. Please log in again.';
        } else if (error.status === 404) {
          errorText =
            'The requested consultation endpoint was not found.';
        } else if (
          error.status &&
          error.status >= 500
        ) {
          errorText =
            'The legal advisor backend encountered a server error. Check the FastAPI terminal.';
        } else if (error.details) {
          errorText = error.details;
        }
      }

      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorText,
        timestamp:
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setIsProcessing(false);
      setProcessingStage(0);
    }
  };

  const activeConsultation =
    consultations.find(
      (consultation) =>
        consultation.id === activeId
    );

  return (
    <div className="pt-14 h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {mobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-ink-900/80 backdrop-blur-sm"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          />
        )}

        <div
          className={`${
            mobileSidebarOpen
              ? 'fixed inset-y-0 left-0 z-50'
              : 'hidden'
          } lg:relative lg:block lg:z-auto`}
        >
          <ChatSidebar
            consultations={consultations}
            activeId={activeId}
            selectedCategory={selectedCategory}
            onSelectConsultation={
              handleSelectConsultation
            }
            onSelectCategory={
              handleSelectCategory
            }
            onNewConsultation={
              handleNewConsultation
            }
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0">

          <div className="border-b border-ink-600 px-6 py-3 flex items-center justify-between bg-ink-800/30">
            <div className="flex items-center gap-3">

              <button
                className="lg:hidden p-1.5 text-ivory-muted hover:text-bronze-300"
                onClick={() =>
                  setMobileSidebarOpen(true)
                }
                aria-label="Open sidebar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>

              <div>
                <p className="text-sm text-ivory">
                  {activeConsultation?.title ||
                    'New Consultation'}
                </p>

                {selectedCategory && (
                  <p className="text-[10px] uppercase tracking-label text-bronze-400">
                    {selectedCategory} law
                  </p>
                )}
              </div>
            </div>

            <p className="text-[10px] text-ivory-muted hidden sm:block max-w-md truncate">
              {DISCLAIMER}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">

            {messages.length === 0 &&
            !isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center px-6 text-center">

                <div className="w-16 h-16 border border-bronze-500/40 flex items-center justify-center mb-6">
                  <span className="font-serif text-2xl text-bronze-400">
                    §
                  </span>
                </div>

                <h2 className="font-serif text-3xl text-ivory mb-4">
                  Ask the law.
                </h2>

                <p className="text-sm text-ivory-muted max-w-md leading-relaxed mb-2">
                  Describe your legal question in
                  your own words. The system will
                  identify the relevant legal area,
                  retrieve applicable provisions,
                  and explain them in clear
                  language.
                </p>

                <p className="text-[10px] uppercase tracking-label text-ivory-muted/60 mt-6">
                  {DISCLAIMER}
                </p>
              </div>
            ) : (
              <div className="pb-4">

                {messages.map((message) => (
                  <ChatMessageView
                    key={message.id}
                    message={message}
                  />
                ))}

                {isProcessing && (
                  <ProcessingState
                    stageIndex={processingStage}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInput
            onSend={handleSend}
            disabled={isProcessing}
          />
        </main>

        <SourcePanel
          sources={currentSources}
          visible={currentSources.length > 0}
        />
      </div>
    </div>
  );
}