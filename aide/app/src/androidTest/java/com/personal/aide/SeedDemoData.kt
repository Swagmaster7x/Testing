package com.personal.aide

import android.app.Application
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.PersonAgenda
import com.personal.aide.data.ProgressUpdate
import com.personal.aide.data.SelfReview
import com.personal.aide.data.WeekReview
import com.personal.aide.data.db.ChatThreadEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.ThreadKind
import com.personal.aide.data.db.UsageEntity
import com.personal.aide.domain.Days
import com.personal.aide.ui.SampleSet
import kotlinx.coroutines.runBlocking
import org.junit.Assume.assumeTrue
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Not a test: fills the debug build with a sample week so the app can be looked at with real
 * content. It replaces whatever the debug build holds, so it only runs when asked for by name:
 *
 *     adb shell am instrument -w -e seed true -e class com.personal.aide.SeedDemoData \
 *         com.personal.aide.debug.test/androidx.test.runner.AndroidJUnitRunner
 */
@RunWith(AndroidJUnit4::class)
class SeedDemoData {
    @Test
    fun seed() {
        assumeTrue(InstrumentationRegistry.getArguments().getString("seed") == "true")
        runBlocking { load() }
    }

    private suspend fun load() {
        val app: Application = ApplicationProvider.getApplicationContext()
        val container = (app as AideApp).container
        val sample = SampleSet(Days.today())
        val db = container.db

        container.backup.eraseEverything()
        container.settings.setProfile(sample.profile)
        container.settings.setOnboarded(true)

        val restore = db.restore()
        restore.meetings(sample.meetings)
        restore.segments(sample.segments)
        restore.tasks(sample.tasks)
        restore.knowledge(sample.knowledge)
        restore.questions(sample.questions)
        restore.series(sample.series)
        restore.wins(sample.wins)
        restore.threads(listOf(ChatThreadEntity(1, ThreadKind.ASK, "What did I commit to this week?", null, sample.now, sample.now)))
        restore.messages(sample.chat)
        restore.insights(
            listOf(
                InsightEntity(1, InsightKind.DAY_PLAN, sample.today, AideJson.encodeToString(DayPlan.serializer(), sample.dayPlan), sample.now),
                InsightEntity(2, InsightKind.WEEK_REVIEW, Days.weekStart(sample.today), AideJson.encodeToString(WeekReview.serializer(), sample.review), sample.now),
                InsightEntity(3, InsightKind.GOALS, 0, AideJson.encodeToString(ProgressUpdate.serializer(), sample.progress), sample.now),
                InsightEntity(4, InsightKind.SELF_REVIEW, sample.selfReview.fromDay, AideJson.encodeToString(SelfReview.serializer(), sample.selfReview), sample.now),
                // Dana's page is keyed by her knowledge entry.
                InsightEntity(5, InsightKind.PERSON_AGENDA, 1, AideJson.encodeToString(PersonAgenda.serializer(), sample.danaAgenda), sample.now),
            ),
        )
        db.usage().insert(UsageEntity(at = System.currentTimeMillis(), feature = "meeting_summary", model = "claude-opus-5-5", inputTokens = 9200, outputTokens = 1850, millis = 21_000))
        db.usage().insert(UsageEntity(at = System.currentTimeMillis(), feature = "ask", model = "claude-opus-5-5", inputTokens = 4100, outputTokens = 420, cacheReadTokens = 2800, millis = 6_000))
    }
}
