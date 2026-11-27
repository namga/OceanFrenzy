package com.yumy.ocean;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

import java.util.concurrent.atomic.AtomicBoolean;

public class MainActivity extends BridgeActivity {
    private final AtomicBoolean webContentReady = new AtomicBoolean(false);
    private long splashStartedAt;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        splashStartedAt = SystemClock.uptimeMillis();
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        splashScreen.setKeepOnScreenCondition(() ->
            !webContentReady.get() || SystemClock.uptimeMillis() - splashStartedAt < 1000
        );

        super.onCreate(savedInstanceState);

        if (getBridge() == null) {
            webContentReady.set(true);
            return;
        }

        WebView webView = getBridge().getWebView();
        webView.addJavascriptInterface(new AppExitBridge(), "AndroidApp");
        if (webView.getProgress() >= 100 && webView.getContentHeight() > 0) {
            webContentReady.set(true);
        } else {
            getBridge().addWebViewListener(new WebViewListener() {
                @Override
                public void onPageLoaded(WebView webView) {
                    webContentReady.set(true);
                }

                @Override
                public void onReceivedError(WebView webView) {
                    webContentReady.set(true);
                }
            });
        }

        new Handler(Looper.getMainLooper()).postDelayed(() -> webContentReady.set(true), 8000);
    }

    private final class AppExitBridge {
        @SuppressWarnings("unused")
        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(MainActivity.this::finish);
        }
    }
}
