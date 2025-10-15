import { Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ArticleType = {
  id: number;
  category: string;
  thumbnail: string;
  title: string;
  description: string;
  author: string;
  readTime: string;
  date: string;
}

export default function ArticleCard({ article }: {article: ArticleType}) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group"
    >
      <div className="bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-video">
          <div className="absolute top-4 left-4 z-10 bg-green text-white px-3 py-1 rounded text-sm font-medium">
            {article.category}
          </div>
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <User className="size-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {article.readTime}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-green transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {article.description}
          </p>
          <div className="text-sm text-muted-foreground">
            {article.date}
          </div>
        </div>
      </div>
    </Link>
  )
}