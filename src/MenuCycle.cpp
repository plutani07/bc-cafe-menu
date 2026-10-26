#include "MenuCycle.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <ctime>
using namespace std;

// Days since 1970-01-01 for a calendar date (no time zones involved)
static long daysFromCivil(int y, int m, int d) {
    y -= m <= 2;
    long era = (y >= 0 ? y : y - 399) / 400;
    long yoe = y - era * 400;
    long doy = (153 * (m + (m > 2 ? -3 : 9)) + 2) / 5 + d - 1;
    long doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    return era * 146097 + doe - 719468;
}

int MenuCycle::weekForDate(int year, int month, int day) {
    long diff = daysFromCivil(year, month, day) - daysFromCivil(START_YEAR, START_MONTH, START_DAY);
    long weeksSince = diff >= 0 ? diff / 7 : -((-diff + 6) / 7);   // floor division
    int w = weeksSince % WEEKS;
    if (w < 0) w += WEEKS;
    return w + 1;
}

int MenuCycle::currentWeek() {
    time_t now = time(nullptr);
    tm* t = localtime(&now);
    return weekForDate(t->tm_year + 1900, t->tm_mon + 1, t->tm_mday);
}

string MenuCycle::todayName() {
    time_t now = time(nullptr);
    tm* t = localtime(&now);
    return WeeklySchedule::DAY_NAMES[(t->tm_wday + 6) % 7];   // tm_wday: 0 = Sunday
}

static vector<string> splitList(string text) {
    vector<string> out;
    stringstream ss(text);
    string part;
    while (getline(ss, part, ',')) {
        if (!part.empty()) out.push_back(part);
    }
    return out;
}

// weekField: "1".."4" or "*"; dayField: a day name, "Daily", "Weekdays" or "Weekends"
bool MenuCycle::addToWeeks(string weekField, string dayField, string meal, MenuItem item) {
    int firstWeek = 1, lastWeek = WEEKS;
    if (weekField != "*") {
        int w = 0;
        try { w = stoi(weekField); } catch (...) { return false; }
        if (w < 1 || w > WEEKS) return false;
        firstWeek = lastWeek = w;
    }

    vector<string> dayList;
    if (dayField == "Daily") {
        for (int d = 0; d < 7; d++) dayList.push_back(WeeklySchedule::DAY_NAMES[d]);
    } else if (dayField == "Weekdays") {
        for (int d = 0; d < 5; d++) dayList.push_back(WeeklySchedule::DAY_NAMES[d]);
    } else if (dayField == "Weekends") {
        dayList.push_back("Saturday");
        dayList.push_back("Sunday");
    } else if (WeeklySchedule::dayIndex(dayField) != -1) {
        dayList.push_back(dayField);
    } else {
        return false;
    }

    for (int w = firstWeek; w <= lastWeek; w++) {
        for (size_t d = 0; d < dayList.size(); d++) {
            if (!weeks[w - 1].addItem(dayList[d], meal, item)) return false;
        }
    }
    return true;
}

// File format, one item per line:
// Week|Day|Meal|Station|Name|Calories|Ingredients|Tags
bool MenuCycle::loadFromFile(string filename) {
    ifstream file(filename);
    if (!file) return false;

    string line;
    int lineNum = 0;
    while (getline(file, line)) {
        lineNum++;
        if (!line.empty() && line.back() == '\r') line.pop_back();   // Windows line endings
        if (line.empty() || line[0] == '#') continue;

        vector<string> f;
        stringstream ss(line);
        string field;
        while (getline(ss, field, '|')) f.push_back(field);
        while (f.size() < 8) f.push_back("");

        MenuItem item(f[4], f[3]);
        if (!f[5].empty()) {
            int cal = -1;
            try { cal = stoi(f[5]); } catch (...) {}
            if (!item.setCalories(cal)) {
                cout << "  (line " << lineNum << ": calories ignored for " << f[4] << ")" << endl;
            }
        }
        item.setIngredients(splitList(f[6]));
        item.setTags(splitList(f[7]));

        if (f[4].empty() || !addToWeeks(f[0], f[1], f[2], item)) {
            cout << "  (skipped line " << lineNum << ": bad week, day, or meal)" << endl;
        }
    }
    return true;
}

bool MenuCycle::appendToFile(string filename, int week, string day, string meal, MenuItem item) const {
    ofstream file(filename, ios::app);
    if (!file) return false;
    file << week << "|" << day << "|" << meal << "|" << item.getStation() << "|" << item.getName() << "|";
    if (item.hasCalories()) file << item.getCalories();
    file << "|";
    vector<string> ing = item.getIngredients();
    for (size_t i = 0; i < ing.size(); i++) file << (i ? "," : "") << ing[i];
    file << "|";
    vector<string> tags = item.getTags();
    for (size_t i = 0; i < tags.size(); i++) file << (i ? "," : "") << tags[i];
    file << "\n";
    return true;
}

bool MenuCycle::addItem(int week, string day, string meal, MenuItem item) {
    if (week < 1 || week > WEEKS) return false;
    return weeks[week - 1].addItem(day, meal, item);
}

WeeklySchedule MenuCycle::getWeek(int week) const {
    if (week < 1 || week > WEEKS) return WeeklySchedule();
    return weeks[week - 1];
}

int MenuCycle::itemCount() const {
    int total = 0;
    for (int w = 0; w < WEEKS; w++) total += weeks[w].itemCount();
    return total;
}
