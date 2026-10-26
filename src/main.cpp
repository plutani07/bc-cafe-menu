// CSC 138 - Team 4: BC Cafe Menu
// Shows what the Benedict College dining hall (Perkins) is serving,
// using the 4-week Perkins menu cycle in menu.txt.

#include "MenuCycle.h"
#include <iostream>
#include <limits>
using namespace std;

const string MENU_FILE = "menu.txt";

// Read a whole number, re-asking until the user types one
int readInt(string prompt) {
    int value;
    cout << prompt;
    while (!(cin >> value)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Please enter a number: ";
    }
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    return value;
}

string readLine(string prompt) {
    string text;
    cout << prompt;
    getline(cin, text);
    return text;
}

// "monday" -> "Monday", "LUNCH" -> "Lunch"
string capitalize(string s) {
    for (size_t i = 0; i < s.size(); i++) {
        s[i] = (i == 0) ? toupper(s[i]) : tolower(s[i]);
    }
    return s;
}

void addItemFromUser(MenuCycle& cycle) {
    int week = readInt("Rotation week (1-4): ");
    if (week < 1 || week > 4) {
        cout << "Week must be 1, 2, 3, or 4." << endl;
        return;
    }
    string day = capitalize(readLine("Day (e.g. Monday): "));
    if (WeeklySchedule::dayIndex(day) == -1) {
        cout << "That isn't a day of the week." << endl;
        return;
    }
    string meal = capitalize(readLine("Meal (Breakfast/Brunch/Lunch/Dinner): "));
    if (DailyMenu::mealIndex(meal) == -1) {
        cout << "Meal must be Breakfast, Brunch, Lunch, or Dinner." << endl;
        return;
    }

    MenuItem item(readLine("Item name: "), readLine("Station (e.g. Laurene's): "));
    int cal = readInt("Calories (0 if not known): ");
    if (cal != 0) {
        while (!item.setCalories(cal)) cal = readInt("Calories: ");
    }

    vector<string> ingredients;
    cout << "Enter ingredients one at a time (blank line to finish):" << endl;
    while (true) {
        string ing = readLine("  > ");
        if (ing.empty()) break;
        ingredients.push_back(ing);
    }
    item.setIngredients(ingredients);

    cycle.addItem(week, day, meal, item);
    if (cycle.appendToFile(MENU_FILE, week, day, meal, item)) cout << "Added and saved." << endl;
    else cout << "Added, but couldn't save to " << MENU_FILE << "." << endl;
}

int main() {
    MenuCycle cycle;
    if (!cycle.loadFromFile(MENU_FILE)) {
        cout << "Couldn't find " << MENU_FILE << " - starting with an empty menu." << endl;
    }

    int thisWeek = MenuCycle::currentWeek();
    string today = MenuCycle::todayName();

    int choice = 0;
    while (choice != 8) {
        cout << endl << "====== BC CAFE MENU ======" << endl;
        cout << "Today is " << today << " - Week " << thisWeek << " of the menu cycle" << endl;
        cout << "1. What's being served today" << endl;
        cout << "2. A day this week" << endl;
        cout << "3. This whole week" << endl;
        cout << "4. Another week of the cycle" << endl;
        cout << "5. Search this week (dish or ingredient)" << endl;
        cout << "6. Items under a calorie limit" << endl;
        cout << "7. Add a menu item (staff)" << endl;
        cout << "8. Quit" << endl;
        choice = readInt("Choose an option: ");
        cout << endl;

        WeeklySchedule week = cycle.getWeek(thisWeek);
        switch (choice) {
            case 1:
                cout << "Week " << thisWeek << ", " << today << endl;
                week.displayDay(today);
                break;
            case 2:
                week.displayDay(capitalize(readLine("Which day? ")));
                break;
            case 3:
                week.displayWeek();
                break;
            case 4: {
                int w = readInt("Which week (1-4)? ");
                if (w < 1 || w > 4) { cout << "Week must be 1-4." << endl; break; }
                string day = capitalize(readLine("Which day (or 'all')? "));
                if (day == "All") cycle.getWeek(w).displayWeek();
                else cycle.getWeek(w).displayDay(day);
                break;
            }
            case 5:
                week.search(readLine("Search for: "));
                break;
            case 6:
                week.filterByCalories(readInt("Max calories: "));
                break;
            case 7:
                addItemFromUser(cycle);
                break;
            case 8:
                cout << "Goodbye!" << endl;
                break;
            default:
                cout << "Pick a number from 1 to 8." << endl;
        }
    }
    return 0;
}
