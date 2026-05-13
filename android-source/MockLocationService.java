package com.imock.pro;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;

public class MockLocationService extends Service {
    private LocationManager locationManager;
    private boolean isMocking = false;
    private Thread mockThread = null;

    @Override
    public void onCreate() {
        super.onCreate();
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        try {
            locationManager.addTestProvider(
                LocationManager.GPS_PROVIDER, false, false, false, false, true, true, true, 1, 1
            );
            locationManager.setTestProviderEnabled(LocationManager.GPS_PROVIDER, true);
        } catch (Exception e) {
            Log.e("MockLoc", "Failed to setup test provider. Needs Developer Options -> Mock Auth");
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        double lat = intent.getDoubleExtra("lat", 0.0);
        double lng = intent.getDoubleExtra("lng", 0.0);

        isMocking = true;
        if (mockThread != null) mockThread.interrupt();
        mockThread = new Thread(() -> {
            while (isMocking) {
                try {
                    Location location = new Location(LocationManager.GPS_PROVIDER);
                    location.setLatitude(lat);
                    location.setLongitude(lng);
                    location.setAccuracy(3.0f);
                    location.setTime(System.currentTimeMillis());
                    location.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());

                    locationManager.setTestProviderLocation(LocationManager.GPS_PROVIDER, location);
                    Thread.sleep(1000); // Feed location every 1 second
                } catch (InterruptedException e) {
                    break;
                } catch (Exception e) {
                    Log.e("MockLoc", "Error feeding location");
                }
            }
        });
        mockThread.start();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isMocking = false;
        if (mockThread != null) mockThread.interrupt();
        try {
            locationManager.removeTestProvider(LocationManager.GPS_PROVIDER);
        } catch (Exception e) {}
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }
}
