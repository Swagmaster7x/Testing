# Aide

A personal work assistant for Android. It sits in on your meetings, transcribes them live, writes up the notes, and keeps everything that comes out of them: the to-do list by day and by week, a knowledge base about your work, and an honest read on how you are doing.

This is a separate app from Yoked (the project at the root of this repository). It has its own Gradle project in this folder and shares nothing with it.

Kotlin, Jetpack Compose, Material 3, Room, DataStore, the official Anthropic SDK. Minimum Android 8 (API 26); live transcription is at its best on Android 13 and later.

## What it does

- **Live transcription.** Tap Record and put the phone on the table. Words appear as people speak, using the phone's own speech recognizer (the one behind voice typing), on the device where the phone supports that. No audio is ever saved. You can pause, type a note ("Dana owns the rate feed"), or flag a moment as important; notes are trusted over what was heard. Recording carries on with the screen locked, behind a notification with Pause and Stop.
- **Meeting notes.** When a recording stops, Claude writes a short summary, key points, decisions, open questions, risks, and the action items: who took what on, by when. A follow-up email is one tap away. A transcript from Zoom, Teams or Meet, or your own notes, can be pasted in or shared to the app and gets the same treatment.
- **To-dos by day and by week.** Action items become tasks. Yours go on Today and Week; other people's go under Waiting so you can chase them; ones where the transcript didn't settle the owner wait for one tap from you. "Plan my day" and "Plan my week" have Claude pick and order what matters, with reasons. Tasks can also be added by hand.
- **Knowledge base.** After each meeting Aide saves what is worth keeping: who people are and what they own, what a project is and where it stands, what an acronym means, what was decided and why. It reads the relevant entries before every meeting and every answer, and updates an entry instead of duplicating it. Everything is searchable and editable.
- **Onboarding that builds the dataset.** First run asks for your role, company, industry and department, then Claude interviews you about your work: responsibilities, projects, the people you deal with, your regular meetings, vocabulary, how you are judged. For your first five meetings it also asks follow-up questions about names and terms it couldn't place; each answer goes into the knowledge base.
- **Performance overview (Insights).** The week in numbers, counted from your own data: tasks completed, share done on time, what is overdue, what you are waiting on, time in meetings. On top of that Claude writes a weekly review: what went well, what slipped, patterns, what to try next week, and a status update ready to send to your manager. The same screen shows how Aide itself is doing: how many of its notes you rated right, how many of the tasks it spotted you kept, and roughly what it has cost.
- **Ask Aide.** A chat that answers from your meetings, tasks and knowledge base: "What did I commit to this week?", "Prep me for my 2:00 with Dana", "Draft a status update".
- **Around the edges.** Read-only calendar connection (names recordings after the meeting you are in, shows the day, one-tap prep), an optional morning brief notification, backup and restore to a file, light and dark themes.

## What you need

**A Claude API key.** Transcription and manual tasks work without one, but notes, plans, reviews and answers are written by Claude through the Anthropic API, with your own key from the [Claude Console](https://console.anthropic.com/settings/keys). This is billed per use to that account and is separate from a Claude subscription (Pro or Max); a subscription cannot be used by an app. A typical meeting costs a few cents to write up with the default model. The key is encrypted with the phone's hardware-backed keystore and can be changed or removed in Settings.

**A phone with speech recognition.** Nearly every Android phone has one (Google's "Speech Recognition & Synthesis"). In Settings you can choose the meeting language and whether recognition must stay on the device.

## Install

Build the APK (below) or take `aide.apk` from wherever this build was shared, copy it to the phone, and open it. Android will ask you to allow installing from that source the first time. Later builds install over earlier ones and keep your data, because every build is signed with the same key.

## Privacy

Everything Aide stores is on the phone, in the app's private storage, and is excluded from cloud backups. Speech is turned into text as it is heard and the audio is discarded. When Claude is asked for notes, a plan or an answer, the transcript and the relevant tasks and knowledge entries are sent to the Anthropic API with your key, and nowhere else. There is no account, no server of ours, no analytics.

Tell people when you are transcribing a meeting. In many places the law requires everyone's consent, and many employers have their own rules about recording and about sending work conversations to an outside service.

## What to expect from transcription

The phone's recognizer hears one microphone and does not know who is speaking, so transcripts have no speaker labels, and names and jargon are sometimes misheard. Aide is built around that: Claude is told how the transcript was made, repairs mis-hearings from the knowledge base, and marks a task's owner as unclear instead of guessing. Typed notes and the answers you give to Aide's questions make the biggest difference to accuracy. A phone close to the speakers in a quiet room does much better than one across a table in a noisy one.

## Build

```
./gradlew assembleRelease        # app/build/outputs/apk/release/app-release.apk
```

Needs JDK 17 or later and the Android SDK (platform 37); `local.properties` should point at the SDK (`sdk.dir=...`). The release build is not minified: the Claude SDK relies on reflection, and a larger, predictable APK was preferred to a smaller one that cannot be exercised on a phone from here.

`app/signing/aide.keystore` is a fixed signing key kept in the repository so that a build from any machine installs over the last one. It is fine for a personal, sideloaded app; replace it before distributing the app to anyone else.

## Tests

```
./gradlew testDebugUnitTest          # logic, database, the Claude client against a local stand-in, transcription
./gradlew recordRoborazziDebug       # renders every screen to app/build/outputs/roborazzi
./gradlew connectedDebugAndroidTest  # on a phone or emulator: the SDK on Android, the keystore, the recording service
```

## How it is put together

| Package | What is in it |
|---|---|
| `ai` | `AnthropicLlm` (the Claude client: streaming, structured outputs, refusal fallbacks), `Prompts`, `Schemas` (the JSON shapes Claude replies in), `ContextBlocks` (what is sent with each request), `Assistant` (one function per job), `MeetingProcessor` |
| `transcribe` | `AndroidSpeechTranscriber` (keeps the recognizer going for a whole meeting), `Recorder`, `RecordingService` |
| `data` | Room database, settings and work profile (DataStore), the encrypted key store, backup |
| `domain` | Pure logic: the task board, the performance numbers, keyword retrieval, dates, export |
| `calendar`, `notify` | Read-only calendar access; notifications and the morning brief |
| `ui` | One folder per screen |

The model defaults to Claude Opus 5.5 and can be switched to Sonnet 5.5 or Haiku 5.5 in Settings. Claude is never given tools: each request carries the context that code selected for it (retrieval runs on the phone), so a request can only ever read what it was sent.
