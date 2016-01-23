package com.plainx;

import android.content.Context;
import android.content.Intent;
import android.app.Activity;

import com.parse.ParsePushBroadcastReceiver;
import android.util.Log;

public class RNParsePushBroadcastReceiver extends ParsePushBroadcastReceiver{

  @Override
  protected void onPushReceive(Context context, Intent intent) {
    boolean isApplicationActive = isApplicationActive(context);
    Log.v("PushLog","onPushReceive " + isApplicationActive);
    if (isApplicationActive){
      RNParsePushModule.getInstance().invokeNotificationCallback(isApplicationActive, intent.getStringExtra(KEY_PUSH_DATA));
    }
    else
      super.onPushReceive(context, intent);
  }

  @Override
  protected void onPushOpen(Context context, Intent intent) {
    Log.v("PushLog","onPushOpen");

    Class<? extends Activity> cls = getActivity(context, intent);

    Intent i = new Intent(context, cls);
    i.putExtras(intent.getExtras());
    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(i);

    RNParsePushModule.getInstance().invokeNotificationCallback(false, intent.getStringExtra(KEY_PUSH_DATA));
  }

  private boolean isApplicationActive(Context context){
    if (context.getApplicationContext() instanceof PlainApplication) {
      return ((PlainApplication) context.getApplicationContext()).isActive();
    }
    return false;
  }

}
