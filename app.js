// Data resep disimpan di localStorage jika sudah ada, jika tidak, gunakan data awal
const KEY_RESEP = 'resepMasakanApp';

let resep = JSON.parse(localStorage.getItem(KEY_RESEP)) || [
  {
    judul: "Nasi Goreng Spesial",
    kategori: "Makanan Utama",
    tingkat: "Mudah",
    deskripsi: "Nasi goreng lezat dengan bumbu pilihan, telur orak-arik, dan suwiran ayam.",
    gambar: "assets/nasi-goreng.jpg",
    rating: 0,
    ulasan: [],
    isBookmarked: false // Tambahkan properti bookmark
  },
  {
    judul: "Sate Ayam Madura",
    kategori: "Lauk",
    tingkat: "Sedang",
    deskripsi: "Sate ayam empuk khas Madura dengan lumuran bumbu kacang pedas manis.",
    gambar: "assets/sate-ayam.jpg",
    rating: 0,
    ulasan: [],
    isBookmarked: false
  },
  {
    judul: "Pancake Lembut",
    kategori: "Dessert",
    tingkat: "Mudah",
    deskripsi: "Pancake lembut dan fluffy, cocok disajikan dengan sirup maple atau buah-buahan segar.",
    gambar: "assets/pancake.jpg",
    rating: 0,
    ulasan: [],
    isBookmarked: false
  },
  {
    judul: "Rendang Daging Sapi",
    kategori: "Lauk",
    tingkat: "Sulit",
    deskripsi: "Daging sapi empuk dimasak perlahan dengan santan dan rempah khas Minang hingga kering.",
    gambar: "assets/rendang.jpg",
    rating: 0,
    ulasan: [],
    isBookmarked: false
  },
  {
    judul: "Gado-Gado Siram",
    kategori: "Sayuran",
    tingkat: "Sedang",
    deskripsi: "Campuran sayuran segar rebus, lontong, tahu, dan telur, disiram dengan saus kacang gurih.",
    gambar: "assets/gado-gado.jpg",
    rating: 0,
    ulasan: [],
    isBookmarked: false
  }
  
];

// Fungsi untuk menyimpan data resep ke localStorage
function simpanResep() {
  localStorage.setItem(KEY_RESEP, JSON.stringify(resep));
}

// Elemen DOM
const daftarResepContainer = document.getElementById("daftar-resep");
const daftarBookmarkContainer = document.getElementById("daftar-bookmark");
const inputCari = document.getElementById("cari");
const navHome = document.getElementById("nav-home");
const navBookmark = document.getElementById("nav-bookmark");
const homeSection = document.getElementById("home-section");
const bookmarkSection = document.getElementById("bookmark-section");
const backFromBookmarkButton = document.getElementById("back-from-bookmark");
const menuToggleButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchButton = document.getElementById('search-button');

// Fungsi untuk menampilkan/menyembunyikan section
function showSection(sectionId) {
  document.querySelectorAll('main section').forEach(section => {
    section.classList.remove('active-section');
    section.classList.add('hidden-section');
  });
  document.getElementById(sectionId).classList.remove('hidden-section');
  document.getElementById(sectionId).classList.add('active-section');
}

function tampilkanResep(data, container, isBookmarkView = false) {
  container.innerHTML = "";
  if (data.length === 0) {
    if (isBookmarkView) {
      container.innerHTML = '<p class="no-bookmark-message">Belum ada resep yang dibookmark.</p>';
    } else {
      container.innerHTML = '<p class="no-bookmark-message">Tidak ada resep yang ditemukan.</p>';
    }
    return;
  }

  data.forEach((r, i) => {
    // Cari indeks asli dari resep di array 'resep' global
    const originalIndex = resep.findIndex(item => item.judul === r.judul && item.gambar === r.gambar);
    
    let stars = "";
    for (let s = 1; s <= 5; s++) {
      stars += `<span class="star ${s <= r.rating ? 'active' : 'inactive'}" onclick="beriRating(${originalIndex}, ${s})">★</span>`;
    }

    container.innerHTML += `
      <div class="card">
        <img src="${r.gambar}" alt="${r.judul}">
        <div class="card-content">
          <h2>${r.judul}</h2>
          <p><strong>Kategori:</strong> ${r.kategori}</p>
          <p><strong>Tingkat:</strong> ${r.tingkat}</p>
          <p>${r.deskripsi}</p>
          <div class="rating">
            <span>Rating:</span> ${stars}
          </div>
          <div class="card-buttons">
            <button onclick="toggleBookmark(${originalIndex})">
              <i class="fas ${r.isBookmarked ? 'fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
              ${r.isBookmarked ? 'Batalkan Bookmark' : 'Bookmark'}
            </button>
            <button onclick="bagikan('${r.judul}', '${r.deskripsi}', '${window.location.href}')">
              <i class="fas fa-share-alt"></i> Bagikan
            </button>
          </div>
          <div class="ulasan-section">
            <h4>Ulasan (${r.ulasan.length})</h4>
            <div class="ulasan-input-container">
              <input type="text" id="ulasan-${originalIndex}" placeholder="Tulis ulasan Anda..." aria-label="Tulis ulasan">
              <button onclick="kirimUlasan(${originalIndex})"><i class="fas fa-paper-plane"></i> Kirim</button>
            </div>
            <ul class="ulasan-list">
              ${r.ulasan.length > 0 ? r.ulasan.map(u => `<li>${u}</li>`).join("") : '<li>Belum ada ulasan.</li>'}
            </ul>
          </div>
        </div>
      </div>
    `;
  });
}

