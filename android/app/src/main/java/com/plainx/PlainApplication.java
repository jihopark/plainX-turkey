package com.plainx;

import android.app.Application;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseInstallation;

/**
 * Created by parkjiho on 11/1/15.
 */
public class PlainApplication extends Application {
    private final String TAG = "PlainApplication";
    @Override
    public void onCreate() {
        super.onCreate();
        initializeParse();
    }

    private void initializeParse() {
        Log.d(TAG,"Initializing Parse");
        Parse.initialize(this, "AbGNATEXLxsdDAPalV5Qlh8uncqdzo44Gm8som0S", "iKyk3OAQZuuAIN5n8Bj0h8UT4e43vxztR516tFpN");
        ParseInstallation.getCurrentInstallation().saveInBackground();
    }
}
