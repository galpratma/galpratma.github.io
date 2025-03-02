/*=============== FILTERS TABS ===============*/
const tabs = document.querySelectorAll("[data-target]"),
  tabContents = document.querySelectorAll("[data-content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabContents.forEach((tc) => {
      tc.classList.remove("filters__active");
    });
    target.classList.add("filters__active");

    tabs.forEach((t) => {
      t.classList.remove("filter-tab-active");
    });
    tab.classList.add("filter-tab-active");
  });
});

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => (document.body.classList.contains(darkTheme) ? "dark" : "light");
const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? "ri-moon-line" : "ri-sun-line");

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);
  themeButton.classList[selectedIcon === "ri-moon-line" ? "add" : "remove"](iconTheme);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
});

sr.reveal(`.profile__border`);
sr.reveal(`.profile__name`, { delay: 500 });
sr.reveal(`.profile__profession`, { delay: 600 });
sr.reveal(`.profile__social`, { delay: 700 });
sr.reveal(`.profile__info-group`, { interval: 100, delay: 700 });
sr.reveal(`.profile__buttons`, { delay: 800 });
sr.reveal(`.filters__content`, { delay: 900 });
sr.reveal(`.filters`, { delay: 1000 });

function calculateYear(birthMonth, birthDay, birthYear) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  let calculatedAge = currentYear - birthYear;

  if (currentMonth < birthMonth - 1) {
    calculatedAge--;
  }
  if (birthMonth - 1 === currentMonth && currentDay < birthDay) {
    calculatedAge--;
  }
  return calculatedAge;
}

// Username GitHub yang ingin ditampilkan
const username = "galpratma"; // Ganti dengan username GitHub Anda

// Fungsi untuk menampilkan pengalaman kerja
const experience = document.getElementById("experience");
experience.innerHTML = calculateYear(2, 1, 2023).toString() + "+";

// Fungsi untuk mendapatkan jumlah proyek di GitHub
async function getPublicRepo() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();

    // Update jumlah repository publik
    document.getElementById("gh-project").innerHTML = `${userData?.public_repos}+`;

    // Hitung jumlah tahun di GitHub
    if (userData.created_at) {
      const createdDate = new Date(userData.created_at);
      const currentDate = new Date();
      const yearsOnGitHub = Math.floor((currentDate - createdDate) / (365 * 24 * 60 * 60 * 1000));

      // Jika ingin menampilkan tahun pengalaman di GitHub, aktifkan baris berikut:
      // experience.innerHTML = `${yearsOnGitHub}+`;
    }

    // Mendapatkan semua repository untuk menghitung bintang
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await reposResponse.json();

    // Menghitung jumlah bintang
    let totalStars = 0;
    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;
    });

    // Update elemen yang menampilkan jumlah bintang
    const starsElements = document.querySelectorAll(".profile__info-number");
    if (starsElements.length > 1) {
      starsElements[1].textContent = totalStars > 0 ? totalStars : "4"; // Gunakan nilai default jika tidak ada bintang
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    document.getElementById("gh-project").innerHTML = "0+";
  }
}

// Panggil fungsi saat dokumen dimuat
document.addEventListener("DOMContentLoaded", () => {
  getPublicRepo();
});
