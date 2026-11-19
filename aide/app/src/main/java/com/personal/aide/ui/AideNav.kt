package com.personal.aide.ui

import android.Manifest
import android.net.Uri
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.LifecycleResumeEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.personal.aide.BuildConfig
import com.personal.aide.ai.IntakeState
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.domain.Days
import com.personal.aide.domain.meetingNotesText
import com.personal.aide.notify.Notifications
import com.personal.aide.ui.ask.AskActions
import com.personal.aide.ui.ask.AskScreen
import com.personal.aide.ui.ask.AskViewModel
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.insights.InsightsActions
import com.personal.aide.ui.insights.InsightsScreen
import com.personal.aide.ui.insights.InsightsViewModel
import com.personal.aide.ui.interview.InterviewScreen
import com.personal.aide.ui.interview.InterviewViewModel
import com.personal.aide.ui.knowledge.EntryScreen
import com.personal.aide.ui.knowledge.EntryViewModel
import com.personal.aide.ui.knowledge.KnowledgeScreen
import com.personal.aide.ui.knowledge.KnowledgeViewModel
import com.personal.aide.ui.knowledge.ProfileScreen
import com.personal.aide.ui.knowledge.QuestionsScreen
import com.personal.aide.ui.knowledge.QuestionsViewModel
import com.personal.aide.ui.meetings.AddActions
import com.personal.aide.ui.meetings.AddKind
import com.personal.aide.ui.meetings.AddScreen
import com.personal.aide.ui.meetings.AddViewModel
import com.personal.aide.ui.meetings.MeetingActions
import com.personal.aide.ui.meetings.MeetingScreen
import com.personal.aide.ui.meetings.MeetingViewModel
import com.personal.aide.ui.meetings.MeetingsScreen
import com.personal.aide.ui.meetings.MeetingsViewModel
import com.personal.aide.ui.meetings.SeriesActions
import com.personal.aide.ui.meetings.SeriesScreen
import com.personal.aide.ui.meetings.SeriesViewModel
import com.personal.aide.ui.people.PersonActions
import com.personal.aide.ui.people.PersonScreen
import com.personal.aide.ui.people.PersonViewModel
import com.personal.aide.ui.prep.PrepActions
import com.personal.aide.ui.prep.PrepScreen
import com.personal.aide.ui.prep.PrepViewModel
import com.personal.aide.ui.progress.ProgressActions
import com.personal.aide.ui.progress.ProgressScreen
import com.personal.aide.ui.progress.ProgressViewModel
import com.personal.aide.ui.onboarding.OnboardingActions
import com.personal.aide.ui.onboarding.OnboardingScreen
import com.personal.aide.ui.onboarding.OnboardingStep
import com.personal.aide.ui.onboarding.OnboardingViewModel
import com.personal.aide.ui.record.RecordActions
import com.personal.aide.ui.record.RecordScreen
import com.personal.aide.ui.record.RecordViewModel
import com.personal.aide.ui.settings.SettingsActions
import com.personal.aide.ui.settings.SettingsScreen
import com.personal.aide.ui.settings.SettingsViewModel
import com.personal.aide.ui.tasks.TasksActions
import com.personal.aide.ui.tasks.TasksScreen
import com.personal.aide.ui.tasks.TasksViewModel
import com.personal.aide.ui.theme.AideTheme
import com.personal.aide.ui.today.TodayActions
import com.personal.aide.ui.today.TodayScreen
import com.personal.aide.ui.today.TodayViewModel
import kotlinx.coroutines.launch
import java.io.File

/** Something from outside the app that should take the user straight to a screen. */
sealed interface Launch {
    data class OpenMeeting(val id: Long) : Launch
    data object OpenRecording : Launch
    data class SharedText(val text: String) : Launch
    /** Pictures or documents shared from another app, with any text that came with them. */
    data class SharedFiles(val files: List<Uri>, val text: String = "") : Launch
    data object OpenTasks : Launch
    /** A calendar meeting's brief; with [record], start recording it straight away. */
    data class Prep(val event: CalendarEvent, val record: Boolean) : Launch
}

