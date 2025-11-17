"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Trophy, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data following question.schema.ts structure
const mockQuestions = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    type: "single select" as const,
    request: "What is JavaScript?",
    options: [
      { name: "A", text: "A server-side programming language" },
      { name: "B", text: "A client-side programming language" },
      { name: "C", text: "A CSS framework" },
      { name: "D", text: "A database management system" },
    ],
    score: 10.0, // Excellent (9-10)
    aiExplanation: "JavaScript is primarily a client-side programming language that runs in web browsers, although it can also run server-side with Node.js.",
    aiFeedback: "Perfect! You correctly identified JavaScript as a client-side programming language. Your understanding of JavaScript's primary use case is accurate and comprehensive.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    type: "multiple select" as const,
    request: "Select all popular JavaScript frameworks:",
    options: [
      { name: "A", text: "React" },
      { name: "B", text: "Laravel" },
      { name: "C", text: "Vue.js" },
      { name: "D", text: "Django" },
    ],
    score: 6.5, // Average (5-8)
    aiExplanation: "React and Vue.js are popular JavaScript frameworks/libraries. Laravel is a PHP framework and Django is a Python framework.",
    aiFeedback: "You showed partial understanding by selecting some JavaScript frameworks, but also included some non-JavaScript options. Review the differences between JavaScript frameworks and frameworks from other languages like PHP and Python.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    type: "true false" as const,
    request: "TypeScript is a superset of JavaScript",
    score: 3.0, // Poor (0-4)
    aiExplanation: "TypeScript is indeed a superset of JavaScript, adding a type system and other features on top of JavaScript.",
    aiFeedback: "Your answer indicates a misunderstanding of the relationship between TypeScript and JavaScript. I recommend reviewing how TypeScript extends JavaScript by adding static typing and additional features. All valid JavaScript code is also valid TypeScript code.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    type: "single select" as const,
    request: "Which method is used to add an element to the end of an array?",
    options: [
      { name: "A", text: "array.shift()" },
      { name: "B", text: "array.push()" },
      { name: "C", text: "array.pop()" },
      { name: "D", text: "array.unshift()" },
    ],
    score: 9.0, // Excellent (9-10)
    aiExplanation: "push() adds an element to the end of an array. shift() removes from start, pop() removes from end, unshift() adds to start.",
    aiFeedback: "Excellent! You correctly identified push() as the method to add elements to the end of an array. Your knowledge of array manipulation methods is solid.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    type: "multiple select" as const,
    request: "Which of the following can be used to declare variables in JavaScript?",
    options: [
      { name: "A", text: "var" },
      { name: "B", text: "let" },
      { name: "C", text: "const" },
      { name: "D", text: "define" },
    ],
    score: 5.5, // Average (5-8)
    aiExplanation: "JavaScript has 3 ways to declare variables: var (old), let and const (ES6+). There is no 'define' keyword.",
    aiFeedback: "You have some understanding of JavaScript variable declarations, but your answer wasn't complete. Make sure to review all three valid keywords: var, let, and const. Remember that 'define' is not a valid JavaScript keyword.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    type: "open-ended" as const,
    request: "Explain the difference between '==' and '===' in JavaScript (minimum 50 characters)",
    score: 2.5, // Poor (0-4)
    aiExplanation: "== compares values after type coercion, while === compares both value and type (strict equality).",
    aiFeedback: "Your explanation lacks depth and accuracy. The key difference is that '==' performs type coercion before comparison, while '===' checks both value and type without coercion. I strongly recommend studying comparison operators and type coercion in JavaScript with practical examples.",
  },
];

interface LessonQuizTabProps {
  lessonId: string;
}

