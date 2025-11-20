/**
 * Smooth scroll to a demo anchor with optional offset
 */
export function scrollIntoViewSmooth(
  anchor: string,
  options?: {
    offset?: number;
    block?: ScrollLogicalPosition;
    behavior?: ScrollBehavior;
  }
) {
  const element = document.querySelector(`[data-demo-anchor="${anchor}"]`);
  
  if (!element) {
    console.warn(`Demo anchor not found: ${anchor}`);
    return;
  }

  const { offset = 0, block = 'center', behavior = 'smooth' } = options || {};

  // Scroll with offset if specified
  if (offset !== 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  } else {
    element.scrollIntoView({ behavior, block });
  }

  // Add highlight effect
  element.classList.add('demo-highlight');
  setTimeout(() => {
    element.classList.remove('demo-highlight');
  }, 2000);
}

/**
 * Add spotlight effect to an element
 */
export function addSpotlight(anchor: string, duration: number = 2000) {
  const element = document.querySelector(`[data-demo-anchor="${anchor}"]`);
  
  if (!element) {
    console.warn(`Demo anchor not found for spotlight: ${anchor}`);
    return;
  }

  element.classList.add('demo-spotlight');
  setTimeout(() => {
    element.classList.remove('demo-spotlight');
  }, duration);
}

/**
 * Pulse animation for demo elements
 */
export function pulseElement(anchor: string, count: number = 3) {
  const element = document.querySelector(`[data-demo-anchor="${anchor}"]`);
  
  if (!element) {
    console.warn(`Demo anchor not found for pulse: ${anchor}`);
    return;
  }

  let pulseCount = 0;
  const interval = setInterval(() => {
    element.classList.add('demo-pulse');
    setTimeout(() => {
      element.classList.remove('demo-pulse');
    }, 500);
    
    pulseCount++;
    if (pulseCount >= count) {
      clearInterval(interval);
    }
  }, 1000);
}
