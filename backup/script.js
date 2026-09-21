// ============================================================
// Para ti, con mucho cariño 💛 — script.js
// (v2: composición de ramo de girasoles + cielo estrellado)
// Toda la interacción y las animaciones se controlan aquí.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const mainTitle = document.getElementById('mainTitle');
  const subtitle = document.getElementById('subtitle');
  const giftButton = document.getElementById('giftButton');
  const buttonLabel = document.getElementById('buttonLabel');
  const hint = document.getElementById('hint');
  const flowerField = document.getElementById('flowerField');
  const petalLayer = document.getElementById('petalLayer');
  const glowLayer = document.getElementById('glowLayer');

  let opened = false;
  let ambientTimers = [];

  // Entrada suave del título y subtítulo al cargar la página
  mainTitle.classList.add('reveal');
  subtitle.classList.add('reveal');

  // El cielo estrellado está presente desde el primer momento
  generateStars(26);

  // --------------------------------------------------------
  // Utilidades
  // --------------------------------------------------------

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  // --------------------------------------------------------
  // Estrellas de fondo (ambiente permanente, no requiere clic)
  // --------------------------------------------------------

  function generateStars(count) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${randomBetween(0, 70)}%`;
      star.style.left = `${randomBetween(0, 100)}%`;
      star.style.animationDuration = `${randomBetween(2, 5)}s`;
      star.style.animationDelay = `${randomBetween(0, 4)}s`;
      const size = randomBetween(2, 4);
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      glowLayer.appendChild(star);
    }
  }

  // --------------------------------------------------------
  // Crear una flor tipo girasol (tallo + hojas + pétalos en dos tonos)
  // config: { leftPct, bottomPx, rotateDeg, scale, delayMs, headSize }
  // --------------------------------------------------------

  function createFlower(config) {
    const { leftPct, bottomPx, rotateDeg, scale, delayMs, headSize } = config;

    const slot = document.createElement('div');
    slot.className = 'flower-slot';
    slot.style.left = `${leftPct}%`;
    slot.style.bottom = `${bottomPx}px`;
    slot.style.transform = `translateX(-50%) rotate(${rotateDeg}deg)`;

    const pop = document.createElement('div');
    pop.className = 'flower-pop';
    pop.style.setProperty('--scale', scale);
    pop.style.transitionDelay = `${delayMs}ms`;

    const stemHeight = randomBetween(120, 180);

    const head = document.createElement('div');
    head.className = 'flower-head';
    head.style.width = `${headSize}px`;
    head.style.height = `${headSize}px`;
    head.style.animationDelay = `${randomBetween(0, 3)}s`;

    // Pétalos exteriores (más largos, tono profundo) para dar volumen
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i;

      const outer = document.createElement('div');
      outer.className = 'flower-petal-outer';
      outer.style.height = `${headSize * 0.5}px`;
      outer.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
      head.appendChild(outer);
    }

    // Pétalos interiores (más cortos y brillantes) encima de los exteriores
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i + (360 / petalCount) / 2;

      const inner = document.createElement('div');
      inner.className = 'flower-petal-inner';
      inner.style.height = `${headSize * 0.34}px`;
      inner.style.transform = `translate(-50%, -95%) rotate(${angle}deg)`;
      head.appendChild(inner);
    }

    const center = document.createElement('div');
    center.className = 'flower-center';
    center.style.width = `${headSize * 0.36}px`;
    center.style.height = `${headSize * 0.36}px`;
    head.appendChild(center);

    const stemWrapper = document.createElement('div');
    stemWrapper.style.position = 'relative';

    const stem = document.createElement('div');
    stem.className = 'flower-stem';
    stem.style.height = `${stemHeight}px`;

    // Un par de hojitas sobre el tallo
    const leaf1 = document.createElement('div');
    leaf1.className = 'flower-leaf';
    leaf1.style.top = `${stemHeight * 0.3}px`;
    leaf1.style.left = '2px';
    leaf1.style.transform = 'rotate(20deg)';

    const leaf2 = document.createElement('div');
    leaf2.className = 'flower-leaf';
    leaf2.style.top = `${stemHeight * 0.58}px`;
    leaf2.style.right = '2px';
    leaf2.style.left = 'auto';
    leaf2.style.transform = 'rotate(-20deg) scaleX(-1)';

    stemWrapper.appendChild(stem);
    stemWrapper.appendChild(leaf1);
    stemWrapper.appendChild(leaf2);

    pop.appendChild(head);
    pop.appendChild(stemWrapper);
    slot.appendChild(pop);
    flowerField.appendChild(slot);

    // Activar la animación de crecimiento en el siguiente frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pop.classList.add('grown');
      });
    });

    return slot;
  }

  // --------------------------------------------------------
  // Hojas grandes agrupadas en la base del ramo
  // --------------------------------------------------------

  function createBaseLeaves() {
    const cluster = document.createElement('div');
    cluster.className = 'leaf-cluster';

    const leafConfigs = [
      { left: 18, rotate: -34, size: 1.0 },
      { left: 30, rotate: -18, size: 1.15 },
      { left: 42, rotate: -6, size: 0.9 },
      { left: 58, rotate: 6, size: 0.9 },
      { left: 70, rotate: 18, size: 1.15 },
      { left: 82, rotate: 34, size: 1.0 },
      { left: 50, rotate: 0, size: 1.25 },
    ];

    leafConfigs.forEach((cfg) => {
      const leaf = document.createElement('div');
      leaf.className = 'base-leaf';
      leaf.style.left = `${cfg.left}%`;
      leaf.style.transform = `translateX(-50%) rotate(${cfg.rotate}deg) scale(${cfg.size})`;
      cluster.appendChild(leaf);
    });

    flowerField.appendChild(cluster);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cluster.classList.add('grown');
      });
    });
  }

  // --------------------------------------------------------
  // Composición del ramo: 8 girasoles en abanico, con profundidad
  // --------------------------------------------------------

  function growFlowerField() {
    // Hojas de fondo primero, para que los tallos "nazcan" entre ellas
    createBaseLeaves();

    // Cada entrada define un girasol: posición, altura de tallo,
    // inclinación, tamaño relativo y tamaño de la cabeza (profundidad).
    const bouquet = [
      { leftPct: 50, bottomPx: 210, rotateDeg: 0,   scale: 1.05, headSize: 66, delayMs: 260 }, // centro, atrás
      { leftPct: 32, bottomPx: 185, rotateDeg: -12, scale: 0.95, headSize: 58, delayMs: 380 },
      { leftPct: 68, bottomPx: 185, rotateDeg: 12,  scale: 0.95, headSize: 58, delayMs: 380 },
      { leftPct: 18, bottomPx: 140, rotateDeg: -20, scale: 0.9,  headSize: 54, delayMs: 500 },
      { leftPct: 82, bottomPx: 140, rotateDeg: 20,  scale: 0.9,  headSize: 54, delayMs: 500 },
      { leftPct: 50, bottomPx: 110, rotateDeg: 0,   scale: 1.2,  headSize: 76, delayMs: 120 }, // frente, la más grande
      { leftPct: 34, bottomPx: 90,  rotateDeg: -8,  scale: 1.0,  headSize: 62, delayMs: 620 },
      { leftPct: 66, bottomPx: 90,  rotateDeg: 8,   scale: 1.0,  headSize: 62, delayMs: 620 },
    ];

    bouquet.forEach((cfg) => createFlower(cfg));
  }

  // --------------------------------------------------------
  // Pétalos flotando por la pantalla
  // --------------------------------------------------------

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const startLeft = randomBetween(0, 100);
    const duration = randomBetween(6, 11);
    const drift = randomBetween(-80, 80);
    const rotateSize = randomBetween(0.8, 1.4);

    petal.style.left = `${startLeft}%`;
    petal.style.setProperty('--drift', `${drift}px`);
    petal.style.animationDuration = `${duration}s`;
    petal.style.transform = `scale(${rotateSize})`;

    petalLayer.appendChild(petal);

    petal.addEventListener('animationend', () => petal.remove());
  }

  function launchPetalBurst(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createPetal(), i * 180);
    }
  }

  // --------------------------------------------------------
  // Brillos / partículas (destello puntual, distinto de las estrellas fijas)
  // --------------------------------------------------------

  function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const top = randomBetween(10, 90);
    const left = randomBetween(5, 95);
    const duration = randomBetween(1.6, 2.6);

    sparkle.style.top = `${top}%`;
    sparkle.style.left = `${left}%`;
    sparkle.style.animationDuration = `${duration}s`;

    glowLayer.appendChild(sparkle);

    sparkle.addEventListener('animationend', () => sparkle.remove());
  }

  function launchSparkleBurst(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createSparkle(), i * 140);
    }
  }

  // --------------------------------------------------------
  // Ambiente continuo y sutil una vez abierto el regalo
  // --------------------------------------------------------

  function startAmbientEffects() {
    const petalInterval = setInterval(() => createPetal(), 1400);
    const sparkleInterval = setInterval(() => createSparkle(), 900);
    ambientTimers.push(petalInterval, sparkleInterval);
  }

  // --------------------------------------------------------
  // Evento principal: abrir el regalo
  // --------------------------------------------------------

  giftButton.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // 1. El mensaje principal recibe un pequeño énfasis
    mainTitle.classList.add('celebrate');

    // 2. El ramo de girasoles crece desde la parte inferior
    growFlowerField();

    // 3. Ráfaga inicial de pétalos flotando
    launchPetalBurst(18);

    // 4. Ráfaga inicial de brillos
    launchSparkleBurst(14);

    // 5. Efectos suaves y continuos, sin exagerar
    startAmbientEffects();

    // 6. El botón cambia de texto y se deshabilita visualmente
    buttonLabel.textContent = '💛 Para ti';
    giftButton.classList.add('opened');
    giftButton.setAttribute('aria-disabled', 'true');

    hint.classList.add('hidden');
  });
});
