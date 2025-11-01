"use client"

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const mockFAQs: FAQ[] = [
  {
    id: 1,
    question: "What is LearnPress?",
    answer:
      "LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online.",
  },
  {
    id: 2,
    question: "How do I create a course?",
    answer:
      "You can create a course curriculum with lessons & quizzes included which is managed with an easy-to-use interface for users.",
  },
  {
    id: 3,
    question: "Is LearnPress free?",
    answer:
      "LearnPress is free and always will be, but it is still a premium high-quality WordPress Plugin that definitely helps you with making money from your WordPress Based LMS.",
  },
  {
    id: 4,
    question: "What add-ons are available?",
    answer:
      "LearnPress WordPress Online Course plugin is lightweight and super powerful with lots of Add-Ons to empower its core system.",
  },
];

export default function FAQsTab() {
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([1]);

  const toggleFAQ = (faqId: number) => {
    setExpandedFAQs((prev) =>
      prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]
    );
  };

  return (
    <div className="bg-card border border-t-0 border-border rounded-bl-[20px] rounded-br-[20px] p-[25px]">
      <div className="flex flex-col gap-3">
        {mockFAQs.map((faq) => {
          const isExpanded = expandedFAQs.includes(faq.id);

          return (
            <div
              key={faq.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-5 py-3 flex items-center gap-3 bg-card hover:bg-muted transition-colors text-left"
              >
                <span className="flex-1 text-base font-semibold text-foreground">
                  {faq.question}
                </span>
                {isExpanded ? (
                  <ChevronUp className="size-4 text-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="size-4 text-foreground flex-shrink-0" />
                )}
              </button>

              {/* Answer */}
              {isExpanded && (
                <div className="px-5 py-3 bg-muted/30 border-t border-border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
