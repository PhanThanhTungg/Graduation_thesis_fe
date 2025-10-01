import LoadingAnimation from "@/components/custom/loading-animation";

export default function Loading() {
  return (
    <div className="w-screen h-[calc(100vh-90px)] flex items-center justify-center">
      <LoadingAnimation />
    </div>
  )
} 