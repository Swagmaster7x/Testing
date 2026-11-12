# Launch checklist: from this repo to Google Play

Work through these in order. Steps 1 to 4 you can do today; the 14-day closed test (step 9) is
the long pole, so start it as soon as you can.

## 0. Decide two things that can never change

- **Package name.** The store edition builds as `com.mealgym.app` unless you set another. Once
  the first upload is in Play Console the package name is permanent. Pick one you own, e.g.
  `com.yourname.mealgym` (lower case, dots, no spaces), and set it in step 4.
- **Free.** An app with ads and a "Remove ads" purchase must be published as **Free**. A free app
  can never be changed to paid.

The display name can change later. Search Play for "Meal & Gym" first; if something similar
exists, pick a different name (it goes in `store.appName` and the listing title).

## 1. Google Play developer account (personal)

1. Go to play.google.com/console/signup and choose a **personal** account. One-time fee: US$25.
2. Verify your identity with a government ID, your phone number and email.
3. New personal accounts must also show they have a real Android phone: install the
   **Play Console** app on your phone and sign in when Play Console asks.
4. In Settings > Payments profile, set up a payments profile (needed to sell "Remove ads").
   Add your tax details there too.

Your developer name is shown on the listing. When an app sells something, Google Play can also
show a contact address on the listing. Check what Play Console says while you set up the
payments profile, and use a business or mailing address if you don't want your home address
shown.

## 2. AdMob account and IDs

1. Go to admob.google.com and sign in with the same Google account. Fill in payment and tax
   details (AdMob pays monthly once your balance passes its payment threshold, US$100 in the US).
2. **Apps > Add app > Android**, answer "not published yet", name it Meal & Gym. Copy the
   **App ID** (`ca-app-pub-…~…`).
3. In that app, **Ad units > Add ad unit > Banner**, name it "Banner". Copy the **ad unit ID**
   (`ca-app-pub-…/…`).
4. **Privacy & messaging > European regulations**: create a message for this app (the default
   wording is fine), add your privacy policy URL, and **publish** it. Without a published
   message, people in the EEA, UK and Switzerland aren't asked and get few or no ads.
   Optionally also publish a **US state regulations** message.
5. Never tap your own live ads. Debug builds always use Google's test ads, so you're safe there.

## 3. Host the privacy policy

1. Open `privacy-policy.html`, replace `[Your name or business name]` and `[support email]`.
2. Put it on a public web address that isn't a PDF and doesn't need a sign-in. Two easy options:
   - **GitHub Pages:** create a new *public* repository (e.g. `mealgym-privacy`), upload the file
     as `index.html`, then Settings > Pages > Deploy from branch `main`. The address is
     `https://<your-github-name>.github.io/mealgym-privacy/`.
   - **Google Sites:** paste the text into a new site and publish it.
3. Keep the address; it goes in Play Console, AdMob and step 4.

## 4. Release key and build settings

1. Create your upload key once (keep the file and both passwords somewhere safe, e.g. a password
   manager; if you lose it, Play support can reset it, but it takes days):

       keytool -genkeypair -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

   Put `upload-keystore.jks` in the repository root. It's already in `.gitignore`.
2. Create `keystore.properties` in the repository root (also ignored by git):

       storeFile=upload-keystore.jks
       storePassword=<the keystore password>
       keyAlias=upload
       keyPassword=<the key password>

3. Add your store settings to `~/.gradle/gradle.properties` (your home folder, so they stay out of
   the repository) or to the repository's `gradle.properties`:

       store.applicationId=com.yourname.mealgym
       store.appName=Meal & Gym
       store.admobAppId=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
       store.admobBannerId=ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ
       store.privacyPolicyUrl=https://<your-github-name>.github.io/mealgym-privacy/
       store.versionCode=1
       store.versionName=1.0.0

4. Build the bundle:

       ./gradlew bundleStoreRelease

   The file to upload is `app/build/outputs/bundle/storeRelease/app-store-release.aab`.
   For every later update, raise `store.versionCode` by 1 (and `store.versionName` as you like).

The personal edition (`assemblePersonalDebug`) is untouched by all of this: same package, same
data, still no internet.

## 5. Create the app in Play Console

1. **Create app**: name, default language, **App**, **Free**, accept the declarations.
2. Leave Play App Signing on (the default). Google keeps the signing key; you keep the upload key.

## 6. App content (Policy > App content)

Use `data-safety.md` for the Data safety form and the other declarations. One needs extra work:

**Foreground service (special use).** The sauna timer runs as a foreground service so it keeps
counting with the screen off. Play asks why:

