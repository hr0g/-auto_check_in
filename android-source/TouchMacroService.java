package com.imock.pro;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.view.accessibility.AccessibilityEvent;
import android.util.Log;

public class TouchMacroService extends AccessibilityService {

    public static TouchMacroService instance = null;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
        Log.d("MacroService", "Accessibility Service Connected on iQOO Neo 10 Pro+");
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Here we can listen to events for screen recording
    }

    @Override
    public void onInterrupt() {}

    @Override
    public boolean onUnbind(android.content.Intent intent) {
        instance = null;
        return super.onUnbind(intent);
    }

    // Called via JSBridge to dispatch tap events over other apps
    public void performTap(float x, float y, long duration) {
        Path path = new Path();
        path.moveTo(x, y);
        GestureDescription.StrokeDescription stroke = new GestureDescription.StrokeDescription(path, 0, duration);
        GestureDescription gestureInfo = new GestureDescription.Builder().addStroke(stroke).build();
        dispatchGesture(gestureInfo, null, null);
    }
}