// Fungsi bookmark
function toggleBookmark(index) {
  resep[index].isBookmarked = !resep[index].isBookmarked;
  simpanResep();
  if (homeSection.classList.contains('active-section')) {
    tampilkanResep(resep, daftarResepContainer);
  } else if (bookmarkSection.classList.contains('active-section')) {
    tampilkanResep(resep.filter(r => r.isBookmarked), daftarBookmarkContainer, true);
  }
  alert(resep[index].judul + (resep[index].isBookmarked ? " ditambahkan ke bookmark." : " dihapus dari bookmark."));
}

// Fungsi bagikan
function bagikan(judul, deskripsi, url) {
  if (navigator.share) {
    navigator.share({
      title: judul,
      text: deskripsi,
      url: url
    }).then(() => {
      console.log('Berhasil berbagi!');
    }).catch((error) => {
      console.error('Gagal berbagi:', error);
      alert("Gagal berbagi resep. Silakan coba lagi.");
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    prompt("Salin tautan resep ini:", url);
  }
}

// Fungsi beri rating
function beriRating(index, rating) {
  resep[index].rating = rating;
  simpanResep();
  if (homeSection.classList.contains('active-section')) {
    tampilkanResep(resep, daftarResepContainer);
  } else if (bookmarkSection.classList.contains('active-section')) {
    tampilkanResep(resep.filter(r => r.isBookmarked), daftarBookmarkContainer, true);
  }
}

// Fungsi kirim ulasan
function kirimUlasan(index) {
  const input = document.getElementById(`ulasan-${index}`);
  if (input && input.value.trim() !== "") {
    resep[index].ulasan.push(input.value.trim());
    input.value = "";
    simpanResep();
    if (homeSection.classList.contains('active-section')) {
      tampilkanResep(resep, daftarResepContainer);
    } else if (bookmarkSection.classList.contains('active-section')) {
      tampilkanResep(resep.filter(r => r.isBookmarked), daftarBookmarkContainer, true);
    }
  } else if (input) {
    alert("Ulasan tidak boleh kosong.");
  }
}

// Event listener untuk pencarian
inputCari.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filteredResep = resep.filter(r =>
    r.judul.toLowerCase().includes(searchTerm) ||
    r.kategori.toLowerCase().includes(searchTerm) ||
    r.deskripsi.toLowerCase().includes(searchTerm)
  );
  tampilkanResep(filteredResep, daftarResepContainer);
});

searchButton.addEventListener('click', () => {
  const searchTerm = inputCari.value.toLowerCase();
  const filteredResep = resep.filter(r =>
    r.judul.toLowerCase().includes(searchTerm) ||
    r.kategori.toLowerCase().includes(searchTerm) ||
    r.deskripsi.toLowerCase().includes(searchTerm)
  );
  tampilkanResep(filteredResep, daftarResepContainer);
});

// Event listener navigasi
navHome.addEventListener('click', (e) => {
  e.preventDefault();
  showSection('home-section');
  tampilkanResep(resep, daftarResepContainer);
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active'); // Close menu on mobile
  }
});

navBookmark.addEventListener('click', (e) => {
  e.preventDefault();
  showSection('bookmark-section');
  const bookmarkedResep = resep.filter(r => r.isBookmarked);
  tampilkanResep(bookmarkedResep, daftarBookmarkContainer, true);
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active'); // Close menu on mobile
  }
});

backFromBookmarkButton.addEventListener('click', () => {
  showSection('home-section');
  tampilkanResep(resep, daftarResepContainer);
});

// Event listener untuk menu toggle (mobile)
menuToggleButton.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Inisialisasi tampilan
tampilkanResep(resep, daftarResepContainer);

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Tangkap event sebelum install
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // Cegah prompt default
  deferredPrompt = e;
  installBtn.style.display = "inline-block"; // Tampilkan tombol

  installBtn.addEventListener("click", () => {
    installBtn.style.display = "none";
    deferredPrompt.prompt(); // Tampilkan prompt instalasi

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
    });
  });
});
