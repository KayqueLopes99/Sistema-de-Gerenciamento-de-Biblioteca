import { Link } from "react-router";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Star } from "lucide-react";
import { useState } from "react";

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    year: number;
    cover?: string;
    rating?: number;
    reviews?: number;
    available?: boolean;
  };
}

export function BookCard({ book }: BookCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/book/${book.id}`}>
      <Card hover className="h-full">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {book.cover && !imgError ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl">📚</span>
            </div>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 min-h-[3rem]">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        {book.rating && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({book.reviews})</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {book.available !== undefined ? (
            <Badge variant={book.available ? "success" : "warning"}>
              {book.available ? "Disponível" : "Indisponível"}
            </Badge>
          ) : (
            <Badge variant="default">Detalhes</Badge>
          )}
          <span className="text-xs text-muted-foreground">{book.year}</span>
        </div>
      </Card>
    </Link>
  );
}