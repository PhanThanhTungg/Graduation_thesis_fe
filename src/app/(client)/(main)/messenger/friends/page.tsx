export default function FriendsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold mb-2">Friends</h1>
        <p className="text-muted-foreground">Your friends list</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            No friends yet. Add some friends!
          </p>
        </div>
      </div>
    </div>
  );
}
