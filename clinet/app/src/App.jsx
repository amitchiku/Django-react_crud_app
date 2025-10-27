import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [editedTitles, setEditedTitles] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const addBook = async () => {
    if (!title || !releaseYear) return alert("Please fill all fields!");
    const bookData = { title, release_year: releaseYear };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      setBooks((prev) => [...prev, data]);
      setTitle("");
      setReleaseYear("");
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  const updateBook = async (pk, release_year) => {
  const newTitle = editedTitles[pk];
  if (!newTitle) return alert("Please enter a new title first!");
  const bookData = { title: newTitle, release_year };

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Update failed:", err);
      alert("Update failed: " + err);
      return;
    }

    const data = await response.json();
    setBooks((prev) => prev.map((book) => (book.id === pk ? data : book)));
    setEditedTitles((prev) => ({ ...prev, [pk]: "" }));
  } catch (err) {
    console.error("Error updating book:", err);
  }
};


  const deleteBook = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, { method: "DELETE" });
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-8 text-blue-800 drop-shadow-lg">
        📚 Book Management App
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-4 w-[90%] max-w-2xl">
        <input
          type="text"
          placeholder="Book Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="number"
          placeholder="Release Year..."
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={addBook}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
        >
          Add Book
        </button>
      </div>

      <div className="mt-10 w-[90%] max-w-3xl space-y-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center hover:shadow-xl transition"
          >
            <div>
              <p className="text-xl font-semibold text-gray-800">
                📖 {book.title}
              </p>
              <p className="text-gray-500">
                🗓 Release Year: {book.release_year}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 sm:mt-0">
              <input
                type="text"
                placeholder="New Title..."
                value={editedTitles[book.id] || ""}
                onChange={(e) =>
                  setEditedTitles((prev) => ({
                    ...prev,
                    [book.id]: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                onClick={() => updateBook(book.id, book.release_year)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
              >
                Update
              </button>
              <button
                onClick={() => deleteBook(book.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