export function LessonQuizTab({ lessonId }: LessonQuizTabProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnswer = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== "";

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setShowResult(false);
  };

  const handleSubmitAnswer = () => {
    // TODO: Call AI API to evaluate answer and get score + feedback
    // For now, just show the result section
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsCompleted(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowResult(false);
    }
  };

  const calculateScore = () => {
    // Calculate total score from all answered questions
    let totalScore = 0;
    let earnedScore = 0;

    mockQuestions.forEach((question) => {
      if (answers[question.id] !== undefined && answers[question.id] !== "") {
        totalScore += 10; // Max 10 points per question
        earnedScore += question.score || 0; // AI scored value
      }
    });

    const percentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;

    return { earnedScore, totalScore, percentage };
  };

  if (isCompleted) {
    const { earnedScore, totalScore, percentage } = calculateScore();
    
    return (
      <div className="px-6 py-8">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="mb-6">
            <Trophy className="w-20 h-20 mx-auto text-orange mb-4" />
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              You have completed the quiz
            </p>
          </div>

          <div className="bg-muted rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold text-orange mb-2">{percentage}%</div>
            <div className="text-muted-foreground">
              Score: {earnedScore}/{totalScore}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Answered {Object.keys(answers).length}/{totalQuestions} questions
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setIsCompleted(false);
                setShowResult(false);
              }}
            >
              Review Questions
            </Button>
            <Button
              className="bg-orange hover:bg-orange/90"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setIsCompleted(false);
                setShowResult(false);
              }}
            >
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.score} points
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-orange transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center font-semibold">
                {currentQuestionIndex + 1}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold mb-2">{currentQuestion.request}</p>
                {currentQuestion.type === "multiple select" && (
                  <p className="text-sm text-muted-foreground">Select all correct answers</p>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.type === "single select" && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options?.map((option) => (
                    <div
                      key={option.name}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                        answers[currentQuestion.id] === option.name && "border-orange bg-orange/5"
                      )}
                    >
                      <RadioGroupItem value={option.name} id={`${currentQuestion.id}-${option.name}`} />
                      <Label
                        htmlFor={`${currentQuestion.id}-${option.name}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        <span className="font-semibold mr-2">{option.name}.</span>
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "multiple select" && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => {
                    const isChecked = (answers[currentQuestion.id] || []).includes(option.name);
                    return (
                      <div
                        key={option.name}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                          isChecked && "border-orange bg-orange/5"
                        )}
                      >
                        <Checkbox
                          id={`${currentQuestion.id}-${option.name}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            if (checked) {
                              handleAnswerChange(currentQuestion.id, [...currentAnswers, option.name]);
                            } else {
                              handleAnswerChange(
                                currentQuestion.id,
                                currentAnswers.filter((a: string) => a !== option.name)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`${currentQuestion.id}-${option.name}`}
                          className="flex-1 cursor-pointer font-normal"
                        >
                          <span className="font-semibold mr-2">{option.name}.</span>
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "true false" && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {[
                    { value: "true", label: "True" },
                    { value: "false", label: "False" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border transition-colors",
                        answers[currentQuestion.id] === option.value && "border-orange bg-orange/5"
                      )}
                    >
                      <RadioGroupItem value={option.value} id={`${currentQuestion.id}-${option.value}`} />
                      <Label
                        htmlFor={`${currentQuestion.id}-${option.value}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "open-ended" && (
                <Textarea
                  placeholder="Enter your answer..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="min-h-32"
                />
              )}
            </div>
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="space-y-4 mt-6">
              {/* AI Feedback Card */}
              <div
                className={cn(
                  "p-4 rounded-lg border-l-4",
                  currentQuestion.score >= 9 && "bg-green/10 border-l-green",
                  currentQuestion.score >= 5 && currentQuestion.score < 9 && "bg-orange/10 border-l-orange",
                  currentQuestion.score < 5 && "bg-destructive/10 border-l-destructive"
                )}
              >
                <div className="flex items-start gap-3">
                  {currentQuestion.score >= 9 ? (
                    <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                  ) : currentQuestion.score >= 5 ? (
                    <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p
                        className={cn(
                          "font-semibold",
                          currentQuestion.score >= 9 && "text-green",
                          currentQuestion.score >= 5 && currentQuestion.score < 9 && "text-orange",
                          currentQuestion.score < 5 && "text-destructive"
                        )}
                      >
                        AI Feedback
                      </p>
                      <span
                        className={cn(
                          "text-sm font-medium px-2 py-0.5 rounded",
                          currentQuestion.score >= 9 && "text-green bg-green/20",
                          currentQuestion.score >= 5 && currentQuestion.score < 9 && "text-orange bg-orange/20",
                          currentQuestion.score < 5 && "text-destructive bg-destructive/20"
                        )}
                      >
                        {currentQuestion.score}/10 points
                      </span>
                    </div>
                    {currentQuestion.aiFeedback && (
                      <p className="text-sm leading-relaxed">{currentQuestion.aiFeedback}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Explanation Card */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold mb-2 text-sm">Explanation</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentQuestion.aiExplanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              {!showResult ? (
                <Button onClick={handleSubmitAnswer} disabled={!hasAnswer} className="bg-orange hover:bg-orange/90">
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-orange hover:bg-orange/90">
                  {isLastQuestion ? "Finish" : "Next"}
                  {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
