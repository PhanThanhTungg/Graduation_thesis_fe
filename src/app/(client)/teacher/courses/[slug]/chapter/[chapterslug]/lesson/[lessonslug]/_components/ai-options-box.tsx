"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateLesson } from "@/service/lesson.service";
import { showToast } from "@/lib/toast";

interface AiOptionsBoxProps {
  lessonId: string;
  initialIsGenQues: boolean;
  initialIsGenQuiz: boolean;
  initialPromptForGenQues: string;
  initialPromptForGenQuiz: string;
  files: {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    isForAiQues?: boolean;
    isForAiQuiz?: boolean;
  }[];
}

export function AiOptionsBox({
  lessonId,
  initialIsGenQues,
  initialIsGenQuiz,
  initialPromptForGenQues,
  initialPromptForGenQuiz,
  files,
}: AiOptionsBoxProps) {
  const [isGenQues, setIsGenQues] = useState(initialIsGenQues);
  const [isGenQuiz, setIsGenQuiz] = useState(initialIsGenQuiz);
  const [promptForGenQues, setPromptForGenQues] = useState(
    initialPromptForGenQues,
  );
  const [promptForGenQuiz, setPromptForGenQuiz] = useState(
    initialPromptForGenQuiz,
  );
  const [fileStates, setFileStates] = useState(files);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (
    field: "isGenQues" | "isGenQuiz",
    value: boolean,
  ) => {
    const nextIsGenQues = field === "isGenQues" ? value : isGenQues;
    const nextIsGenQuiz = field === "isGenQuiz" ? value : isGenQuiz;

    try {
      setIsLoading(true);

      await updateLesson(lessonId, {
        isGenQues: nextIsGenQues,
        isGenQuiz: nextIsGenQuiz,
      });

      setIsGenQues(nextIsGenQues);
      setIsGenQuiz(nextIsGenQuiz);

      showToast("success", "AI options updated successfully");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to update AI options",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFile = (
    fileId: string,
    field: "isForAiQues" | "isForAiQuiz",
    value: boolean,
  ) => {
    const nextFiles = fileStates.map((file) =>
      file.id === fileId ? { ...file, [field]: value } : file,
    );
    setFileStates(nextFiles);
  };

  const handleSaveQuestionSettings = async () => {
    try {
      setIsLoading(true);
      await updateLesson(lessonId, {
        promptForGenQues,
        files: fileStates.map((file) => ({
          fileUrl: file.fileUrl,
          fileName: file.fileName,
          fileSize: file.fileSize,
          isForAiQues: !!file.isForAiQues,
          isForAiQuiz: file.isForAiQuiz,
        })),
      });
      showToast("success", "Question settings saved successfully");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to save question settings",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuizSettings = async () => {
    try {
      setIsLoading(true);
      await updateLesson(lessonId, {
        promptForGenQuiz,
        files: fileStates.map((file) => ({
          fileUrl: file.fileUrl,
          fileName: file.fileName,
          fileSize: file.fileSize,
          isForAiQues: file.isForAiQues,
          isForAiQuiz: !!file.isForAiQuiz,
        })),
      });
      showToast("success", "Quiz settings saved successfully");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Failed to save quiz settings",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3 rounded-lg border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-gen-ques"
                checked={isGenQues}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleToggle("isGenQues", Boolean(checked))
                }
              />
              <label
                htmlFor="ai-gen-ques"
                className="text-sm font-medium cursor-pointer"
              >
                AI question generation
              </label>
            </div>
          </div>
          {isGenQues && (
            <div className="space-y-3 border-t pt-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Question prompt
                </p>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  rows={3}
                  value={promptForGenQues}
                  onChange={(e) => setPromptForGenQues(e.target.value)}
                  placeholder="Describe how AI should generate questions for this lesson"
                />
              </div>
              {fileStates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Files for AI context
                  </p>
                  <div className="space-y-1">
                    {fileStates.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`ai-file-ques-${file.id}`}
                          checked={!!file.isForAiQues}
                          disabled={isLoading}
                          onCheckedChange={(checked) =>
                            handleToggleFile(
                              file.id,
                              "isForAiQues",
                              Boolean(checked),
                            )
                          }
                        />
                        <label
                          htmlFor={`ai-file-ques-${file.id}`}
                          className="text-xs cursor-pointer truncate"
                        >
                          {file.fileName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-md border bg-green text-background disabled:opacity-70"
                  onClick={handleSaveQuestionSettings}
                  disabled={isLoading}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-lg border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-gen-quiz"
                checked={isGenQuiz}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleToggle("isGenQuiz", Boolean(checked))
                }
              />
              <label
                htmlFor="ai-gen-quiz"
                className="text-sm font-medium cursor-pointer"
              >
                AI quiz generation
              </label>
            </div>
          </div>
          {isGenQuiz && (
            <div className="space-y-3 border-t pt-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Quiz prompt
                </p>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  rows={3}
                  value={promptForGenQuiz}
                  onChange={(e) => setPromptForGenQuiz(e.target.value)}
                  placeholder="Describe how AI should generate quizzes for this lesson"
                />
              </div>
              {fileStates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Files for AI context
                  </p>
                  <div className="space-y-1">
                    {fileStates.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`ai-file-quiz-${file.id}`}
                          checked={!!file.isForAiQuiz}
                          disabled={isLoading}
                          onCheckedChange={(checked) =>
                            handleToggleFile(
                              file.id,
                              "isForAiQuiz",
                              Boolean(checked),
                            )
                          }
                        />
                        <label
                          htmlFor={`ai-file-quiz-${file.id}`}
                          className="text-xs cursor-pointer truncate"
                        >
                          {file.fileName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-md border bg-green text-background disabled:opacity-70"
                  onClick={handleSaveQuizSettings}
                  disabled={isLoading}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
