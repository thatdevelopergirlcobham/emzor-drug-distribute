'use client';

import { useEffect } from 'react';

/**
 * Suppresses hydration warnings from browser extensions like Grammarly
 * This component removes problematic data attributes that cause hydration mismatches
 */
export default function GrammarlyWarningSuppressor() {
  // Only run in development mode to suppress warnings
  const shouldSuppress = process.env.NEXT_PUBLIC_SUPPRESS_GRAMMARLY_WARNINGS === 'true';

  useEffect(() => {
    // Only run if suppression is enabled
    if (!shouldSuppress) return;

    const removeExtensionAttributes = () => {
      const html = document.documentElement;
      const body = document.body;

      // Remove Grammarly-specific attributes
      const grammarlyAttributes = [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-gramm_editor',
        'data-gramm_id'
      ];

      // Remove attributes from both html and body elements
      [html, body].forEach(element => {
        if (element) {
          grammarlyAttributes.forEach(attr => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
            }
          });
        }
      });

      // Also check for other common browser extension attributes
      const commonAttributes = [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-gramm_editor',
        'data-gramm_id',
        'data-lt-installed',
        'data-lt-ext-installed'
      ];

      commonAttributes.forEach(attr => {
        if (body && body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    };

    // Run immediately to catch attributes before hydration
    removeExtensionAttributes();

    // Use MutationObserver to watch for dynamically added attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          // Check if the added attribute is from a browser extension
          const extensionAttributes = [
            'data-new-gr-c-s-check-loaded',
            'data-gr-ext-installed',
            'data-gramm_editor',
            'data-gramm_id',
            'data-lt-installed',
            'data-lt-ext-installed'
          ];

          if (extensionAttributes.includes(mutation.attributeName) && mutation.target instanceof Element) {
            mutation.target.removeAttribute(mutation.attributeName);
          }
        }
      });
    });

    // Start observing both html and body elements
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-gramm_editor',
        'data-gramm_id',
        'data-lt-installed',
        'data-lt-ext-installed'
      ]
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-gramm_editor',
        'data-gramm_id',
        'data-lt-installed',
        'data-lt-ext-installed'
      ]
    });

    // Also run periodically to catch any missed attributes
    const intervalId = setInterval(removeExtensionAttributes, 2000);

    // Cleanup function
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [shouldSuppress]);

  return null; // This component doesn't render anything
}
