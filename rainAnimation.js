async function createRaindrop() {
    const rainContainer = document.getElementById('rain');
    const raindrop = document.createElement('img');

    const images = [
        "img/anime/01.jpg",
        "img/anime/02.jpg",
        "img/anime/03.jpg",
        "img/anime/04.jpg",
        "img/anime/05.jpg",
        "img/anime/06.jpg",
        "img/anime/07.jpg",
        "img/anime/08.jpg",
        "img/anime/09.jpg",
        "img/anime/10.jpg",
        "img/anime/11.jpg",
        "img/anime/12.jpg"
    ];
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