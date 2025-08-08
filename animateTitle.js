document.addEventListener('DOMContentLoaded', () => {
  const titles = [
    '⚒️ Forge of Ovorldule', '✨ Создаем миры', '⚒️ Forge of Ovorldule', '🔥 Игровая алхимия', 
    '⚒️ Forge of Ovorldule', '⚒ Кузня проектов','⚒️ Forge of Ovorldule', '␡ Ковка кода'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;

  function animateTitle() {
    const currentTitle = titles[titleIndex];

    if (!isDeleting && charIndex < currentTitle.length) {
      document.title = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    } else if (isDeleting && charIndex > 0) {
      document.title = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    }

    if (charIndex === currentTitle.length) {
      isDeleting = true;
      typingSpeed = 200;
    } else if (charIndex === 1 && isDeleting) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 150;
    }

    setTimeout(animateTitle, typingSpeed);
  }

  animateTitle();
});