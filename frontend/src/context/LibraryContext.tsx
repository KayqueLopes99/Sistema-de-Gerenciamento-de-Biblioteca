import { createContext, useContext, useState } from "react";
import type { Loan } from "../types";

interface LibraryContextType {
  loans: Loan[];
  favorites: number[];
  addLoan: (bookId: number, bookTitle: string) => void;
  renewLoan: (loanId: number) => void;
  returnBook: (loanId: number) => void;
  toggleFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
  isBookLoaned: (bookId: number) => boolean;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

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

  return (
    <LibraryContext.Provider value={{
      loans, favorites, addLoan, renewLoan, returnBook,
      toggleFavorite,
      isFavorite: (id) => favorites.includes(id),
      isBookLoaned: (id) => loans.some(l => l.bookId === id && !l.returnDate),
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
};