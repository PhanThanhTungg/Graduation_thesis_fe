export default function ChatsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold mb-2">Chats</h1>
        <p className="text-muted-foreground">Your recent chats</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            No chats yet. Start a conversation!
          </p>
        </div>
      </div>
    </div>
  );
}
