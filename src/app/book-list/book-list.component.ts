import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';  // Import the service
import { Router } from '@angular/router';
import { Book } from '../services/book.service';  // Import the Book interface

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];  // Array to store books

  constructor(
    private bookService: BookService,  // Inject the service to fetch books
    private router: Router  // Router to navigate to edit page
  ) {}

  ngOnInit(): void {
    // Call the BookService to get the list of books when the component is initialized
    this.bookService.getBooks().subscribe((data: Book[]) => {
      this.books = data;  // Assign the fetched books to the books array
    });
  }

  // Method to navigate to the edit page for a specific book
  editBook(isbn: string): void {
    this.router.navigate(['/edit-book', isbn]);  // Navigate to the edit page with the book's ISBN
  }
}
