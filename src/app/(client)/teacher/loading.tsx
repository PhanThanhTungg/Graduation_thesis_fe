import LoadingAnimation from "@/components/custom/loading-animation";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingAnimation />
    </div>
  )
} 