export const statusLabels: Record<string, string> = {
  new: "New",
  learning: "Learning",
  reviewing: "Reviewing",
  lapsed: "Lapsed",
  suspending: "Suspended",
};

export const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  learning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  reviewing: "bg-green-500/10 text-green-500 border-green-500/20",
  lapsed: "bg-red-500/10 text-red-500 border-red-500/20",
  suspending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export const difficultyLabels: Record<string, string> = {
  very_easy: "Very Easy",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const difficultyColors: Record<string, string> = {
  very_easy: "bg-green-500/10 text-green-500 border-green-500/20",
  easy: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
};
