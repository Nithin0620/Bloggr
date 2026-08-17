// Google Analytics (GA4) integration utility

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics (gtag.js)
 * @param {string} [measurementId] - Optional override for Measurement ID
 */
export const initGA = (measurementId = GA_MEASUREMENT_ID) => {
  if (!measurementId) {
    if (process.env.NODE_ENV === "development") {
      console.info("Google Analytics Measurement ID is not configured (REACT_APP_GA_MEASUREMENT_ID).");
    }
    return;
  }

  // Prevent duplicate script injection
  if (document.getElementById("google-analytics-script")) {
    return;
  }

  // Inject gtag.js script
  const script = document.createElement("script");
  script.id = "google-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: false, // Page views handled manually for SPA route changes
  });
};

/**
 * Track SPA page views
 * @param {string} path - URL path (e.g. /explore, /profile/123)
 * @param {string} [title] - Page title
 */
export const trackPageView = (path, title = document.title) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    });
  }
};

/**
 * Track custom events
 * @param {string} action - Event action name (e.g. 'post_liked', 'comment_added')
 * @param {object} [params] - Additional parameters
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", action, params);
  }
};

/**
 * Set user identity for GA4
 * @param {string|null} userId - Unique user identifier
 */
export const setGAUser = (userId) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    if (userId) {
      window.gtag("set", { user_id: userId });
    }
  }
};