private object Routes {
    const val TODAY = "today"
    const val MEETINGS = "meetings"
    const val TASKS = "tasks"
    const val KNOWLEDGE = "knowledge"
    const val INSIGHTS = "insights"
    const val RECORD = "record"
    const val SETTINGS = "settings"
    const val QUESTIONS = "questions"
    const val PROFILE = "profile"
    const val INTERVIEW = "interview"
    const val ADD = "add?kind={kind}"
    const val MEETING = "meeting/{id}"
    const val ENTRY = "entry/{id}"
    const val ASK = "ask?meetingId={meetingId}&prompt={prompt}"
    const val SERIES = "series/{id}"
    const val PERSON = "person?name={name}"
    const val PROGRESS = "progress"
    const val PREP = "prep?eventId={eventId}&title={title}&start={start}&end={end}&attendees={attendees}"
    const val NEW_PERSON = "new-person?name={name}"

    fun meeting(id: Long) = "meeting/$id"
    fun entry(id: Long) = "entry/$id"
    fun add(kind: AddKind = AddKind.MEETING) = "add?kind=${kind.name}"
    fun series(id: Long) = "series/$id"
    fun person(name: String) = "person?name=" + Uri.encode(name)
    fun newPerson(name: String) = "new-person?name=" + Uri.encode(name)
    fun prep(event: CalendarEvent) =
        "prep?eventId=${event.id}&title=${Uri.encode(event.title)}&start=${event.start}&end=${event.end}&attendees=" +
            Uri.encode(event.attendees.joinToString("\n"))
    fun ask(meetingId: Long? = null, prompt: String? = null) =
        "ask?meetingId=${meetingId ?: -1L}" + (prompt?.let { "&prompt=" + Uri.encode(it) } ?: "")
}

private data class Tab(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab(Routes.TODAY, "Today", AideIcons.Today),
    Tab(Routes.MEETINGS, "Meetings", AideIcons.Meetings),
    Tab(Routes.TASKS, "Tasks", AideIcons.Tasks),
    Tab(Routes.KNOWLEDGE, "Knowledge", AideIcons.Knowledge),
    Tab(Routes.INSIGHTS, "Insights", AideIcons.Insights),
)

private const val CONSOLE_KEYS_URL = "https://console.anthropic.com/settings/keys"

private const val WORD_DOCUMENT = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
private const val MAX_PICKED_PHOTOS = 20

/** Only asked for where [Notifications.canPost] says it is needed, which is Android 13 and later. */
private const val NOTIFICATIONS_PERMISSION = "android.permission.POST_NOTIFICATIONS"

/** The whole app: first-run setup until it is finished, then the five tabs and everything behind them. */
@Composable
fun AideRoot(launch: Launch?, onLaunchHandled: () -> Unit, onDarkTheme: (Boolean) -> Unit = {}) {
    val container = container()
    val settings by container.settings.settings.collectAsStateWithLifecycle(initialValue = null)
    val current = settings
    AideTheme(current?.theme ?: com.personal.aide.data.ThemeChoice.SYSTEM) {
        val dark = MaterialTheme.colorScheme.background.red < 0.5f
        LaunchedEffect(dark) { onDarkTheme(dark) }
        Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            when {
                current == null -> Box(Modifier.fillMaxSize())
                !current.onboarded -> OnboardingRoute()
                else -> MainNav(launch, onLaunchHandled)
            }
        }
    }
}

