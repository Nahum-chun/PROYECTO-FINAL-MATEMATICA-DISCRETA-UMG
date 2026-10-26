
'use strict';

// Navegación móvil
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mainNav.classList.toggle('open', !expanded);
});

mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Módulo demostrativo de operaciones con conjuntos.
// Esta versión acepta exclusivamente números finitos.

function leerConjunto(id) {
  const texto = document.getElementById(id).value.trim();

  if (!texto) return new Set();

  const valores = texto.split(',').map(x => x.trim());

  if (valores.some(x => x === '' || !/^-?(?:\d+\.?\d*|\.\d+)$/.test(x))) {
    throw new Error('Ingresa únicamente números separados por comas, sin elementos vacíos.');
  }

  return new Set(valores.map(Number));
}

function mostrarConjunto(s) {
  return '{' + [...s].sort((a, b) => a - b).join(', ') + '}';
}

function calcular() {
  const salida = document.getElementById('resultText');
  const cantidad = document.getElementById('resultCount');

  try {
    const A = leerConjunto('setA');
    const B = leerConjunto('setB');
    const U = leerConjunto('setU');

    const operacion = document.getElementById('operation').value;
    let resultado;

    if (operacion === 'union') {
      resultado = new Set([...A, ...B]);

    } else if (operacion === 'intersection') {
      resultado = new Set([...A].filter(x => B.has(x)));

    } else if (operacion === 'difference') {
      resultado = new Set([...A].filter(x => !B.has(x)));

    } else if (operacion === 'complement') {
      if ([...A].some(x => !U.has(x))) {
        throw new Error('El conjunto A debe estar contenido en el universo U.');
      }

      resultado = new Set([...U].filter(x => !A.has(x)));

    } else if (operacion === 'cartesian') {
      const pares = [...A].flatMap(a =>
        [...B].map(b => `(${a}, ${b})`)
      );

      salida.textContent = '{' + pares.join(', ') + '}';
      cantidad.textContent = `${pares.length} pares ordenados`;
      return;
    }

    salida.textContent = mostrarConjunto(resultado);
    cantidad.textContent = `${resultado.size} elemento(s)`;

  } catch (error) {
    salida.textContent = error.message;
    cantidad.textContent = 'Revisa los datos ingresados.';
  }
}

document.getElementById('calculateBtn').addEventListener('click', calcular);
