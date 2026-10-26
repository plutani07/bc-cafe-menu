#ifndef DAILYMENU_H
#define DAILYMENU_H

#include "MenuItem.h"
#include <string>
#include <vector>
#include <ostream>
using namespace std;

// Everything served on one day, grouped by meal.
class DailyMenu {
private:
    string day;
    vector<MenuItem> breakfast;
    vector<MenuItem> lunch;
    vector<MenuItem> dinner;

public:
    DailyMenu(string dayName = "");

    string getDay() const;
    bool addItem(string meal, MenuItem item);   // false if meal name is invalid
    int itemCount() const;
    int totalCalories(string meal) const;

    void display() const;
    void displayMeal(string meal) const;
    void displayUnderCalories(int limit) const;
    bool displayIfContains(string ingredient) const;
    void writeTo(ostream& out) const;   // one line per item, file format

private:
    vector<MenuItem>* getMeal(string meal);
    const vector<MenuItem>* getMeal(string meal) const;
};

#endif