@Composable
private fun OnboardingRoute() {
    val context = LocalContext.current
    val vm = aideViewModel { OnboardingViewModel(it) }
    val interviewVm = aideViewModel { InterviewViewModel(it) }
    val state by vm.state.collectAsStateWithLifecycle()
    val interview by interviewVm.state.collectAsStateWithLifecycle()
    var microphone by remember { mutableStateOf(context.hasPermission(Manifest.permission.RECORD_AUDIO)) }

    val askMicrophone = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { microphone = it }
    // Connecting the calendar switches on the brief before each meeting, which is a notification.
    val askForBriefs = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { }
    val askCalendar = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        vm.setCalendar(granted)
        if (granted && Build.VERSION.SDK_INT >= 33 && !context.hasPermission(Manifest.permission.POST_NOTIFICATIONS)) {
            askForBriefs.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }
    val askNotifications = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { vm.setBrief(true) }

    LaunchedEffect(state.step, state.hasKey) {
        if (state.step == OnboardingStep.INTERVIEW && state.hasKey) interviewVm.begin()
    }

    OnboardingScreen(
        state = state,
        interview = interview,
        microphoneAllowed = microphone,
        actions = OnboardingActions(
            onGo = vm::go,
            onBack = vm::back,
            onSaveKey = vm::saveKey,
            onGetKey = { context.openUrl(CONSOLE_KEYS_URL) },
            onSaveBasics = vm::saveBasics,
            onAnswer = interviewVm::answer,
            onRetryInterview = interviewVm::retry,
            onAllowMicrophone = { askMicrophone.launch(Manifest.permission.RECORD_AUDIO) },
            onBrief = { on ->
                if (on && Build.VERSION.SDK_INT >= 33 && !context.hasPermission(Manifest.permission.POST_NOTIFICATIONS)) {
                    askNotifications.launch(Manifest.permission.POST_NOTIFICATIONS)
                } else {
                    vm.setBrief(on)
                }
            },
            onCalendar = { on ->
                if (on && !context.hasPermission(Manifest.permission.READ_CALENDAR)) {
                    askCalendar.launch(Manifest.permission.READ_CALENDAR)
                } else {
                    vm.setCalendar(on)
                    if (on && Build.VERSION.SDK_INT >= 33 && !context.hasPermission(Manifest.permission.POST_NOTIFICATIONS)) {
                        askForBriefs.launch(Manifest.permission.POST_NOTIFICATIONS)
                    }
                }
            },
            onFinish = vm::finish,
        ),
    )
}

private fun NavHostController.toTab(route: String) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }
}

