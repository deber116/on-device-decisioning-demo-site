const PENDO_API_KEY = '74924fb4-e18c-42b1-664b-47ed918c3a45';
const VISITOR_STORAGE_KEY = 'pendo_visitor_id';
const ACCOUNT_ID = 'a-shop-demo';
const ACCOUNT_NAME = 'A Shop';

/**
 * Returns a stable visitor id for local demos with no login.
 * Persists in localStorage so the same browser can be found when tagging.
 */
function getOrCreateVisitorId() {
  try {
    let visitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!visitorId) {
      visitorId = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? `visitor-${window.crypto.randomUUID()}`
        : `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    }
    return visitorId;
  } catch (err) {
    return 'visitor-anonymous';
  }
}

/**
 * Initializes the Pendo agent with demo visitor/account metadata.
 * The HTML snippet also calls initialize; this re-applies identity after the
 * client bundle boots so SPA-style boots keep a stable visitor/account.
 */
export function initializePendo() {
  if (typeof window === 'undefined' || !window.pendo || typeof window.pendo.initialize !== 'function') {
    return;
  }

  window.pendo.initialize({
    apiKey: PENDO_API_KEY,
    visitor: {
      id: getOrCreateVisitorId(),
      role: 'Product Manager'
    },
    account: {
      id: ACCOUNT_ID,
      name: ACCOUNT_NAME
    }
  });
}
