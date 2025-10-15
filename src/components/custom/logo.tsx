export default function Logo({className}: {className?: string}) {
  return (
    <strong className={`font-knewave text-4xl font-thin select-none bg-linear-to-r from-yellow to-green text-transparent bg-clip-text ${className}`}>
      Aikabis
    </strong>
  )
}