# Data safety form answers (store edition)

Play Console > Policy > App content > Data safety. These answers describe the store edition as
built: no account, no server, everything you type stays on the phone, and the only third-party
SDKs that send data are the Google Mobile Ads SDK (with Google's consent SDK) and Google Play
Billing.

**You are responsible for this form.** Before submitting, compare the ads rows with Google's own
page, "Google Play's data disclosure requirements" for the Google Mobile Ads SDK
(developers.google.com/admob/android/privacy/play-data-disclosure). Google updates it when the
SDK changes. It couldn't be fetched from the build environment, so the rows below follow what
Google has published for its ads SDKs.

## Overview questions

| Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** (through the ads SDK) |
| Is all of the user data collected by your app encrypted in transit? | **Yes** |
| Do you provide a way for users to request that their data is deleted? | **No** (there is no account or server; what the app stores is deleted with the app. People can reset or delete their advertising ID in Android settings.) |

## Data types

Mark each of these as **Collected** and **Shared**, **processed ephemerally: No**,
**required** (people can't turn it off in the app, though consent and Remove ads limit it).

| Category > data type | Purposes |
| --- | --- |
| Location > Approximate location (estimated from IP address) | Advertising or marketing; Analytics; Fraud prevention, security and compliance |
| App activity > App interactions (ad views and taps) | Advertising or marketing; Analytics; Fraud prevention, security and compliance |
| App info and performance > Diagnostics | Analytics; Fraud prevention, security and compliance |
| App info and performance > Crash logs | Analytics; Fraud prevention, security and compliance |
| Device or other IDs (advertising ID, app set ID) | Advertising or marketing; Analytics; Fraud prevention, security and compliance |

## Not collected

Leave every other type unticked. In particular, the app does **not** collect:

- Personal info (names typed for each person stay on the phone)
- Health and fitness (meal plans, workouts, sets, sauna times and the optional setup answers
  such as goal, sex, age, height, weight and allergies stay on the phone)

Google's form counts data as "collected" only when it is sent off the device. The setup
answers are processed on the phone and never transmitted, so they are not collected or shared.
If a later version ever syncs or uploads them, this form must change first.
- Financial info or purchase history (Google Play handles payment; the app only asks Play whether
  "Remove ads" was bought, and that answer stays on the phone)
- Messages, photos, files, contacts, calendar, web browsing

Backups, meal-plan files and shared shopping lists only leave the phone when the person chooses
to export or share them. Google treats user-initiated sharing like that as not "collected".

## Related declarations on the App content page

| Section | Answer |
| --- | --- |
| Ads | **Yes, my app contains ads** |
| Privacy policy | Your hosted `privacy-policy.html` URL |
| App access | **All functionality is available without special access** |
| Target audience and content | **18 and over** only. Including younger ages brings in the Families policy and its ad rules. |
| Content rating | Fill in the questionnaire honestly: no violence, no user-to-user interaction or sharing between users, no location sharing, digital purchases **yes**. Expect the lowest rating (Everyone / PEGI 3). |
| Health apps | Tick **Activity and fitness** and **Nutrition and weight management** (the app estimates a calorie and protein guide from height, weight, age and activity). No Health Connect access. Not a medical device: it gives no diagnosis or treatment, and says so in setup and in Settings. |
| Foreground service permissions | `FOREGROUND_SERVICE_SPECIAL_USE`: see the launch checklist, step 6 |
| Financial features, Government apps, News apps | **No** / not applicable |
| Data deletion | No account, so no account-deletion link is needed |
