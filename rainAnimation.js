async function createRaindrop(ismodeEnabled) {
    const rainContainer = document.getElementById('rain');
    const raindrop = document.createElement('img');

    const totalImages = 32;
    const images = Array.from({ length: totalImages }, (_, i) => `img/anime/${String(i + 1).padStart(2, '0')}.jpg`);

    const randomImageIndex = Math.floor(Math.random() * images.length);
    raindrop.src = images[randomImageIndex];  // Randomly selected image

    raindrop.className = "raindrop";
    let randomDuration = Math.random() * (3 - 1) + 1;  // Random duration between 1 and 2 seconds
    raindrop.style.animationDuration = `${randomDuration}s`;

    let randomLeft = Math.random() * (rainContainer.offsetWidth - 30);
    raindrop.style.left = `${randomLeft}px`;

    raindrop.addEventListener('animationend', () => {
        raindrop.parentNode.removeChild(raindrop);
    });
    rainContainer.appendChild(raindrop);
}
