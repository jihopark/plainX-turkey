package com.plainx;

import android.app.Application;
import android.util.Log;
import android.app.Activity;
import android.os.Bundle;

import com.parse.Parse;
import com.parse.ParseInstallation;

/**
 * Created by parkjiho on 11/1/15.
 */
public class PlainApplication extends Application {
    private final String TAG = "PlainApplication";
    private final MyActivityLifecycleCallbacks mCallbacks = new MyActivityLifecycleCallbacks();
    private static boolean isActive = true;

    @Override
    public void onCreate() {
        super.onCreate();
        initializeParse();
        registerActivityLifecycleCallbacks(mCallbacks);
    }
    @Override
    public void onTerminate() {
      super.onTerminate();
      unregisterActivityLifecycleCallbacks(mCallbacks);
    }

    public static boolean isActive(){
      return isActive;
    }

    private void initializeParse() {
        Log.d(TAG,"Initializing Parse");
        Parse.initialize(this, "AbGNATEXLxsdDAPalV5Qlh8uncqdzo44Gm8som0S", "iKyk3OAQZuuAIN5n8Bj0h8UT4e43vxztR516tFpN");
        ParseInstallation.getCurrentInstallation().saveInBackground();
    }

    public static class MyActivityLifecycleCallbacks implements ActivityLifecycleCallbacks {
       @Override
       public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
         Log.v("PushLog","onActivityCreated");
       }

       @Override
       public void onActivityStarted(Activity activity) {
         Log.v("PushLog","onActivityStarted");
       }

       @Override
       public void onActivityResumed(Activity activity) {
         Log.v("PushLog","onActivityResumed");
         isActive = true;
       }

       @Override
       public void onActivityPaused(Activity activity) {
         Log.v("PushLog","onActivityPaused");
         isActive = false;
       }

       @Override
       public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
         Log.v("PushLog","onActivitySaveInstanceState");
       }

       @Override
       public void onActivityStopped(Activity activity) {
         Log.v("PushLog","onActivityStopped");

       }

       @Override
       public void onActivityDestroyed(Activity activity) {
         Log.v("PushLog","onActivityDestroyed");
       }
    }
}
