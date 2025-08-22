/**
 * Component loader utility for loading HTML components
 */

const BASE_URL = window.location.origin + (window.location.pathname.includes('/api/preview-') ? '/api/preview-68a6108a466f555588860a0f/' : '/');

export async function loadComponent(selector, componentPath) {
  try {
    const container = document.querySelector(selector);
    if (!container) {
      console.warn(`Container not found: ${selector}`);
      return;}

    // Get component path from data-source attribute if not provided
    const sourcePath = componentPath || container.getAttribute('data-source');
    if (!sourcePath) {
      console.warn(`No component path specified for: ${selector}`);
      return;
    }

    const response = await fetch(`${BASE_URL}${sourcePath}`);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    // Execute any scripts in the loaded component
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // External script
        const newScript = document.createElement('script');
        newScript.src = script.src;
        if (script.type) newScript.type = script.type;
        document.head.appendChild(newScript);
      } else if (script.textContent) {
        // Inline script
        const newScript = document.createElement('script');
        if (script.type) newScript.type = script.type;
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
      }
    });

  } catch (error) {
    console.error('Error loading component:', error);
    // Show fallback content or error message
    if (container) {
      container.innerHTML = `<div class="text-red-500 text-sm p-4">Failed to load component: ${selector}</div>`;
    }
  }
}

/**
 * Load all components with data-source attributes
 */
export async function loadAllComponents() {
  const containers = document.querySelectorAll('[data-source]');
  const promises = Array.from(containers).map(container => {
    return loadComponent(`#${container.id}` || container.tagName);
  });
  
  try {
    await Promise.all(promises);
    // Re-initialize icons after all components are loaded
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all elements are rendered
  setTimeout(loadAllComponents, 100);
});