const AD_UNIT_ID = 'ca-app-pub-7979856440890193/9980411927';
const SHOW_EVERY_N_OPENS = 3;
const AD_DELAY_MS = 10000;

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

export async function maybeShowAdOnOpen() {
  const count = parseInt(localStorage.getItem('appOpenCount') || '0') + 1;
  localStorage.setItem('appOpenCount', String(count));

  if (count % SHOW_EVERY_N_OPENS === 0) {
    await new Promise(resolve => setTimeout(resolve, AD_DELAY_MS));
    await showInterstitialAd();
  }
}