const AD_UNIT_ID = 'ca-app-pub-7979856440890193/9980411927';
const SHOW_EVERY_N_OPENS = 4;
const AD_DELAY_MS = 15000;

let AdMob = null;
let isNative = false;

async function loadCapacitor() {
  try {
    const { Capacitor, registerPlugin } = await import('@capacitor/core');
    isNative = Capacitor.isNativePlatform();
    if (isNative) {
      AdMob = registerPlugin('AdMob');
    }
  } catch {
    // Not a native environment, ignore
  }
}

export async function initAdMob() {
  await loadCapacitor();
  if (!isNative || !AdMob) return;
  try {
    await AdMob.initialize({ initializeForTesting: false });
    console.log('[AdMob] initialized');
  } catch (e) {
    console.warn('[AdMob] init failed:', e);
    AdMob = null;
  }
}

export async function showInterstitialAd() {
  if (!AdMob) return false;
  try {
    await AdMob.prepareInterstitial({ adId: AD_UNIT_ID, isTesting: false });
    await AdMob.showInterstitial();
    return true;
  } catch (e) {
    console.warn('[AdMob] interstitial failed:', e);
    return false;
  }
}

function isUserTyping() {
  const activeElement = document.activeElement;
  return activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.contentEditable === 'true'
  );
}

export async function maybeShowAdOnOpen() {
  const count = parseInt(localStorage.getItem('appOpenCount') || '0') + 1;
  localStorage.setItem('appOpenCount', String(count));

  if (count % SHOW_EVERY_N_OPENS === 0) {
    await new Promise(resolve => setTimeout(resolve, AD_DELAY_MS));
    
    // Check if user is typing; if so, wait for them to finish
    while (isUserTyping()) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    await showInterstitialAd();
  }
}