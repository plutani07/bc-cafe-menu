#include "WeeklySchedule.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <ctime>
using namespace std;

static const string DAY_NAMES[7] = {"Sunday", "Monday", "Tuesday", "Wednesday",
                                    "Thursday", "Friday", "Saturday"};

WeeklySchedule::WeeklySchedule() {
    for (int i = 0; i < 7; i++) days[i] = DailyMenu(DAY_NAMES[i]);
}

string WeeklySchedule::dayName(int index) {
    if (index < 0 || index > 6) return "";
    return DAY_NAMES[index];
}

int WeeklySchedule::dayIndex(string name) {
    for (int i = 0; i < 7; i++) {
        if (DAY_NAMES[i] == name) return i;
    }
    return -1;
}

int WeeklySchedule::todayIndex() {
    time_t now = time(nullptr);
    tm* local = localtime(&now);
    return local->tm_wday;   // 0 = Sunday
}

// File format, one item per line:
// Day|Meal|Name|Calories|ingredient1,ingredient2,...
bool WeeklySchedule::loadFromFile(string filename) {
    ifstream file(filename);
    if (!file) return false;

    string line;
    int lineNum = 0;
    while (getline(file, line)) {
        lineNum++;
        if (line.empty() || line[0] == '#') continue;   // skip blanks/comments

        stringstream ss(line);
        string day, meal, name, calText, ingText;
        getline(ss, day, '|');
        getline(ss, meal, '|');
        getline(ss, name, '|');
        getline(ss, calText, '|');
        getline(ss, ingText);

        MenuItem item(name);
        int cal = 0;
        try { cal = stoi(calText); } catch (...) { cal = -1; }
        if (!item.setCalories(cal)) {
            cout << "  (skipped line " << lineNum << ": " << name << ")" << endl;
            continue;
        }

        vector<string> ingredients;
        stringstream is(ingText);
        string ing;
        while (getline(is, ing, ',')) {
            if (!ing.empty()) ingredients.push_back(ing);
        }
        item.setIngredients(ingredients);

        if (!addItem(day, meal, item)) {
            cout << "  (skipped line " << lineNum << ": bad day or meal)" << endl;
        }
    }
    return true;
}

bool WeeklySchedule::saveToFile(string filename) const {
    ofstream file(filename);
    if (!file) return false;
    file << "# Day|Meal|Name|Calories|Ingredients\n";
    for (int i = 0; i < 7; i++) days[i].writeTo(file);
    return true;
}

bool WeeklySchedule::addItem(string day, string meal, MenuItem item) {
    int i = dayIndex(day);
    if (i == -1) return false;
    return days[i].addItem(meal, item);
}

void WeeklySchedule::displayToday() const {
    cout << "Today is " << dayName(todayIndex()) << "." << endl << endl;
    days[todayIndex()].display();
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

void WeeklySchedule::searchIngredient(string ingredient) const {
    bool any = false;
    for (int i = 0; i < 7; i++) {
        if (days[i].displayIfContains(ingredient)) any = true;
    }
    if (!any) cout << "No items contain \"" << ingredient << "\"." << endl;
}

void WeeklySchedule::filterByCalories(int limit) const {
    cout << "Items at or under " << limit << " calories:" << endl;
    for (int i = 0; i < 7; i++) days[i].displayUnderCalories(limit);
}
