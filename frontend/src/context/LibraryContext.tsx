import { createContext, useContext, useState } from "react";
import type { Loan, Review } from "../types";

interface LibraryContextType {
  loans: Loan[];
  favorites: number[];
  addLoan: (bookId: number, bookTitle: string) => void;
  renewLoan: (loanId: number) => void;
  returnBook: (loanId: number) => void;
  toggleFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
  isBookLoaned: (bookId: number) => boolean;
  
  reviews: Review[];
  addReview: (
    bookId: number,
    rating: number,
    comment: string
) => void;

getBookReviews: (bookId: number) => Review[];
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const addLoan = (bookId: number, bookTitle: string) => {
    const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setLoans(prev => [...prev, {
      id: Date.now(), bookId, bookTitle,
      loanDate: new Date().toISOString(), dueDate: due,
    }]);
  };

  const renewLoan = (loanId: number) => {
    setLoans(prev => prev.map(l => l.id === loanId
      ? { ...l, dueDate: new Date(new Date(l.dueDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() }
      : l));
  };

  const returnBook = (loanId: number) => {
    setLoans(prev => prev.map(l => l.id === loanId
      ? { ...l, returnDate: new Date().toISOString() } : l));
  };

  const toggleFavorite = (bookId: number) => {
    setFavorites(prev => prev.includes(bookId)
      ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };

  const addReview = (
    bookId: number,
    rating: number,
    comment: string
  ) => {
  
    setReviews(prev => [
      ...prev,
      {
        id: Date.now(),
        bookId,
        rating,
        comment,
        userName: "Usuário Atual",
        createdAt: new Date().toISOString(),
      }
    ]);
  };

  return (
    <LibraryContext.Provider 
      value={{
        loans, favorites, reviews, addLoan, renewLoan, returnBook, 
        toggleFavorite, addReview, 

        getBookReviews: (bookId) => 
          reviews.filter(r=>r.bookId===bookId),
        isFavorite: (id) => favorites.includes(id),
        isBookLoaned:(id) => loans.some(l=>l.bookId===id && !l.returnDate),
      }}
    >{children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
};