package com.plainx;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.widget.Toast;

import android.util.Log;
import com.parse.ParseInstallation;
import java.util.Map;
import java.util.HashMap;

public class RNParsePushModule extends ReactContextBaseJavaModule {

  private final static String REGISTER = "register", NOTIFICATION = "notification";
  private Callback registerListener = null, notificationListener = null;

  private static RNParsePushModule instance = null;

  public static RNParsePushModule createInstance(ReactApplicationContext reactContext) {
    instance = new RNParsePushModule(reactContext);
    return instance;
  }

  public static RNParsePushModule getInstance(){
    return instance;
  }

  private RNParsePushModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "ParsePushAndroid";
  }

  public void invokeNotificationCallback(boolean isApplicationActive, String jsonData){
    if (notificationListener!= null) {
      Log.v("ReactNative", "invoke Notification Callback");
      // Invariant Violation: Callback with id 9: ParsePushAndroid.addEventListener() not found
      notificationListener.invoke(isApplicationActive, jsonData);
    }
  }

  @ReactMethod
  public void addEventListener(String type, Callback callback) {
    switch(type){
      case REGISTER:
        registerListener = callback;
        Log.v("ReactNative", "Added Parse Push register listener");

        //Can immediately send Device Token to callback
        String deviceToken = ParseInstallation.getCurrentInstallation().getString("deviceToken");
        if (deviceToken!=null) {
          registerListener.invoke(deviceToken);
        }
        break;
      case NOTIFICATION:
        notificationListener = callback;
        Log.v("ReactNative", "Added Parse Push notification listener");
        break;
    }
  }

  @ReactMethod
  public void removeEventListener(String type) {
    switch(type){
      case REGISTER:
        registerListener = null;
        Log.v("ReactNative", "Removed Parse Push register listener");
        break;
      case NOTIFICATION:
        notificationListener = null;
        Log.v("ReactNative", "Removed Parse Push notification listener");
        break;
    }
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("ACTIVE", true);
    constants.put("INACTIVE", false);
    constants.put("REGISTER", REGISTER);
    constants.put("NOTIFICATION", NOTIFICATION);

    return constants;
  }
}
