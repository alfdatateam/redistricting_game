export interface SwiperController {
  container: HTMLElement;
  slidesContainer: HTMLElement;
  destroy(): void;
}

export function createSwiper(parent: HTMLElement, numSlides: number): SwiperController {
  let currentSlide = 0;

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  // Tab indicators
  const tabs = document.createElement('div');
  tabs.className = 'swiper-tabs';
  const tabBtns: HTMLButtonElement[] = [];
  for (let i = 0; i < numSlides; i++) {
    const btn = document.createElement('button');
    btn.className = 'swiper-tab';
    btn.textContent = `Level ${i + 1}`;
    btn.addEventListener('click', () => goTo(i));
    tabs.appendChild(btn);
    tabBtns.push(btn);
  }
  wrapper.appendChild(tabs);

  // Slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'swiper-slides';
  wrapper.appendChild(slidesContainer);

  parent.appendChild(wrapper);

  // Touch swipe handling
  let startX = 0;
  let startY = 0;
  let tracking = false;

  wrapper.addEventListener('touchstart', (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e: TouchEvent) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    // Only swipe if horizontal movement is dominant and > 50px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0 && currentSlide < numSlides - 1) {
        goTo(currentSlide + 1);
      } else if (dx > 0 && currentSlide > 0) {
        goTo(currentSlide - 1);
      }
    }
  }, { passive: true });

  function goTo(index: number): void {
    currentSlide = index;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    tabBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentSlide);
    });
  }

  goTo(0);

  return {
    container: wrapper,
    slidesContainer,
    destroy() {
      wrapper.remove();
    },
  };
}
