#ifndef WEEKLYSCHEDULE_H
#define WEEKLYSCHEDULE_H

#include "DailyMenu.h"
#include <string>
using namespace std;

// One week of the menu: seven DailyMenus, Monday through Sunday.
class WeeklySchedule {
private:
    DailyMenu days[7];

public:
    static const string DAY_NAMES[7];   // Monday ... Sunday
    static int dayIndex(string name);   // -1 if not a real day

    WeeklySchedule();

    bool addItem(string day, string meal, MenuItem item);
    DailyMenu getDay(string day) const;
    int itemCount() const;

    void displayDay(string day) const;
    void displayWeek() const;
    void search(string text) const;
    void filterByCalories(int limit) const;
};

#endif
