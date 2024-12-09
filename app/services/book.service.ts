import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  isbn: string;
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  publisher: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:3000/api/books'; // Backend API URL

  constructor(private http: HttpClient) { }

  // Get all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl); // Make GET request to fetch books
  }

  // Get a single book by ISBN
  getBookById(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${isbn}`);
  }

  // Update a book by ISBN
  updateBook(isbn: string, data: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${isbn}`, data);
  }
}
