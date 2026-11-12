package com.personal.mealgym.ui

import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.createSavedStateHandle
import androidx.lifecycle.viewmodel.CreationExtras
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.personal.mealgym.AppContainer
import com.personal.mealgym.MealGymApp
import com.personal.mealgym.ui.cook.CookViewModel
import com.personal.mealgym.ui.cook.RecipeEditViewModel
import com.personal.mealgym.ui.cook.RecipeViewModel
import com.personal.mealgym.ui.cook.ShoppingViewModel
import com.personal.mealgym.ui.gym.DemoViewModel
import com.personal.mealgym.ui.gym.GymViewModel
import com.personal.mealgym.ui.gym.WorkoutEditViewModel
import com.personal.mealgym.ui.history.HistoryViewModel
import com.personal.mealgym.ui.looks.LookViewModel
import com.personal.mealgym.ui.people.PersonViewModel
import com.personal.mealgym.ui.plan.PlanViewModel
import com.personal.mealgym.ui.sauna.SaunaViewModel
import com.personal.mealgym.ui.settings.SettingsViewModel
import com.personal.mealgym.ui.today.TodayViewModel

object AppViewModels {
    val Factory: ViewModelProvider.Factory = viewModelFactory {
        initializer { TodayViewModel(container()) }
        initializer { PlanViewModel(container()) }
        initializer { CookViewModel(container()) }
        initializer { RecipeViewModel(container(), createSavedStateHandle()) }
        initializer { RecipeEditViewModel(container(), createSavedStateHandle()) }
        initializer { ShoppingViewModel(container()) }
        initializer { GymViewModel(container()) }
        initializer { WorkoutEditViewModel(container()) }
        initializer { DemoViewModel(container(), createSavedStateHandle()) }
        initializer { SaunaViewModel(container()) }
        initializer { SettingsViewModel(container()) }
        initializer { HistoryViewModel(container()) }
        initializer { PersonViewModel(container(), createSavedStateHandle()) }
        initializer { LookViewModel(container()) }
    }

    private fun CreationExtras.container(): AppContainer =
        (this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as MealGymApp).container
}
