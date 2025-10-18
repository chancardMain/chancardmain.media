// Анимация появления при загрузке
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  setTimeout(() => {
    container.classList.remove("hidden");
  }, 195); // лёгкая задержка для плавного эффекта
});

// Плавное появление
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  setTimeout(() => container.classList.remove("hidden"), 100);
});

// JS для копирования с анимацией галочки
document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', () => {
    const text = button.getAttribute('data-copy');
    navigator.clipboard.writeText(text).then(() => {
      // Показываем галочку
      button.classList.add('copied');
      setTimeout(() => button.classList.remove('copied'), 1000);
    });
  });
});