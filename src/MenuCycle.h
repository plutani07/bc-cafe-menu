#ifndef MENUCYCLE_H
#define MENUCYCLE_H

#include "WeeklySchedule.h"
#include <string>
using namespace std;

// The Perkins dining hall menu repeats every 4 weeks.
// CYCLE_START is a Monday that begins Week 1 (Oct 26, 2026).
class MenuCycle {
private:
    WeeklySchedule weeks[4];

    bool addToWeeks(string weekField, string dayField, string meal, MenuItem item);

public:
    static const int WEEKS = 4;
    static const int START_YEAR = 2026, START_MONTH = 10, START_DAY = 26;

    // Which rotation week (1-4) a calendar date falls in
    static int weekForDate(int year, int month, int day);
    static int currentWeek();
    static string todayName();          // "Monday" ... "Sunday"

    bool loadFromFile(string filename);
    bool appendToFile(string filename, int week, string day, string meal, MenuItem item) const;

    bool addItem(int week, string day, string meal, MenuItem item);
    WeeklySchedule getWeek(int week) const;   // week is 1-4
    int itemCount() const;
};

#endif
