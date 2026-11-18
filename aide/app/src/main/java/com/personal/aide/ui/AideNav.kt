package com.personal.aide.ui

import android.Manifest
import android.net.Uri
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
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
import com.personal.aide.domain.Days
import com.personal.aide.domain.meetingNotesText
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
import com.personal.aide.ui.meetings.ImportScreen
import com.personal.aide.ui.meetings.MeetingActions
import com.personal.aide.ui.meetings.MeetingScreen
import com.personal.aide.ui.meetings.MeetingViewModel
import com.personal.aide.ui.meetings.MeetingsScreen
import com.personal.aide.ui.meetings.MeetingsViewModel
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

/** Something from outside the app that should take the user straight to a screen. */
sealed interface Launch {
    data class OpenMeeting(val id: Long) : Launch
    data object OpenRecording : Launch
    data class SharedText(val text: String) : Launch
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
    const val IMPORT = "import"
    const val MEETING = "meeting/{id}"
    const val ENTRY = "entry/{id}"
    const val ASK = "ask?meetingId={meetingId}&prompt={prompt}"

    fun meeting(id: Long) = "meeting/$id"
    fun entry(id: Long) = "entry/$id"
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
    val askCalendar = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { vm.setCalendar(it) }
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
                if (on && !context.hasPermission(Manifest.permission.READ_CALENDAR)) askCalendar.launch(Manifest.permission.READ_CALENDAR) else vm.setCalendar(on)
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
                nav.navigate(Routes.IMPORT) { launchSingleTop = true }
            }
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
                        nav.navigate(Routes.IMPORT)
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
            composable(Routes.IMPORT) {
                val hasKey by container.secrets.hasKey.collectAsStateWithLifecycle(initialValue = false)
                ImportScreen(
                    initialText = sharedText,
                    hasKey = hasKey,
                    onBack = { nav.popBackStack() },
                    onSave = { title, text ->
                        container.scope.launch {
                            val id = container.meetings.importText(title, text)
                            sharedText = ""
                            container.processor.onRecordingSaved(id)
                            nav.popBackStack()
                            nav.navigate(Routes.meeting(id))
                        }
                    },
                )
            }
            composable(Routes.SETTINGS) {
                val vm = aideViewModel { SettingsViewModel(it) }
                val state by vm.state.collectAsStateWithLifecycle()
                val askCalendar = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { vm.setCalendar(it) }
                val askNotifications = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) {
                    vm.setBrief(true, state.settings.briefMinutes)
                }
                val saveBackup = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri ->
                    uri?.let(vm::exportTo)
                }
                val openBackup = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri -> uri?.let(vm::restoreFrom) }
                SettingsScreen(
                    state = state,
                    appVersion = BuildConfig.VERSION_NAME,
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
                        onBrief = { on, minutes ->
                            if (on && Build.VERSION.SDK_INT >= 33 && !context.hasPermission(Manifest.permission.POST_NOTIFICATIONS)) {
                                askNotifications.launch(Manifest.permission.POST_NOTIFICATIONS)
                            } else {
                                vm.setBrief(on, minutes)
                            }
                        },
                        onCalendar = { on ->
                            if (on && !context.hasPermission(Manifest.permission.READ_CALENDAR)) askCalendar.launch(Manifest.permission.READ_CALENDAR) else vm.setCalendar(on)
                        },
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
