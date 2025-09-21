'use client';

import { useEffect } from 'react';

/**
 * Suppresses hydration warnings from browser extensions like Grammarly
 * This component removes problematic data attributes that cause hydration mismatches
 */
export default function GrammarlyWarningSuppressor() {
  useEffect(() => {
    // Run in both development and production to catch extension attributes
    if (typeof window !== 'undefined') {
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

      // Run immediately
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
              'data-lt-installed'
            ];

            if (extensionAttributes.includes(mutation.attributeName)) {
              mutation.target.removeAttribute(mutation.attributeName);
            }
          }
        });
      });

      // Start observing
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: [
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed',
          'data-gramm_editor',
          'data-gramm_id',
          'data-lt-installed'
        ]
      });

      // Also run periodically to catch any missed attributes
      const intervalId = setInterval(removeExtensionAttributes, 2000);

      return () => {
        observer.disconnect();
        clearInterval(intervalId);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
