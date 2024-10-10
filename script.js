const bird = document.getElementById('bird');
const obstacle = document.getElementById('obstacle');
const obstacleTop = document.getElementById('obstacleTop');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

// Variabili iniziali
let birdTop = 250;
let birdVelocity = 0; // Velocità iniziale dell'aereo
let gravity = 0.25;   // Accelerazione gravitazionale
let jumpStrength = -7; // Impulso verso l'alto
let isGameOver = false;
let score = 0;

let lives = 3; // Numero di vite iniziali
let invulnerable = false; // Stato di invulnerabilità
const invulnerabilityDuration = 2000; // Durata dell'invulnerabilità in millisecondi

// Inizializziamo l'altezza e la posizione del buco
let obstacleLeft = 400;
let gapHeight = 150;
let gapPosition = Math.random() * (400 - gapHeight) + 100;  // Posizione verticale del buco

function startGame() {
    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', jump); // Aggiunta del touch
    updateLives(); // Mostra il numero iniziale di vite
    updateScore(); // Mostra il punteggio iniziale

    // Inizia il ciclo di gioco
    gameInterval = setInterval(gameLoop, 20);
}

function gameLoop() {
    if (isGameOver) return;

    // Aggiorna la velocità dell'aereo con la gravità
    birdVelocity += gravity;
    birdTop += birdVelocity;  // Aggiorna la posizione dell'aereo

    // Limita la posizione dell'aereo allo schermo
    if (birdTop < 0) {
        birdTop = 0; // Evita che l'aereo salga fuori dallo schermo
        birdVelocity = 0; // Reset della velocità verso l'alto
    }
    bird.style.top = birdTop + 'px';

    // Effetto di rotazione
    if (birdVelocity < 0) {
        bird.style.transform = 'rotate(-20deg)'; // Rotazione verso l'alto quando sale
    } else {
        bird.style.transform = 'rotate(20deg)';  // Rotazione verso il basso quando scende
    }

    // Movimento degli ostacoli
    obstacleLeft -= 5;
    if (obstacleLeft < -60) {
        obstacleLeft = 400;
        gapPosition = Math.random() * (400 - gapHeight) + 100; // Genera un nuovo buco
        score++;
        updateScore(); // Aggiorna il punteggio
    }

    // Applica la posizione aggiornata agli ostacoli
    obstacle.style.left = obstacleLeft + 'px';
    obstacle.style.height = (600 - (gapPosition + gapHeight)) + 'px';
    obstacleTop.style.left = obstacleLeft + 'px';
    obstacleTop.style.height = gapPosition + 'px';

    // Controllo delle collisioni solo se non siamo invulnerabili
    if (birdTop > 560 || (lives > 0 && !invulnerable && checkCollision())) {
        lives--; // Perdi una vita
        updateLives(); // Aggiorna il contatore di vite

        if (lives > 0) {
            resetBird(); // Ripristina l'aereo in una posizione sicura
            startInvulnerability(); // Inizia il periodo di invulnerabilità
        } else {
            gameOver(); // Se non ci sono più vite, termina il gioco
        }
    }
}

function jump(event) {
    if (event.code === 'Space' || event.type === 'touchstart') {
        birdVelocity = jumpStrength;  // Applica un impulso verso l'alto
        
        // Effetto di rotazione immediata verso l'alto
        bird.style.transform = 'rotate(-20deg)';
    }
}

function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const obstacleTopRect = obstacleTop.getBoundingClientRect();

    // Definire una hitbox più piccola
    const hitboxPadding = 20; // Rimpicciolisci la hitbox di 20px su ogni lato
    const birdHitbox = {
        left: birdRect.left + hitboxPadding,
        right: birdRect.right - hitboxPadding,
        top: birdRect.top + hitboxPadding,
        bottom: birdRect.bottom - hitboxPadding
    };

    // Collisione con l'ostacolo superiore o inferiore
    return (
        (birdHitbox.right > obstacleRect.left && birdHitbox.left < obstacleRect.right &&
         birdHitbox.bottom > obstacleRect.top) ||
        (birdHitbox.right > obstacleTopRect.left && birdHitbox.left < obstacleTopRect.right &&
         birdHitbox.top < obstacleTopRect.bottom)
    );
}

function resetBird() {
    // Ripristina l'aereo a una posizione sicura
    birdTop = 250; // Posizione sicura (puoi modificare questo valore)
    bird.style.top = birdTop + 'px';
}

function startInvulnerability() {
    invulnerable = true; // Attiva l'invulnerabilità
    setTimeout(() => {
        invulnerable = false; // Disattiva l'invulnerabilità dopo 2 secondi
    }, invulnerabilityDuration);
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval); // Ferma il ciclo di gioco
    gameOverElement.style.display = 'block'; // Mostra il messaggio di game over
}

function restartGame() {
    // Ripristina tutte le variabili e gli elementi
    isGameOver = false;
    lives = 3;
    score = 0;
    birdTop = 250;
    obstacleLeft = 400;
    gapPosition = Math.random() * (400 - gapHeight) + 100; // Ripristina la posizione del buco
    invulnerable = false; // Resetta lo stato di invulnerabilità
    gameOverElement.style.display = 'none'; // Nascondi il messaggio di game over

    // Rimuovi gli eventi prima di riavviare il gioco
    document.removeEventListener('keydown', jump);
    document.removeEventListener('touchstart', jump);
    clearInterval(gameInterval); // Ferma l'intervallo del ciclo di gioco
    resetObstacles(); // Resetta gli ostacoli

    startGame(); // Riavvia il gioco
}

function updateLives() {
    livesElement.innerHTML = `Lives: ${lives}`; // Aggiorna il contatore di vite
}

function updateScore() {
    scoreElement.innerHTML = `Score: ${score}`; // Aggiorna il punteggio
}

function resetObstacles() {
    obstacleLeft = 400;
    obstacle.style.left = obstacleLeft + 'px';
    obstacle.style.height = (600 - (gapPosition + gapHeight)) + 'px';
    obstacleTop.style.left = obstacleLeft + 'px';
    obstacleTop.style.height = gapPosition + 'px';
}

// Avvia il gioco
let gameInterval; // Variabile per il ciclo di gioco
startGame();
