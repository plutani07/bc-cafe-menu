#include "DailyMenu.h"
#include <iostream>
using namespace std;

DailyMenu::DailyMenu(string dayName) { day = dayName; }

string DailyMenu::getDay() const { return day; }

vector<MenuItem>* DailyMenu::getMeal(string meal) {
    if (meal == "Breakfast") return &breakfast;
    if (meal == "Lunch") return &lunch;
    if (meal == "Dinner") return &dinner;
    return nullptr;
}

const vector<MenuItem>* DailyMenu::getMeal(string meal) const {
    if (meal == "Breakfast") return &breakfast;
    if (meal == "Lunch") return &lunch;
    if (meal == "Dinner") return &dinner;
    return nullptr;
}

bool DailyMenu::addItem(string meal, MenuItem item) {
    vector<MenuItem>* list = getMeal(meal);
    if (list == nullptr) return false;
    list->push_back(item);
    return true;
}

int DailyMenu::itemCount() const {
    return breakfast.size() + lunch.size() + dinner.size();
}

int DailyMenu::totalCalories(string meal) const {
    const vector<MenuItem>* list = getMeal(meal);
    int total = 0;
    if (list == nullptr) return 0;
    for (size_t i = 0; i < list->size(); i++) total += (*list)[i].getCalories();
    return total;
}

void DailyMenu::displayMeal(string meal) const {
    const vector<MenuItem>* list = getMeal(meal);
    if (list == nullptr) return;
    cout << " " << meal << ":" << endl;
    if (list->empty()) {
        cout << "  (nothing listed)" << endl;
        return;
    }
    for (size_t i = 0; i < list->size(); i++) (*list)[i].display();
}

void DailyMenu::display() const {
    cout << "===== " << day << " =====" << endl;
    displayMeal("Breakfast");
    displayMeal("Lunch");
    displayMeal("Dinner");
    cout << endl;
}

void DailyMenu::displayUnderCalories(int limit) const {
    string meals[3] = {"Breakfast", "Lunch", "Dinner"};
    for (int m = 0; m < 3; m++) {
        const vector<MenuItem>* list = getMeal(meals[m]);
        for (size_t i = 0; i < list->size(); i++) {
            if ((*list)[i].getCalories() <= limit) {
                cout << " [" << day << " " << meals[m] << "]" << endl;
                (*list)[i].display();
            }
        }
    }
}

bool DailyMenu::displayIfContains(string ingredient) const {
    bool found = false;
    string meals[3] = {"Breakfast", "Lunch", "Dinner"};
    for (int m = 0; m < 3; m++) {
        const vector<MenuItem>* list = getMeal(meals[m]);
        for (size_t i = 0; i < list->size(); i++) {
            if ((*list)[i].hasIngredient(ingredient)) {
                cout << " [" << day << " " << meals[m] << "]" << endl;
                (*list)[i].display();
                found = true;
            }
        }
    }
    return found;
}

void DailyMenu::writeTo(ostream& out) const {
    string meals[3] = {"Breakfast", "Lunch", "Dinner"};
    for (int m = 0; m < 3; m++) {
        const vector<MenuItem>* list = getMeal(meals[m]);
        for (size_t i = 0; i < list->size(); i++) {
            const MenuItem& item = (*list)[i];
            out << day << "|" << meals[m] << "|" << item.getName() << "|"
                << item.getCalories() << "|";
            vector<string> ing = item.getIngredients();
            for (size_t j = 0; j < ing.size(); j++) {
                out << ing[j];
                if (j + 1 < ing.size()) out << ",";
            }
            out << "\n";
        }
    }
}
