#include "WeeklySchedule.h"
#include <iostream>
using namespace std;

const string WeeklySchedule::DAY_NAMES[7] = {"Monday", "Tuesday", "Wednesday", "Thursday",
                                             "Friday", "Saturday", "Sunday"};

int WeeklySchedule::dayIndex(string name) {
    for (int i = 0; i < 7; i++) {
        if (DAY_NAMES[i] == name) return i;
    }
    return -1;
}

WeeklySchedule::WeeklySchedule() {
    for (int i = 0; i < 7; i++) days[i] = DailyMenu(DAY_NAMES[i]);
}

bool WeeklySchedule::addItem(string day, string meal, MenuItem item) {
    int i = dayIndex(day);
    if (i == -1) return false;
    return days[i].addItem(meal, item);
}

DailyMenu WeeklySchedule::getDay(string day) const {
    int i = dayIndex(day);
    if (i == -1) return DailyMenu();
    return days[i];
}

int WeeklySchedule::itemCount() const {
    int total = 0;
    for (int i = 0; i < 7; i++) total += days[i].itemCount();
    return total;
}

void WeeklySchedule::displayDay(string day) const {
    int i = dayIndex(day);
    if (i == -1) {
        cout << "\"" << day << "\" isn't a day of the week." << endl;
        return;
    }
    days[i].display();
}

void WeeklySchedule::displayWeek() const {
    for (int i = 0; i < 7; i++) days[i].display();
}

// Lists each matching item once, with every day/meal it's served this week.
// Everyday items (like Pizza) would otherwise print 14 times.
void WeeklySchedule::search(string text) const {
    vector<MenuItem> found;
    vector<string> when;

    for (int d = 0; d < 7; d++) {
        for (int m = 0; m < 4; m++) {
            string meal = DailyMenu::MEAL_NAMES[m];
            vector<MenuItem> list = days[d].getMeal(meal);
            for (size_t i = 0; i < list.size(); i++) {
                if (!list[i].matches(text)) continue;
                string label = DAY_NAMES[d].substr(0, 3) + " " + meal;
                bool merged = false;
                for (size_t f = 0; f < found.size(); f++) {
                    if (found[f].getName() == list[i].getName() &&
                        found[f].getStation() == list[i].getStation()) {
                        if (when[f].find(label) == string::npos) when[f] += ", " + label;
                        merged = true;
                        break;
                    }
                }
                if (!merged) {
                    found.push_back(list[i]);
                    when.push_back(label);
                }
            }
        }
    }

    if (found.empty()) {
        cout << "Nothing this week matches \"" << text << "\"." << endl;
        return;
    }
    cout << found.size() << " match(es) for \"" << text << "\":" << endl;
    for (size_t f = 0; f < found.size(); f++) {
        cout << " " << found[f].getName() << "  (" << found[f].getStation() << ")" << endl;
        cout << "    " << when[f] << endl;
    }
}

void WeeklySchedule::filterByCalories(int limit) const {
    int shown = 0;
    for (int d = 0; d < 7; d++) {
        for (int m = 0; m < 4; m++) {
            vector<MenuItem> list = days[d].getMeal(DailyMenu::MEAL_NAMES[m]);
            for (size_t i = 0; i < list.size(); i++) {
                if (list[i].hasCalories() && list[i].getCalories() <= limit) {
                    cout << " [" << DAY_NAMES[d] << " " << DailyMenu::MEAL_NAMES[m] << "]" << endl;
                    list[i].display();
                    shown++;
                }
            }
        }
    }
    if (shown == 0) {
        cout << "No items at or under " << limit << " calories. "
             << "(The Perkins menu doesn't list calories; items added with calories will show here.)" << endl;
    }
}