@Composable
private fun MainNav(launch: Launch?, onLaunchHandled: () -> Unit) {
    val nav = rememberNavController()
    val context = LocalContext.current
    val container = container()
    val entry by nav.currentBackStackEntryAsState()
    val route = entry?.destination?.route
    var sharedText by rememberSaveable { mutableStateOf("") }
    // Addresses of files another app shared, kept as text so they survive the screen being rebuilt.
    var sharedFiles by rememberSaveable { mutableStateOf<List<String>>(emptyList()) }

    val startRecording = rememberRecordingStarter { nav.navigate(Routes.RECORD) { launchSingleTop = true } }
    val copy: (String) -> Unit = { text ->
        context.copyToClipboard("Aide", text)
        Toast.makeText(context, "Copied", Toast.LENGTH_SHORT).show()
    }

    LaunchedEffect(launch) {
        when (launch) {
            null -> return@LaunchedEffect
            is Launch.OpenMeeting -> nav.navigate(Routes.meeting(launch.id)) { launchSingleTop = true }
            Launch.OpenRecording -> if (container.recorder.state.value.active) nav.navigate(Routes.RECORD) { launchSingleTop = true }
            is Launch.SharedText -> {
                sharedText = launch.text
                sharedFiles = emptyList()
                nav.navigate(Routes.add()) { launchSingleTop = true }
            }
            is Launch.SharedFiles -> {
                sharedText = launch.text
                sharedFiles = launch.files.map { it.toString() }
                nav.navigate(Routes.add()) { launchSingleTop = true }
            }
            Launch.OpenTasks -> nav.toTab(Routes.TASKS)
            is Launch.Prep -> if (launch.record) startRecording(launch.event) else nav.navigate(Routes.prep(launch.event)) { launchSingleTop = true }
        }
        onLaunchHandled()
    }

    Scaffold(
        bottomBar = {
            if (tabs.any { it.route == route }) {
                NavigationBar(containerColor = MaterialTheme.colorScheme.surfaceContainer) {
                    for (tab in tabs) {
                        NavigationBarItem(
                            selected = route == tab.route,
                            onClick = { nav.toTab(tab.route) },
                            icon = { Icon(tab.icon, contentDescription = null) },
                            label = { Text(tab.label, maxLines = 1) },
                        )
                    }
                }
            }
        },
    ) { padding ->
        // Only the bottom bar's height is taken here; each screen deals with the status bar itself.
        NavHost(nav, startDestination = Routes.TODAY, modifier = Modifier.padding(bottom = if (tabs.any { it.route == route }) padding.calculateBottomPadding() else androidx.compose.ui.unit.Dp(0f))) {
            composable(Routes.TODAY) {
                val vm = aideViewModel { TodayViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                LifecycleResumeEffect(Unit) {
                    vm.refresh()
                    onPauseOrDispose { }
                }
                TodayScreen(
                    state,
                    TodayActions(
                        onRecord = startRecording,
                        onOpenRecording = { nav.navigate(Routes.RECORD) { launchSingleTop = true } },
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onAsk = { prompt -> nav.navigate(Routes.ask(prompt = prompt)) },
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                        onQuestions = { nav.navigate(Routes.QUESTIONS) },
                        onOpenTasks = { nav.toTab(Routes.TASKS) },
                        onPlan = vm::planDay,
                        onRatePlan = vm::ratePlan,
                        onToggle = vm::setDone,
                        onSaveTask = { vm.saveTask(it) },
                        onDeleteTask = vm::deleteTask,
                        onDismissTask = vm::dismissTask,
                        onQuickAdd = vm::addTaskForToday,
                        onDismissError = vm::dismissPlanError,
                        onDismissRecorderError = { container.recorder.clearError() },
                        onPrep = { nav.navigate(Routes.prep(it)) },
                    ),
                )
            }
            composable(Routes.MEETINGS) {
                val vm = aideViewModel { MeetingsViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                MeetingsScreen(
                    state = state,
                    onSearch = vm::search,
                    onOpen = { nav.navigate(Routes.meeting(it)) },
                    onRecord = { startRecording(null) },
                    onImport = {
                        sharedText = ""
                        sharedFiles = emptyList()
                        nav.navigate(Routes.add())
                    },
                    onAsk = { nav.navigate(Routes.ask()) },
                )
            }
            composable(Routes.TASKS) {
                val vm = aideViewModel { TasksViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                LifecycleResumeEffect(Unit) {
                    vm.refresh()
                    onPauseOrDispose { }
                }
                TasksScreen(
                    state,
                    TasksActions(
                        onToggle = vm::setDone,
                        onSaveTask = { vm.saveTask(it) },
                        onDeleteTask = vm::deleteTask,
                        onDismissTask = vm::dismissTask,
                        onOwnership = vm::setOwnership,
                        onPlanWeek = vm::planWeek,
                        onApplyPlan = vm::applyPlan,
                        onDiscardPlan = vm::discardPlan,
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onAsk = { nav.navigate(Routes.ask()) },
                        onOpenPerson = { nav.navigate(Routes.person(it)) },
                    ),
                )
            }
            composable(Routes.KNOWLEDGE) {
                val vm = aideViewModel { KnowledgeViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                KnowledgeScreen(
                    state = state,
                    onSearch = vm::search,
                    onFilter = vm::filter,
                    onOpen = { nav.navigate(Routes.entry(it)) },
                    onAdd = { nav.navigate(Routes.entry(0)) },
                    onProfile = { nav.navigate(Routes.PROFILE) },
                    onAsk = { nav.navigate(Routes.ask()) },
                    onOpenPerson = { nav.navigate(Routes.person(it)) },
                    onAddDocument = {
                        sharedText = ""
                        sharedFiles = emptyList()
                        nav.navigate(Routes.add(AddKind.REFERENCE))
                    },
                )
            }
            composable(Routes.INSIGHTS) {
                val vm = aideViewModel { InsightsViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                LifecycleResumeEffect(Unit) {
                    vm.refresh()
                    onPauseOrDispose { }
                }
                InsightsScreen(
                    state,
                    InsightsActions(
                        onPrevious = vm::previousWeek,
                        onNext = vm::nextWeek,
                        onReview = vm::review,
                        onRate = vm::rateReview,
                        onDismissError = vm::dismissError,
                        onCopy = copy,
                        onShare = { context.shareText("Status update", it) },
                        onAsk = { nav.navigate(Routes.ask()) },
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                        onProgress = { nav.navigate(Routes.PROGRESS) },
                        onLogWins = vm::logWins,
                    ),
                )
            }

            composable(Routes.RECORD) {
                val vm = aideViewModel { RecordViewModel(it) }
                val state by vm.recorder.state.collectAsStateWithLifecycle()
                val segments by vm.segments.collectAsStateWithLifecycle()
                val now by vm.now.collectAsStateWithLifecycle()
                var meetingId by remember { mutableStateOf(state.meetingId) }
                LaunchedEffect(state.meetingId) { state.meetingId?.let { meetingId = it } }
                // When the recording ends, by any route, go and look at what it produced.
                LaunchedEffect(state.active) {
                    if (!state.active) {
                        val finished = meetingId
                        nav.popBackStack()
                        if (finished != null) nav.navigate(Routes.meeting(finished)) { launchSingleTop = true }
                    }
                }
                RecordScreen(
                    state,
                    segments,
                    now,
                    RecordActions(
                        onBack = { nav.popBackStack() },
                        onPause = vm.recorder::pause,
                        onResume = vm.recorder::resume,
                        onStop = vm.recorder::stop,
                        onFlag = vm.recorder::flag,
                        onNote = vm.recorder::addNote,
                        onRename = vm.recorder::rename,
                    ),
                )
            }
            composable(Routes.MEETING, arguments = listOf(navArgument("id") { type = NavType.LongType })) { backStack ->
                val id = backStack.arguments?.getLong("id") ?: 0L
                val vm = aideViewModel { MeetingViewModel(it, id) }
                val state by vm.state.collectAsStateWithLifecycle()
                MeetingScreen(
                    state,
                    MeetingActions(
                        onBack = { nav.popBackStack() },
                        onSummarize = vm::summarize,
                        onRename = vm::rename,
                        onDelete = { vm.delete { nav.popBackStack() } },
                        onRate = vm::rate,
                        onShare = {
                            state.meeting?.let { meeting -> context.shareText(meeting.title, meetingNotesText(meeting, state.analysis, state.tasks)) }
                        },
                        onAsk = { nav.navigate(Routes.ask(meetingId = id)) },
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                        onOpenRecording = { nav.navigate(Routes.RECORD) { launchSingleTop = true } },
                        onToggle = vm::setDone,
                        onSaveTask = { vm.saveTask(it, meetingId = id) },
                        onDeleteTask = vm::deleteTask,
                        onDismissTask = vm::dismissTask,
                        onOwnership = vm::setOwnership,
                        onAnswer = vm::answer,
                        onSkip = vm::skip,
                        onDraftFollowUp = vm::draftFollowUp,
                        onCloseFollowUp = vm::closeFollowUp,
                        onCopy = copy,
                        onShareText = { context.shareText("Follow-up: " + state.meeting?.title.orEmpty(), it) },
                        onOpenSeries = { nav.navigate(Routes.series(it)) },
                        onOpenPerson = { nav.navigate(Routes.person(it)) },
                        onSetSeries = vm::setSeries,
                        onNewSeries = vm::newSeries,
                        onOpenEntry = { entry ->
                            nav.navigate(if (entry.type == KnowledgeType.PERSON) Routes.person(entry.title) else Routes.entry(entry.id))
                        },
                    ),
                )
            }
            composable(Routes.SERIES, arguments = listOf(navArgument("id") { type = NavType.LongType })) { backStack ->
                val id = backStack.arguments?.getLong("id") ?: 0L
                val vm = aideViewModel { SeriesViewModel(it, id) }
                val state by vm.state.collectAsStateWithLifecycle()
                SeriesScreen(
                    state,
                    SeriesActions(
                        onBack = { nav.popBackStack() },
                        onRename = vm::rename,
                        onDelete = { vm.delete { nav.popBackStack() } },
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onPrep = { prompt -> nav.navigate(Routes.ask(prompt = prompt)) },
                        onToggle = vm::setDone,
                        onSaveTask = { vm.saveTask(it) },
                        onDeleteTask = vm::deleteTask,
                        onDismissTask = vm::dismissTask,
                    ),
                )
            }
            composable(Routes.PERSON, arguments = listOf(navArgument("name") { type = NavType.StringType; defaultValue = "" })) { backStack ->
                val name = backStack.arguments?.getString("name").orEmpty()
                val vm = aideViewModel(key = "person-$name") { PersonViewModel(it, name) }
                val state by vm.state.collectAsStateWithLifecycle()
                PersonScreen(
                    state,
                    PersonActions(
                        onBack = { nav.popBackStack() },
                        onEdit = {
                            val entry = state.person.entry
                            nav.navigate(if (entry != null) Routes.entry(entry.id) else Routes.newPerson(state.person.name))
                        },
                        onSuggestAgenda = vm::suggestAgenda,
                        onRateAgenda = vm::rateAgenda,
                        onDismissError = vm::dismissError,
                        onNudge = { prompt -> nav.navigate(Routes.ask(prompt = prompt)) },
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onToggle = vm::setDone,
                        onSaveTask = { vm.saveTask(it) },
                        onDeleteTask = vm::deleteTask,
                        onDismissTask = vm::dismissTask,
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                    ),
                )
            }
            composable(Routes.PROGRESS) {
                val vm = aideViewModel { ProgressViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                ProgressScreen(
                    state,
                    ProgressActions(
                        onBack = { nav.popBackStack() },
                        onUpdate = vm::bringUpToDate,
                        onDismissMessage = vm::dismissMessage,
                        onSaveWin = vm::saveWin,
                        onDeleteWin = vm::deleteWin,
                        onSaveGoal = vm::saveGoal,
                        onDraftReview = vm::draftReview,
                        onOpenLastReview = vm::openLastReview,
                        onCloseReview = vm::closeReview,
                        onCopy = copy,
                        onShare = { context.shareText("Self-review", it) },
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                    ),
                )
            }
            composable(
                Routes.PREP,
                arguments = listOf(
                    navArgument("eventId") { type = NavType.LongType; defaultValue = 0L },
                    navArgument("title") { type = NavType.StringType; defaultValue = "" },
                    navArgument("start") { type = NavType.LongType; defaultValue = 0L },
                    navArgument("end") { type = NavType.LongType; defaultValue = 0L },
                    navArgument("attendees") { type = NavType.StringType; defaultValue = "" },
                ),
            ) { backStack ->
                val args = backStack.arguments
                val event = remember(backStack) {
                    CalendarEvent(
                        id = args?.getLong("eventId") ?: 0L,
                        title = args?.getString("title").orEmpty(),
                        start = args?.getLong("start") ?: 0L,
                        end = args?.getLong("end") ?: 0L,
                        attendees = args?.getString("attendees").orEmpty().split('\n').filter { it.isNotBlank() },
                    )
                }
                val vm = aideViewModel(key = "prep-${event.id}-${event.start}") { PrepViewModel(it, event) }
                val state by vm.state.collectAsStateWithLifecycle()
                PrepScreen(
                    state,
                    PrepActions(
                        onBack = { nav.popBackStack() },
                        onRecord = { startRecording(event) },
                        onAsk = { prompt -> nav.navigate(Routes.ask(prompt = prompt)) },
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onOpenSeries = { nav.navigate(Routes.series(it)) },
                        onOpenPerson = { nav.navigate(Routes.person(it)) },
                        onToggle = vm::setDone,
                        onSaveTask = { vm.saveTask(it) },
                        onDeleteTask = vm::deleteTask,
                        onDismissTask = vm::dismissTask,
                    ),
                )
            }
            composable(
                Routes.ASK,
                arguments = listOf(
                    navArgument("meetingId") { type = NavType.LongType; defaultValue = -1L },
                    navArgument("prompt") { type = NavType.StringType; nullable = true; defaultValue = null },
                ),
            ) { backStack ->
                val meetingId = backStack.arguments?.getLong("meetingId")?.takeIf { it > 0 }
                val prompt = backStack.arguments?.getString("prompt")
                val vm = aideViewModel { AskViewModel(it, meetingId, prompt) }
                val state by vm.state.collectAsStateWithLifecycle()
                AskScreen(
                    state,
                    AskActions(
                        onBack = { nav.popBackStack() },
                        onSend = vm::send,
                        onNewChat = vm::newChat,
                        onOpenThread = vm::open,
                        onDeleteThread = vm::delete,
                        onRate = vm::rate,
                        onCopy = copy,
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                    ),
                )
            }
            composable(Routes.QUESTIONS) {
                val vm = aideViewModel { QuestionsViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                QuestionsScreen(state, onBack = { nav.popBackStack() }, onAnswer = vm::answer, onSkip = vm::skip)
            }
            composable(Routes.ENTRY, arguments = listOf(navArgument("id") { type = NavType.LongType })) { backStack ->
                val id = backStack.arguments?.getLong("id") ?: 0L
                val vm = aideViewModel { EntryViewModel(it, id) }
                val state by vm.state.collectAsStateWithLifecycle()
                if (state.loaded) {
                    EntryScreen(
                        state = state,
                        onBack = { nav.popBackStack() },
                        onSave = { type, title, content, pinned -> vm.save(type, title, content, pinned) { nav.popBackStack() } },
                        onDelete = { vm.delete { nav.popBackStack() } },
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onClearError = vm::clearError,
                    )
                }
            }
            composable(Routes.NEW_PERSON, arguments = listOf(navArgument("name") { type = NavType.StringType; defaultValue = "" })) { backStack ->
                val name = backStack.arguments?.getString("name").orEmpty()
                val vm = aideViewModel(key = "new-person-$name") { EntryViewModel(it, 0L, prefillName = name) }
                val state by vm.state.collectAsStateWithLifecycle()
                if (state.loaded) {
                    EntryScreen(
                        state = state,
                        onBack = { nav.popBackStack() },
                        onSave = { type, title, content, pinned -> vm.save(type, title, content, pinned) { nav.popBackStack() } },
                        onDelete = { },
                        onOpenMeeting = { nav.navigate(Routes.meeting(it)) },
                        onClearError = vm::clearError,
                    )
                }
            }
            composable(Routes.PROFILE) {
                val profile by container.settings.profile.collectAsStateWithLifecycle(initialValue = null)
                val hasKey by container.secrets.hasKey.collectAsStateWithLifecycle(initialValue = false)
                profile?.let { current ->
                    ProfileScreen(
                        profile = current,
                        hasKey = hasKey,
                        onBack = { nav.popBackStack() },
                        onSave = { updated ->
                            container.scope.launch { container.settings.setProfile(updated) }
                            Toast.makeText(context, "Profile saved", Toast.LENGTH_SHORT).show()
                        },
                        onInterview = { nav.navigate(Routes.INTERVIEW) },
                    )
                }
            }
            composable(Routes.INTERVIEW) {
                val vm = aideViewModel { InterviewViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                LaunchedEffect(Unit) { vm.begin() }
                InterviewScreen(state, onBack = { nav.popBackStack() }, onAnswer = vm::answer, onRetry = vm::retry)
            }
            composable(Routes.ADD, arguments = listOf(navArgument("kind") { type = NavType.StringType; defaultValue = AddKind.MEETING.name })) { backStack ->
                val kind = runCatching { AddKind.valueOf(backStack.arguments?.getString("kind").orEmpty()) }.getOrDefault(AddKind.MEETING)
                val vm = aideViewModel { AddViewModel(it, kind) }
                val state by vm.state.collectAsStateWithLifecycle()
                // Files shared from another app are opened once, whether this screen is new or was already showing.
                LaunchedEffect(sharedFiles) {
                    if (sharedFiles.isNotEmpty()) {
                        vm.addFiles(sharedFiles.map(Uri::parse))
                        sharedFiles = emptyList()
                    }
                }
                // Where the camera was asked to save its picture; kept across the trip to the camera app and back.
                var pendingPhoto by rememberSaveable { mutableStateOf<String?>(null) }
                val takePhoto = rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { saved ->
                    pendingPhoto?.let { vm.photoTaken(File(it), saved) }
                    pendingPhoto = null
                }
                val pickPhotos = rememberLauncherForActivityResult(ActivityResultContracts.PickMultipleVisualMedia(MAX_PICKED_PHOTOS)) { vm.addFiles(it) }
                val pickFiles = rememberLauncherForActivityResult(ActivityResultContracts.OpenMultipleDocuments()) { vm.addFiles(it) }
                // Once it is saved there is nothing more to do here: show what Aide makes of it.
                LaunchedEffect(state.intake) {
                    val done = state.intake as? IntakeState.Done ?: return@LaunchedEffect
                    vm.finished()
                    sharedText = ""
                    sharedFiles = emptyList()
                    nav.popBackStack()
                    nav.navigate(Routes.meeting(done.meetingId))
                }
                AddScreen(
                    state,
                    initialText = sharedText,
                    AddActions(
                        onBack = { nav.popBackStack() },
                        onKind = vm::setKind,
                        onTakePhoto = {
                            val (file, address) = vm.newPhoto()
                            pendingPhoto = file.path
                            runCatching { takePhoto.launch(address) }.onFailure {
                                pendingPhoto = null
                                file.delete()
                                Toast.makeText(context, "No camera app was found on this phone.", Toast.LENGTH_LONG).show()
                            }
                        },
                        onChoosePhotos = {
                            runCatching { pickPhotos.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) }
                        },
                        onChooseFiles = {
                            runCatching { pickFiles.launch(arrayOf("application/pdf", "image/*", "text/*", WORD_DOCUMENT)) }.onFailure {
                                Toast.makeText(context, "No file browser was found on this phone.", Toast.LENGTH_LONG).show()
                            }
                        },
                        onRemove = vm::remove,
                        onSave = vm::save,
                        onDismissError = vm::dismissError,
                        onSettings = { nav.navigate(Routes.SETTINGS) },
                    ),
                )
            }
            composable(Routes.SETTINGS) {
                val vm = aideViewModel { SettingsViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                var canNotify by remember { mutableStateOf(Notifications.canPost(context)) }
                LifecycleResumeEffect(Unit) {
                    // The user may have just come back from the system's settings for the app.
                    canNotify = Notifications.canPost(context)
                    onPauseOrDispose { }
                }
                val askNotifications = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
                    canNotify = granted || Notifications.canPost(context)
                    vm.setBrief(true, state.settings.briefMinutes)
                }
                // Meeting briefs and afternoon reminders are on by default, so the question is asked when one of them first matters.
                val askPrepNotifications = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
                    canNotify = granted || Notifications.canPost(context)
                }
                val askCalendar = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
                    vm.setCalendar(granted)
                    if (granted && !Notifications.canPost(context)) askPrepNotifications.launch(NOTIFICATIONS_PERMISSION)
                }
                val saveBackup = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri ->
                    uri?.let(vm::exportTo)
                }
                val openBackup = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri -> uri?.let(vm::restoreFrom) }
                SettingsScreen(
                    state = state,
                    appVersion = BuildConfig.VERSION_NAME,
                    notificationsAllowed = canNotify,
                    canBoost = Build.VERSION.SDK_INT >= 33,
                    actions = SettingsActions(
                        onBack = { nav.popBackStack() },
                        onSaveKey = vm::saveKey,
                        onRemoveKey = vm::removeKey,
                        onClearKeyDialog = vm::clearKeyDialog,
                        onClearMessage = vm::clearMessage,
                        onModel = vm::setModel,
                        onLanguage = vm::setLanguage,
                        onPreferOnDevice = vm::setPreferOnDevice,
                        onAutoSummarize = vm::setAutoSummarize,
                        onLearningMode = vm::setLearningMode,
                        onMuteChimes = vm::setMuteChimes,
                        onSensitivity = vm::setSensitivity,
                        onBrief = { on, minutes ->
                            if (on && Build.VERSION.SDK_INT >= 33 && !context.hasPermission(Manifest.permission.POST_NOTIFICATIONS)) {
                                askNotifications.launch(Manifest.permission.POST_NOTIFICATIONS)
                            } else {
                                vm.setBrief(on, minutes)
                            }
                        },
                        onCalendar = { on ->
                            when {
                                on && !context.hasPermission(Manifest.permission.READ_CALENDAR) -> askCalendar.launch(Manifest.permission.READ_CALENDAR)
                                else -> {
                                    vm.setCalendar(on)
                                    if (on && !canNotify) askPrepNotifications.launch(NOTIFICATIONS_PERMISSION)
                                }
                            }
                        },
                        onPrep = { on ->
                            if (on && !canNotify) askPrepNotifications.launch(NOTIFICATIONS_PERMISSION)
                            vm.setPrep(on)
                        },
                        onNudges = { on ->
                            if (on && !canNotify) askPrepNotifications.launch(NOTIFICATIONS_PERMISSION)
                            vm.setNudges(on)
                        },
                        // Once the question has been refused twice Android stops asking; the app's own page always works.
                        onAllowNotifications = { context.openAppSettings() },
                        onTheme = vm::setTheme,
                        onExport = { saveBackup.launch("aide-backup-${Days.iso(Days.today())}.json") },
                        onRestore = { openBackup.launch(arrayOf("application/json", "text/plain", "application/octet-stream")) },
                        onErase = vm::eraseEverything,
                        onGetKey = { context.openUrl(CONSOLE_KEYS_URL) },
                        onProfile = { nav.navigate(Routes.PROFILE) },
                    ),
                )
            }
        }
    }
}
