# Setting plainX-turkey

1. Run `git clone https://github.com/jihopark/plainX-turkey.git`
2. Run `git clone https://github.com/jihopark/react-native.git#plainX` on the parent directory same directory as above. This is to use our own react-native module
3. Run `npm install` on `/plainX-turkey`

# Deploying plainX-turkey on iOS

1. Merge code to `production` branch.
2. Comment out `jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];` and Uncomment `jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];` in `AppDelegate.m` to use preload bundle.
3. Open your project in Xcode and select `Product → Scheme → Edit Scheme... (or press ⌘ + <)`. Next, select Run from the menu on the left and change the `Build Configuration` to `Release`.
3. Run `react-native bundle --platform ios --dev false --entry-file index.ios.js --bundle-output iOS/main.jsbundle`
4. Change `Build Target` to `Generic iOS Device` and `Product < Archive`
5. Submit! (probably after many many release candidates. shit always happens on the submission day)

# Deploying plainX-turkey on Android
https://facebook.github.io/react-native/docs/signed-apk-android.html#content
1. Merge code to `production` branch
2. Check release keystore.
3. `cd android && ./gradlew assembleRelease`
4. Find APK at `android/app/build/outputs/apk/app-release.apk`
