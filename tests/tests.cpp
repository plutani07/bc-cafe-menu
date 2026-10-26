// Test cases from the kickoff worksheet (section E), plus tests for the new classes.
#include "WeeklySchedule.h"
#include <iostream>
using namespace std;

int passed = 0, failed = 0;
void check(string name, bool ok) {
    cout << (ok ? "PASS  " : "FAIL  ") << name << endl;
    ok ? passed++ : failed++;
}

int main() {
    MenuItem steak("Steak");
    steak.setIngredients({"Beef", "Salt", "Pepper"});

    // Worksheet tests
    check("Normal: setCalories(500) -> 500", steak.setCalories(500) && steak.getCalories() == 500);
    check("Boundary: 10 accepted", steak.setCalories(10));
    check("Boundary: 1000 accepted", steak.setCalories(1000));
    check("Invalid: 1001 rejected, value unchanged", !steak.setCalories(1001) && steak.getCalories() == 1000);
    check("Invalid: 9 rejected", !steak.setCalories(9));

    // Ingredient search
    check("hasIngredient is case-insensitive", steak.hasIngredient("beef"));
    check("hasIngredient false when missing", !steak.hasIngredient("cheese"));

    // DailyMenu
    DailyMenu monday("Monday");
    check("addItem to Lunch works", monday.addItem("Lunch", steak));
    check("addItem rejects bad meal name", !monday.addItem("Brunch", steak));
    check("itemCount is 1", monday.itemCount() == 1);

    // WeeklySchedule
    check("dayIndex(\"Friday\") == 5", WeeklySchedule::dayIndex("Friday") == 5);
    check("dayIndex rejects \"Funday\"", WeeklySchedule::dayIndex("Funday") == -1);

    WeeklySchedule week;
    check("loads menu.txt", week.loadFromFile("menu.txt"));
    check("save then reload works", week.saveToFile("test_save.txt") &&
                                    WeeklySchedule().loadFromFile("test_save.txt"));

    cout << endl << passed << " passed, " << failed << " failed" << endl;
    return failed == 0 ? 0 : 1;
}
