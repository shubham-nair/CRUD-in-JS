// Helper: get query params
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Load Index Page
  function loadIndexPage() {
    const list = document.getElementById('books');
  
    // Fetch from API
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(res => res.json())
      .then(data => {
        data.forEach(book => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="item.html?id=${book.id}">${book.title}</a>`;
          list.appendChild(li);
        });
  
        // Load local books
        const localBooks = JSON.parse(localStorage.getItem('localBooks')) || [];
        localBooks.forEach(book => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="item.html?id=local-${book.id}">${book.title} (local)</a>`;
          list.appendChild(li);
        });
      });
  }
  
  // Load Item Page
  function loadItemPage() {
    const id = getQueryParam('id');
    const titleEl = document.getElementById('title');
    const bodyEl = document.getElementById('body');
  
    if (id.startsWith('local-')) {
      const localId = id.replace('local-', '');
      const localBooks = JSON.parse(localStorage.getItem('localBooks')) || [];
      const book = localBooks.find(b => b.id == localId);
      if (book) {
        titleEl.textContent = book.title;
        bodyEl.innerHTML = `
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Publisher:</strong> ${book.publisher}</p>
          <p><strong>Edition:</strong> ${book.edition}</p>
          <p><strong>Pages:</strong> ${book.pages}</p>
        `;
      }
    } else {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then(res => res.json())
        .then(book => {
          titleEl.textContent = book.title;
          bodyEl.textContent = book.body;
        });
    }
  }
  
  // Load Create Page
  function loadCreatePage() {
    const form = document.getElementById('book-form');
    const message = document.getElementById('message');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const book = {
        title: formData.get('title'),
        author: formData.get('author'),
        publisher: formData.get('publisher'),
        edition: formData.get('edition'),
        pages: formData.get('pages'),
      };
  
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      })
      .then(res => res.json())
      .then(data => {
        const localBooks = JSON.parse(localStorage.getItem('localBooks')) || [];
        localBooks.push({ id: Date.now(), ...book });
        localStorage.setItem('localBooks', JSON.stringify(localBooks));
  
        message.textContent = "✅ Book added successfully (simulated)";
        form.reset();
      });
    });
  }
  