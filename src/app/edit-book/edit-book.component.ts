import { Component, OnInit } from '@angular/core';
import { Book } from '../services/book.service'; // Import the Book interface
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service'; // Import the service to interact with the backend

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  book: Book | null = null;  // Initialize with 'null' or empty object

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService // Inject the service for backend interaction
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe((data: Book) => {
        this.book = data;  // Populate the book data when available
      });
    }
  }

  // Method to update the book data
  updateBook(data: Book): void {
    if (this.book) {
      this.bookService.updateBook(this.book.isbn, data).subscribe(updatedBook => {
        console.log('Book updated:', updatedBook);
        this.router.navigate(['/book-list']);  // Redirect to book list after update
      });
    }
  }
}
