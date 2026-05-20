export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
  cover?: string;
  available: boolean;
  isbn?: string;
  location?: {
    sector: string;
    shelf: string;
  };
  rating?: number;
  reviews?: number;
  copies?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  loanDate: string;
  returnDate?: string;
  dueDate: string;
}
