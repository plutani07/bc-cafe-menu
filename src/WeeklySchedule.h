#ifndef WEEKLYSCHEDULE_H
#define WEEKLYSCHEDULE_H

#include "DailyMenu.h"
#include <string>
using namespace std;

// Seven DailyMenus, Sunday through Saturday.
class WeeklySchedule {
private:
    DailyMenu days[7];

public:
    WeeklySchedule();

    static string dayName(int index);
    static int dayIndex(string name);     // -1 if not a real day
    static int todayIndex();              // uses the computer's clock

    bool loadFromFile(string filename);
    bool saveToFile(string filename) const;
    bool addItem(string day, string meal, MenuItem item);

    void displayToday() const;
    void displayDay(string day) const;
    void displayWeek() const;
    void searchIngredient(string ingredient) const;
    void filterByCalories(int limit) const;
};

#endif
