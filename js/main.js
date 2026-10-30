// ==========================================================================
// INTERATIVIDADE, SCROLL SUAVE E CONTROLADORES HORIZONTAIS BIDIRECIONAIS
// Site Pessoal de João - Design System Asagiri 38matcha
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nlinks a[href^="#"]');
  const sections = document.querySelectorAll('section[id], header[id]');
  const menuToggle = document.getElementById('menuToggle');
  const nlinks = document.getElementById('nlinks');

  // 1. Navbar Docking ao rolar a página
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('docked');
    } else {
      navbar.classList.remove('docked');
    }

    // Highlight da Seção Ativa
    let currentId = '';
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Menu Mobile Toggle
  if (menuToggle && nlinks) {
    menuToggle.addEventListener('click', () => {
      nlinks.classList.toggle('open');
      const isOpen = nlinks.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nlinks.classList.remove('open');
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.textContent = '☰';
        }
      });
    });
  }

  // 3. Suavização de Scroll para links âncora
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 4. GSAP & ScrollTrigger: Scroll Lateral Bidirecional
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  if (window.gsap && window.ScrollTrigger && !isReduced && !isMobile) {
    gsap.registerPlugin(ScrollTrigger);

    // ========================================================================
    // TÓPICO 2 — INTERESSES (Scroll Lateral para a Direita ao rolar para baixo)
    // Inicialmente os cards estão deslocados para a esquerda (-dist) e
    // com o scroll vertical eles avançam para a direita (x: 0).
    // ========================================================================
    const sectionInteresses = document.getElementById('interesses');
    const trackInteresses = document.getElementById('trackInteresses');
    const wrapInteresses = document.getElementById('wrapInteresses');

    if (sectionInteresses && trackInteresses && wrapInteresses) {
      const getDistanceInteresses = () => {
        return Math.max(0, trackInteresses.scrollWidth - wrapInteresses.clientWidth);
      };

      const distI = getDistanceInteresses();

      if (distI > 0) {
        // Timeline fixada que converte scroll para baixo em movimento para a direita
        gsap.fromTo(trackInteresses, 
          { x: -distI },
          {
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionInteresses,
              start: 'top top',
              end: () => '+=' + (getDistanceInteresses() * 1.2),
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          }
        );
      }
    }

    // ========================================================================
    // TÓPICO 3 — MINHA MENTALIDADE (Scroll Lateral para a Esquerda ao rolar para baixo)
    // Movimento no SENTIDO CONTRÁRIO da seção anterior:
    // Começa em x: 0 e desloca-se para a esquerda (x: -dist) à medida que rola para baixo.
    // ========================================================================
    const sectionMentalidade = document.getElementById('mentalidade');
    const trackMentalidade = document.getElementById('trackMentalidade');
    const wrapMentalidade = document.getElementById('wrapMentalidade');

    if (sectionMentalidade && trackMentalidade && wrapMentalidade) {
      const getDistanceMentalidade = () => {
        return Math.max(0, trackMentalidade.scrollWidth - wrapMentalidade.clientWidth);
      };

      const distM = getDistanceMentalidade();

      if (distM > 0) {
        gsap.fromTo(trackMentalidade,
          { x: 0 },
          {
            x: () => -getDistanceMentalidade(),
            ease: 'none',
            scrollTrigger: {
              trigger: sectionMentalidade,
              start: 'top top',
              end: () => '+=' + (getDistanceMentalidade() * 1.2),
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          }
        );
      }
    }

    // Atualização de medidas ao redimensionar a janela
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
  }
});
