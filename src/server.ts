import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Initialize Express app
const app = express();
const angularApp = new AngularNodeAppEngine();

// Sample book data (for the sake of this example, you can replace this with a database)
let books = [
  { isbn: '123456', title: 'Book 1', author: 'Author 1', description: 'Description 1', publishedYear: 2021, publisher: 'Publisher 1' },
  { isbn: '789012', title: 'Book 2', author: 'Author 2', description: 'Description 2', publishedYear: 2022, publisher: 'Publisher 2' },
];

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// API route to get a book by ISBN
app.get('/api/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// API route to update a book by ISBN
app.put('/api/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const updatedBook = req.body;
  const bookIndex = books.findIndex(b => b.isbn === isbn);

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Handle all other requests by rendering the Angular application
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Start the server if this module is the main entry point
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// The request handler used by Angular CLI (dev-server and build)
export const reqHandler = createNodeRequestHandler(app);
