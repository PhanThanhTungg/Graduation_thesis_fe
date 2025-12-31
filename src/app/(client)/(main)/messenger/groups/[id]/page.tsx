export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold">Conversation</h1>
        <p className="text-muted-foreground">Conversation ID: {params.id}</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            Conversation view will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
}