- Type: **Special use** (`FOREGROUND_SERVICE_SPECIAL_USE`)
- Description: "A countdown timer for a sauna session. The user starts it from the Sauna screen
  (10, 15, 20 minutes or a custom time). It shows an ongoing notification with the time left,
  keeps counting while the phone is locked or another app is open, alerts the user when the time
  is up, and stops when it ends or the user stops it. No data leaves the device."
- Video: record your screen (Android's screen recorder): open Sauna, start 1 minute, lock the
  phone, show the notification counting down, then the alert. Upload it to YouTube as
  **Unlisted** and paste the link.

## 7. Store listing

Main store listing: paste the text from `listing.md` and upload the files in `graphics/`
(icon, feature graphic, 8 phone screenshots).

**Restaurant names.** The "What are you craving?" pages name 12 chains so people can find the
place they're going to. That is ordinary descriptive use, and the app keeps it that way: plain
text, no logos or brand colours, a note on every page that it isn't affiliated with any
restaurant, and home recipes named for the dish ("Pickle-brined grilled chicken sandwich")
with the menu item mentioned only as what it is like. Three things to do yourself:

- Keep the names out of the store listing and screenshots (see the note at the top of
  `listing.md`).
- Read through `app/src/main/assets/restaurants.json` before launch. The calories and protein
  were gathered from published menu information in November 2026, and sources sometimes
  disagreed, so they are worded as approximate. Check any you rely on against the restaurants'
  own nutrition pages, and correct the file and its `asOf` date if a menu has changed.
- If a company ever objects (Play forwards the notice by email), remove its entry from that
  file and publish an update. Nothing else in the app depends on a particular chain. This is a
  practical note, not legal advice; ask a lawyer if you want certainty before launch.

## 8. Internal test, then the Remove ads product

1. **Testing > Internal testing**: create a release, upload the `.aab`, add yourself as a tester,
   and install from the opt-in link. Check that ads appear on Plan and Cook (real ads appear only
   after Google reviews the app; until then you may see none, which is normal).
2. Now that a build with billing is uploaded, go to **Monetize with Play > Products > One-time
   products > Create product**:
   - Product ID: `remove_ads` (exactly this; the app looks for it)
   - Name: "Remove ads"; description: "Turns off the banner ads for good."
   - Price: your choice (US$1.99 to US$3.99 is common for this). Activate it.
3. **Settings > License testing**: add your Gmail address so test purchases aren't charged.
   In the app: Settings > Remove ads, buy it, and check the banner goes away. Uninstall,
   reinstall, and use Restore purchase.

## 9. Closed test: 12 testers for 14 days (required for new personal accounts)

1. **Testing > Closed testing > Create track**, upload the same `.aab` (or a newer one).
2. Add at least **12 testers** by email list or a Google Group. Friends and family with Android
   phones are fine. Each one must open the opt-in link, accept, and install from Play.
3. They need to stay opted in for **14 days in a row**. Ask them to actually use it a few times;
   Google asks about testing and feedback when you apply.
4. Fix anything they find and upload new versions to the same track (that doesn't restart the
   clock; pausing the track might).

## 10. Apply for production and launch

1. **Dashboard > Apply for production** once Play Console shows the 14 days are done. Answer the
   questions about your test. Review usually takes a few days, sometimes longer.
2. **Production > Create release**, upload, and roll out (a staged rollout to 20% first is a
   good habit).
3. In AdMob, **App settings > Link to app store** and pick the Play listing. Optional: add a
   website to the listing and host the `app-ads.txt` line AdMob gives you at its root.

## After launch

- Every year Google raises the minimum target Android version for updates (the app targets
  API 37 today, ahead of the API 36 requirement).
- Google keeps a service fee on purchases (15% on the first US$1M a year for most developers).
- Banner ads earn little per view; income grows with daily users. The "Remove ads" purchase is
  often a meaningful share of a small app's earnings.
- Reply to Play policy emails quickly; most issues are form answers, not code.
- Menus change. Once or twice a year, check the figures in `app/src/main/assets/restaurants.json`
  against the restaurants' own nutrition pages, update `asOf`, and ship an update.

## Your personal app and Android's developer verification

Google announced that Android phones will gradually require apps to come from verified
developers, starting in Brazil, Indonesia, Singapore and Thailand in September 2026 and
worldwide in 2027. Apps from Play are covered by step 1. The personal edition is sideloaded, so
before the rule reaches your country, check developer.android.com for the free option for
personal apps, or keep installing it with `adb install`, which Google said stays allowed.
