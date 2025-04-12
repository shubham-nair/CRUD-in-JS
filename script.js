const API_URL = 'https://jsonplaceholder.typicode.com/posts';

function loadIndexPage() {
  const list = document.getElementById('books');
  list.innerHTML = '';

  fetch(`${API_URL}?_limit=5`)
    .then(res => res.json())
    .then(apiBooks => {
      apiBooks.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${book.title}</strong><br>
          <a href="item.html?id=api-${book.id}">🔍 View</a>
          <a href="edit.html?id=api-${book.id}">✏️ Edit</a>
          <button onclick="deleteBook('api-${book.id}')">🗑️ Delete</button>
        `;
        list.appendChild(li);
      });

      const localBooks = JSON.parse(localStorage.getItem('books')) || [];
      localBooks.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${book.title}</strong><br>
          <a href="item.html?id=local-${book.id}">🔍 View</a>
          <a href="edit.html?id=local-${book.id}">✏️ Edit</a>
          <button onclick="deleteBook('local-${book.id}')">🗑️ Delete</button>
        `;
        list.appendChild(li);
      });
    });
}

function deleteBook(id) {
  if (id.startsWith('local-')) {
    const localId = id.replace('local-', '');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updated = books.filter(b => b.id != localId);
    localStorage.setItem('books', JSON.stringify(updated));
    loadIndexPage();
  } else {
    const apiId = id.replace('api-', '');
    fetch(`${API_URL}/${apiId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          alert('🗑️ API book deleted (simulated)');
          loadIndexPage();
        }
      });
  }
}

function loadCreatePage() {
  const form = document.getElementById('book-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = {
      id: Date.now(),
      title: form.title.value,
      author: form.author.value,
      publisher: form.publisher.value,
      edition: form.edition.value,
      pages: form.pages.value
    };
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    alert('✅ Book created!');
    window.location.href = 'index.html';
  });
}

function loadEditPage() {
  const id = new URLSearchParams(location.search).get('id');
  const form = document.getElementById('edit-form');

  if (id.startsWith('local-')) {
    const localId = id.replace('local-', '');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id == localId);

    form.title.value = book.title;
    form.author.value = book.author;
    form.publisher.value = book.publisher;
    form.edition.value = book.edition;
    form.pages.value = book.pages;

    form.onsubmit = function (e) {
      e.preventDefault();
      const updated = {
        id: book.id,
        title: form.title.value,
        author: form.author.value,
        publisher: form.publisher.value,
        edition: form.edition.value,
        pages: form.pages.value
      };
      const index = books.findIndex(b => b.id == book.id);
      books[index] = updated;
      localStorage.setItem('books', JSON.stringify(books));
      alert('✅ Book updated!');
      window.location.href = 'index.html';
    };
  } else {
    const apiId = id.replace('api-', '');
    fetch(`${API_URL}/${apiId}`)
      .then(res => res.json())
      .then(book => {
        form.title.value = book.title;
        form.author.value = 'API Author';
        form.publisher.value = 'API Publisher';
        form.edition.value = 'API Edition';
        form.pages.value = '123';

        form.onsubmit = function (e) {
          e.preventDefault();
          const updatedBook = {
            title: form.title.value,
            author: form.author.value,
            publisher: form.publisher.value,
            edition: form.edition.value,
            pages: form.pages.value
          };
          fetch(`${API_URL}/${apiId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBook)
          })
            .then(res => res.json())
            .then(() => {
              alert('✅ API Book updated (simulated)');
              window.location.href = 'index.html';
            });
        };
      });
  }
}

function loadItemPage() {
  const id = new URLSearchParams(location.search).get('id');

  if (id.startsWith('local-')) {
    const localId = id.replace('local-', '');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.id == localId);

    document.getElementById('title').textContent = book.title;
    document.getElementById('author').textContent = book.author;
    document.getElementById('publisher').textContent = book.publisher;
    document.getElementById('edition').textContent = book.edition;
    document.getElementById('pages').textContent = book.pages;
  } else {
    const apiId = id.replace('api-', '');
    fetch(`${API_URL}/${apiId}`)
      .then(res => res.json())
      .then(book => {
        document.getElementById('title').textContent = book.title;
        document.getElementById('author').textContent = 'API Author';
        document.getElementById('publisher').textContent = 'API Publisher';
        document.getElementById('edition').textContent = 'API Edition';
        document.getElementById('pages').textContent = '100';
      });
  }
}
