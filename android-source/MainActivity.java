package com.imock.pro;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);

        // Inject JS bridge: window.AndroidNative
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidNative");

        webView.setWebViewClient(new WebViewClient());
        // Load the local dashboard UI or hosted URL
        // webView.loadUrl("file:///android_asset/public/index.html");
        webView.loadUrl("http://10.0.2.2:3000/"); // For emulator dev
    }

    // --- JSBridge Implementation ---
    class WebAppInterface {

        @JavascriptInterface
        public void startMockLocation(double lat, double lng) {
            Intent intent = new Intent(MainActivity.this, MockLocationService.class);
            intent.putExtra("lat", lat);
            intent.putExtra("lng", lng);
            startService(intent);
        }

        @JavascriptInterface
        public void stopMockLocation() {
            Intent intent = new Intent(MainActivity.this, MockLocationService.class);
            stopService(intent);
        }

        @JavascriptInterface
        public void executeMacro(String macroDataJson) {
            // Trigger accessibility to click
            if(TouchMacroService.instance != null) {
                // Dummy tap x=500 y=1000 for demonstration
                TouchMacroService.instance.performTap(500f, 1000f, 100);
            }
        }
        
        @JavascriptInterface
        public void showFloatingWindow() {
            // Native code to trigger standard Android SYSTEM_ALERT_WINDOW
        }
    }
}
