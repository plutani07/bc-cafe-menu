#ifndef DAILYMENU_H
#define DAILYMENU_H

#include "MenuItem.h"
#include <string>
#include <vector>
using namespace std;

// Everything served on one day, grouped by meal.
// Weekdays have Breakfast, Lunch, Dinner. Weekends have Brunch, Lunch, Dinner.
class DailyMenu {
private:
    string day;
    vector<MenuItem> meals[4];   // indexed by mealIndex()

public:
    static const string MEAL_NAMES[4];   // Breakfast, Brunch, Lunch, Dinner
    static int mealIndex(string meal);   // -1 if not a real meal

    DailyMenu(string dayName = "");

    string getDay() const;
    bool addItem(string meal, MenuItem item);   // false if meal name is invalid
    vector<MenuItem> getMeal(string meal) const;
    int itemCount() const;
    int itemCount(string meal) const;

    void display() const;
    void displayMeal(string meal) const;
};

#endif
