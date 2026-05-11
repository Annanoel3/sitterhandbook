import { useEffect } from 'react';

function isRunningInCapacitor() {
    return window.Capacitor?.isNativePlatform?.() ?? false;
}

export default function OneSignalInit({ user }) {
  useEffect(() => {
    const syncOneSignal = async () => {
      if (!user) {
        console.log('[OneSignal] No user provided to OneSignalInit');
        return;
      }

      const userEmail = user?.email;

      let externalId;
      if (userEmail && userEmail.includes('@')) {
        externalId = userEmail;
        console.log('[OneSignal] ✅ Using real email as external ID:', externalId);
      } else if (user?.id) {
        externalId = `${user.id}@sitterhandbook.com`;
        console.log('[OneSignal] ⚠️ No email found, using generated ID:', externalId);
      } else {
        console.error('[OneSignal] No email or user ID available, skipping');
        return;
      }

      if (isRunningInCapacitor()) {
        console.log('[OneSignal] Running in Capacitor mobile app');
        const NotifyBridge = window.Capacitor?.Plugins?.NotifyBridge;

        if (!NotifyBridge) {
          console.warn('[OneSignal] NotifyBridge plugin not found');
          return;
        }

        if (externalId) {
          try {
            await NotifyBridge.requestPermission();
            console.log('[OneSignal] ✅ Permission granted/already set');
          } catch (permErr) {
            console.warn('[OneSignal] requestPermission threw (may already be granted):', permErr);
          }
          await NotifyBridge.login({ externalId: externalId });
          console.log('[OneSignal] ✅ login() sent for:', externalId);
        } else {
          console.log('[OneSignal] Calling NotifyBridge.logout()');
          await NotifyBridge.logout();
        }
      } else {
        console.log('[OneSignal] Running in web browser');

        if (externalId) {
          window.OneSignal = window.OneSignal || [];
          window.OneSignal.push(function() {
            window.OneSignal.init({
              appId: "SITTERHANDBOOK_ONESIGNAL_APP_ID",
              allowLocalhostAsSecureOrigin: true
            });

            console.log('[OneSignal] ✅ Web SDK using login() with:', externalId);
            window.OneSignal.login(externalId);
          });
        } else {
          if (window.OneSignal) {
            window.OneSignal.push(function() {
              window.OneSignal.logout();
              console.log('[OneSignal] Web SDK logged out');
            });
          }
        }
      }
    };

    syncOneSignal();
  }, [user]);

  return null;
}
