"use client";

import React, { useState } from "react";
import { FileText, File, FileImage, FileArchive, FileCode, Download, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonFile {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

interface LessonDocumentsTabProps {
  files?: LessonFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileText className="w-6 h-6" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return <FileImage className="w-6 h-6" />;
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className="w-6 h-6" />;
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "json":
      return <FileCode className="w-6 h-6" />;
    default:
      return <File className="w-6 h-6" />;
  }
}

function isVideoFile(fileName: string): boolean {
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return videoExtensions.includes(extension || "");
}

function isImageFile(fileName: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return imageExtensions.includes(extension || "");
}

function isTextFile(fileName: string): boolean {
  const textExtensions = ["txt", "md", "json", "xml", "csv", "js", "ts", "jsx", "tsx", "html", "css", "py", "java", "c", "cpp", "h", "go", "rs", "php", "rb", "sh"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return textExtensions.includes(extension || "");
}

function isPDFFile(fileName: string): boolean {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension === "pdf";
}

function isOfficeFile(fileName: string): boolean {
  const officeExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return officeExtensions.includes(extension || "");
}

function isAudioFile(fileName: string): boolean {
  const audioExtensions = ["mp3", "wav", "ogg", "m4a", "aac", "flac"];
  const extension = fileName.split(".").pop()?.toLowerCase();
  return audioExtensions.includes(extension || "");
}

// Utility function to download files properly
async function downloadFile(fileUrl: string, fileName: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Download failed");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    // Fallback to opening in new tab
    window.open(fileUrl, "_blank");
  }
}

interface FilePreviewProps {
  file: LessonFile;
}

function FilePreview({ file }: FilePreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTextContent = async () => {
    if (textContent !== null || loading) return;

    setLoading(true);
    try {
      // Try multiple methods to fetch the file
      let text = "";
      
      try {
        // First attempt: direct fetch with CORS
        const response = await fetch(file.fileUrl, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          cache: "no-cache",
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        text = await response.text();
      } catch (fetchError) {
        console.warn("CORS fetch failed, trying no-cors mode:", fetchError);
        
        // Second attempt: no-cors mode (won't work for text but worth trying)
        try {
          const response = await fetch(file.fileUrl, {
            method: "GET",
            mode: "no-cors",
            cache: "no-cache",
          });
          
          text = await response.text();
        } catch (noCorsError) {
          // If both fail, show error with helpful message
          throw new Error(
            `Cannot load file due to CORS restrictions.\n\n` +
            `Original error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}\n\n` +
            `Please download the file to view its contents, or ensure the file server allows CORS requests.`
          );
        }
      }
      
      if (!text || text.trim() === "") {
        throw new Error("File is empty or could not be read");
      }
      
      setTextContent(text);
    } catch (error) {
      console.error("Failed to load file content:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch file";
      setTextContent(`⚠️ Unable to load file content\n\n${errorMessage}\n\nYou can download the file using the download button above.`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    
    // Load text content when expanding
    if (willExpand && isTextFile(file.fileName) && textContent === null) {
      loadTextContent();
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    await downloadFile(file.fileUrl, file.fileName);
  };

  const canPreview = isImageFile(file.fileName) || 
                     isTextFile(file.fileName) || 
                     isPDFFile(file.fileName) ||
                     isOfficeFile(file.fileName) ||
                     isAudioFile(file.fileName);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* File Header */}
      <div className="flex items-center gap-4 p-4 bg-muted/50">
        <div className="flex-shrink-0 w-12 h-12 bg-background rounded-lg flex items-center justify-center text-muted-foreground">
          {getFileIcon(file.fileName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{file.fileName}</h3>
          <p className="text-sm text-muted-foreground">{formatFileSize(file.fileSize)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="text-muted-foreground hover:text-foreground"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
            title="Open in new tab"
          >
            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          {canPreview && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggle}
              className="text-muted-foreground hover:text-foreground"
              title="Toggle preview"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* File Content Preview */}
      {expanded && (
        <div className="border-t border-border">
          {isImageFile(file.fileName) && (
            <div className="p-4 bg-background">
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="max-w-full h-auto rounded-lg mx-auto"
                style={{ maxHeight: "600px" }}
              />
            </div>
          )}

          {isTextFile(file.fileName) && (
            <div className="p-4 bg-background">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange mb-2"></div>
                  <p>Loading file content...</p>
                </div>
              ) : textContent?.includes("⚠️") || textContent?.includes("Unable to load") ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <FileCode className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Unable to Preview File</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                    This file cannot be previewed in the browser. Please download the file to view its contents.
                  </p>
                  <Button
                    variant="default"
                    onClick={handleDownload}
                    className="bg-orange hover:bg-orange/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (textContent) {
                          navigator.clipboard.writeText(textContent);
                        }
                      }}
                      className="text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-lg max-h-[600px] overflow-y-auto font-mono">
                    <code className="block">{textContent}</code>
                  </pre>
                  <div className="mt-2 text-xs text-muted-foreground px-2">
                    {textContent?.split('\n').length || 0} lines · {new Blob([textContent || '']).size} bytes
                  </div>
                </div>
              )}
            </div>
          )}

          {isPDFFile(file.fileName) && (
            <div className="bg-background p-4">
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src={`${file.fileUrl}#view=FitH`}
                  className="w-full h-[600px] border-0"
                  title={file.fileName}
                  onError={() => {
                    // Fallback if iframe fails
                    const container = document.querySelector(`iframe[title="${file.fileName}"]`)?.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="flex flex-col items-center justify-center h-[600px] text-muted-foreground">
                          <p class="mb-4">Unable to preview PDF in browser</p>
                          <a href="${file.fileUrl}" download="${file.fileName}" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            Download PDF
                          </a>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>
          )}

          {isOfficeFile(file.fileName) && (
            <div className="bg-background p-4">
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.fileUrl)}`}
                  className="w-full h-[600px] border-0"
                  title={file.fileName}
                />
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p>Preview powered by Microsoft Office Online. If preview doesn't load, try downloading the file.</p>
                </div>
              </div>
            </div>
          )}

          {isAudioFile(file.fileName) && (
            <div className="bg-background p-4">
              <div className="rounded-lg border border-border p-4">
                <audio controls className="w-full">
                  <source src={file.fileUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function LessonDocumentsTab({ files }: LessonDocumentsTabProps) {
  // Filter out video files
  const documentFiles = files?.filter((file) => !isVideoFile(file.fileName)) || [];

  if (documentFiles.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No documents available for this lesson</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold">Lesson Documents</h2>
        <p className="text-muted-foreground mt-2">
          View and download documents, code files, images, PDFs, Office files, and audio
        </p>
      </div>

      <div className="space-y-4">
        {documentFiles.map((file) => (
          <FilePreview key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
