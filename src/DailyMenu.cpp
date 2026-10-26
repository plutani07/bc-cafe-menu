#include "DailyMenu.h"
#include <iostream>
using namespace std;

const string DailyMenu::MEAL_NAMES[4] = {"Breakfast", "Brunch", "Lunch", "Dinner"};

int DailyMenu::mealIndex(string meal) {
    for (int i = 0; i < 4; i++) {
        if (MEAL_NAMES[i] == meal) return i;
    }
    return -1;
}

DailyMenu::DailyMenu(string dayName) { day = dayName; }

string DailyMenu::getDay() const { return day; }

bool DailyMenu::addItem(string meal, MenuItem item) {
    int m = mealIndex(meal);
    if (m == -1) return false;
    meals[m].push_back(item);
    return true;
}

vector<MenuItem> DailyMenu::getMeal(string meal) const {
    int m = mealIndex(meal);
    if (m == -1) return vector<MenuItem>();
    return meals[m];
}

int DailyMenu::itemCount() const {
    int total = 0;
    for (int m = 0; m < 4; m++) total += meals[m].size();
    return total;
}

int DailyMenu::itemCount(string meal) const {
    int m = mealIndex(meal);
    return m == -1 ? 0 : meals[m].size();
}

// Prints one meal grouped by station: main items first, then sides on one line.
void DailyMenu::displayMeal(string meal) const {
    int m = mealIndex(meal);
    if (m == -1 || meals[m].empty()) return;
    const vector<MenuItem>& list = meals[m];

    cout << "  --- " << meal << " ---" << endl;

    // Stations in the order they first appear
    vector<string> stations;
    for (size_t i = 0; i < list.size(); i++) {
        bool seen = false;
        for (size_t s = 0; s < stations.size(); s++) {
            if (stations[s] == list[i].getStation()) seen = true;
        }
        if (!seen) stations.push_back(list[i].getStation());
    }

    for (size_t s = 0; s < stations.size(); s++) {
        cout << " [" << stations[s] << "]" << endl;
        string sides;
        for (size_t i = 0; i < list.size(); i++) {
            if (list[i].getStation() != stations[s]) continue;
            if (list[i].isSide()) {
                if (!sides.empty()) sides += ", ";
                sides += list[i].getName();
            } else {
                list[i].display();
            }
        }
        if (!sides.empty()) cout << "    Sides: " << sides << endl;
    }
}

void DailyMenu::display() const {
    cout << "===== " << day << " =====" << endl;
    if (itemCount() == 0) cout << "  (nothing listed)" << endl;
    for (int m = 0; m < 4; m++) displayMeal(MEAL_NAMES[m]);
    cout << endl;
}
