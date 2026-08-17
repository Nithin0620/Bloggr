// Microsoft Clarity integration utility for React SPA

const CLARITY_PROJECT_ID = process.env.REACT_APP_CLARITY_PROJECT_ID || "y3wd2r0bwf";

/**
 * Initialize Microsoft Clarity
 * @param {string} [projectId] - Optional override for Project ID
 */
export const initClarity = (projectId = CLARITY_PROJECT_ID) => {
  if (!projectId) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "Microsoft Clarity Project ID is not configured (REACT_APP_CLARITY_PROJECT_ID)."
      );
    }
    return;
  }

  // Prevent duplicate script injection
  if (document.getElementById("ms-clarity-script")) {
    return;
  }

  // Official Microsoft Clarity snippet
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.id = "ms-clarity-script";
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
};

/**
 * Identify user in Clarity session recordings and heatmaps
 * @param {string} customId - Unique user ID
 * @param {string} [customSessionId] - Optional session ID
 * @param {string} [customPageId] - Optional page ID
 * @param {string} [friendlyName] - Optional display name
 */
export const setClarityUser = (
  customId,
  customSessionId,
  customPageId,
  friendlyName
) => {
  if (typeof window !== "undefined" && window.clarity && customId) {
    window.clarity("identify", customId, customSessionId, customPageId, friendlyName);
  }
};

/**
 * Set custom metadata tag for Clarity analytics
 * @param {string} key - Tag name
 * @param {string|string[]} value - Tag value
 */
export const setClarityTag = (key, value) => {
  if (typeof window !== "undefined" && window.clarity && key) {
    window.clarity("set", key, value);
  }
};

/**
 * Upgrade session to prioritize recording retention
 * @param {string} reason - Reason for upgrading session (e.g. 'checkout', 'error')
 */
export const upgradeClaritySession = (reason) => {
  if (typeof window !== "undefined" && window.clarity && reason) {
    window.clarity("upgrade", reason);
  }
};

/**
 * Track custom event in Clarity
 * @param {string} eventName - Custom event name
 */
export const trackClarityEvent = (eventName) => {
  if (typeof window !== "undefined" && window.clarity && eventName) {
    window.clarity("event", eventName);
  }
};
