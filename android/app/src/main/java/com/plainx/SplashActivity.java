package com.plainx;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;

public class SplashActivity extends AppCompatActivity {
    private final int SPLASH_DISPLAY_LENGTH = 500;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
              goToMainActivity();
            }
        }, SPLASH_DISPLAY_LENGTH);
    }

  private void goToMainActivity(){
    Intent intent = new Intent(SplashActivity.this, MainActivity.class);
    startActivity(intent);
    finish();
  }
}
