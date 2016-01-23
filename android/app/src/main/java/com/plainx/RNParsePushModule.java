package com.plainx;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import android.widget.Toast;

import android.util.Log;
import com.parse.ParseInstallation;
import java.util.Map;
import java.util.HashMap;

public class RNParsePushModule extends ReactContextBaseJavaModule {
  private final static String REGISTER = "register", NOTIFICATION = "notification";
  private Callback registerListener = null, notificationListener = null;
  private ReactContext mContext;

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
    mContext = reactContext;
  }

  @Override
  public String getName() {
    return "ParsePushAndroid";
  }

  public void invokeNotificationCallback(boolean isApplicationActive, String jsonData){
    WritableMap map = Arguments.createMap();

    map.putString("data", jsonData);
    map.putBoolean("isActive", isApplicationActive);

    sendEvent(NOTIFICATION, map);
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
    }
  }

  @ReactMethod
  public void removeEventListener(String type) {
    switch(type){
      case REGISTER:
        registerListener = null;
        Log.v("ReactNative", "Removed Parse Push register listener");
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

  private void sendEvent(String eventName, WritableMap params) {
    mContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }
}
