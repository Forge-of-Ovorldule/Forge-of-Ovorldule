document.addEventListener('DOMContentLoaded', () => {
  const readmeUrl =
      'https://raw.githubusercontent.com/Forge-of-Ovorldule/.github/main/profile/README.md';

  const contentElement = document.getElementById('content');
  const loadingElement = document.getElementById('loading');

  fetch(readmeUrl)
      .then(response => {
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        return response.text();
      })
      .then(markdown => {
        const htmlContent = marked.parse(markdown);

        contentElement.innerHTML = htmlContent;
        loadingElement.style.display = 'none';
      })
      .catch(error => {
        console.error('Ошибка:', error);
        loadingElement.textContent = 'Не удалось загрузить описание студии.';
        contentElement.innerHTML = `
                <p>Посетите наш GitHub профиль:</p>
                <p><a href="https://github.com/Forge-of-Ovorldule" target="_blank">github.com/Forge-of-Ovorldule</a></p>
            `;
      });
});