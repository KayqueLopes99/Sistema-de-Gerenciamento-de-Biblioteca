import { Link } from "react-router";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Book } from "../app/types";
import { useLibrary } from "../context/LibraryContext";
import { Star } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { isBookLoaned } = useLibrary();
  const loaned = isBookLoaned(book.id);

  return (
    <Link to={`/book/${book.id}`}>
      <Card hover className="h-full">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">📚</span>
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
          <Badge variant={loaned ? "warning" : "success"}>
            {loaned ? "Emprestado" : "Disponível"}
          </Badge>
          <span className="text-xs text-muted-foreground">{book.year}</span>
        </div>
      </Card>
    </Link>
  );
}
