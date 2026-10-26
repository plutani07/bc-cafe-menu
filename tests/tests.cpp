// Test cases from the kickoff worksheet (section E), plus tests for the
// menu cycle that loads the real Perkins menu from menu.txt.
#include "MenuCycle.h"
#include <iostream>
using namespace std;

int passed = 0, failed = 0;
void check(string name, bool ok) {
    cout << (ok ? "PASS  " : "FAIL  ") << name << endl;
    ok ? passed++ : failed++;
}

bool mealHas(const DailyMenu& day, string meal, string name) {
    vector<MenuItem> list = day.getMeal(meal);
    for (size_t i = 0; i < list.size(); i++) {
        if (list[i].getName() == name) return true;
    }
    return false;
}

int main() {
    // ----- Worksheet tests (MenuItem) -----
    MenuItem steak("Steak", "Laurene's");
    steak.setIngredients({"Beef", "Salt", "Pepper"});

    check("Calories not listed by default", !steak.hasCalories() && steak.getCalories() == 0);
    check("Normal: setCalories(500) -> 500", steak.setCalories(500) && steak.getCalories() == 500);
    check("Boundary: 10 accepted", steak.setCalories(10));
    check("Boundary: 1000 accepted", steak.setCalories(1000));
    check("Invalid: 1001 rejected, value unchanged", !steak.setCalories(1001) && steak.getCalories() == 1000);
    check("Invalid: 9 rejected", !steak.setCalories(9));
    steak.clearCalories();
    check("clearCalories -> not listed", !steak.hasCalories());

    // ----- Search and tags -----
    check("hasIngredient is case-insensitive", steak.hasIngredient("beef"));
    check("matches() checks the name too", steak.matches("STEAK"));
    check("matches() false when missing", !steak.matches("cheese"));
    MenuItem yams("Candied Yams", "Laurene's");
    yams.setTags({"side"});
    check("side tag -> isSide()", yams.isSide() && !steak.isSide());

    // ----- DailyMenu -----
    DailyMenu monday("Monday");
    check("addItem to Lunch works", monday.addItem("Lunch", steak));
    check("addItem to Brunch works", monday.addItem("Brunch", steak));
    check("addItem rejects bad meal name", !monday.addItem("Supper", steak));
    check("itemCount is 2", monday.itemCount() == 2);

    // ----- Rotation weeks (Oct 26, 2026 starts Week 1) -----
    check("Oct 26 2026 is Week 1", MenuCycle::weekForDate(2026, 10, 26) == 1);
    check("Nov 1 2026 (Sunday) is still Week 1", MenuCycle::weekForDate(2026, 11, 1) == 1);
    check("Nov 2 2026 is Week 2", MenuCycle::weekForDate(2026, 11, 2) == 2);
    check("Nov 16 2026 is Week 4", MenuCycle::weekForDate(2026, 11, 16) == 4);
    check("Nov 23 2026 wraps back to Week 1", MenuCycle::weekForDate(2026, 11, 23) == 1);
    check("Oct 25 2026 (day before) is Week 4", MenuCycle::weekForDate(2026, 10, 25) == 4);

    // ----- Loading the real menu -----
    MenuCycle cycle;
    check("loads menu.txt", cycle.loadFromFile("menu.txt"));
    check("cycle has items", cycle.itemCount() > 1000);

    DailyMenu w1mon = cycle.getWeek(1).getDay("Monday");
    check("W1 Monday lunch has Chili Rubbed Tilapia", mealHas(w1mon, "Lunch", "Chili Rubbed Tilapia"));
    check("W1 Monday dinner has BBQ Chicken", mealHas(w1mon, "Dinner", "BBQ Chicken"));
    check("W1 Monday soup is Chicken and Rice", mealHas(w1mon, "Lunch", "Chicken and Rice Soup"));
    check("Everyday station (Pizza) on W1 Monday lunch", mealHas(w1mon, "Lunch", "Pizza"));
    check("Rise & Shine on weekday breakfast", mealHas(w1mon, "Breakfast", "Assorted Muffins"));

    DailyMenu w2sat = cycle.getWeek(2).getDay("Saturday");
    check("W2 Saturday has Brunch, not Breakfast", w2sat.itemCount("Brunch") > 0 && w2sat.itemCount("Breakfast") == 0);
    check("W2 Saturday brunch has Pulled Pork Tacos", mealHas(w2sat, "Brunch", "Pulled Pork Tacos"));
    check("No soup on weekends", !mealHas(w2sat, "Lunch", "Creamy Squash Soup"));

    DailyMenu w4thu = cycle.getWeek(4).getDay("Thursday");
    check("W4 Thursday lunch has Stuffed Pork Chops", mealHas(w4thu, "Lunch", "Stuffed Pork Chops with Gravy"));

    cout << endl << passed << " passed, " << failed << " failed" << endl;
    return failed == 0 ? 0 : 1;
}
