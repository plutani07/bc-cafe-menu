// CSC 138 - Team 4: BC Cafe Menu
// Shows what the BC Cafe is serving today, any day, or all week.
// Students can search by ingredient or filter by calories.

#include "WeeklySchedule.h"
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

void addItemFromUser(WeeklySchedule& schedule) {
    string day = capitalize(readLine("Day (e.g. Monday): "));
    if (WeeklySchedule::dayIndex(day) == -1) {
        cout << "That isn't a day of the week." << endl;
        return;
    }
    string meal = capitalize(readLine("Meal (Breakfast/Lunch/Dinner): "));
    if (meal != "Breakfast" && meal != "Lunch" && meal != "Dinner") {
        cout << "Meal must be Breakfast, Lunch, or Dinner." << endl;
        return;
    }

    MenuItem item(readLine("Item name: "));
    while (!item.setCalories(readInt("Calories: "))) {}

    vector<string> ingredients;
    cout << "Enter ingredients one at a time (blank line to finish):" << endl;
    while (true) {
        string ing = readLine("  > ");
        if (ing.empty()) break;
        ingredients.push_back(ing);
    }
    item.setIngredients(ingredients);

    schedule.addItem(day, meal, item);
    if (schedule.saveToFile(MENU_FILE)) cout << "Added and saved." << endl;
    else cout << "Added, but couldn't save to " << MENU_FILE << "." << endl;
}

int main() {
    WeeklySchedule schedule;
    if (!schedule.loadFromFile(MENU_FILE)) {
        cout << "Couldn't find " << MENU_FILE << " - starting with an empty menu." << endl;
    }

    int choice = 0;
    while (choice != 7) {
        cout << endl << "====== BC CAFE MENU ======" << endl;
        cout << "1. What's being served today" << endl;
        cout << "2. Menu for a specific day" << endl;
        cout << "3. Full week" << endl;
        cout << "4. Search by ingredient" << endl;
        cout << "5. Items under a calorie limit" << endl;
        cout << "6. Add a menu item (staff)" << endl;
        cout << "7. Quit" << endl;
        choice = readInt("Choose an option: ");
        cout << endl;

        switch (choice) {
            case 1: schedule.displayToday(); break;
            case 2: schedule.displayDay(capitalize(readLine("Which day? "))); break;
            case 3: schedule.displayWeek(); break;
            case 4: schedule.searchIngredient(readLine("Ingredient to search for: ")); break;
            case 5: schedule.filterByCalories(readInt("Max calories: ")); break;
            case 6: addItemFromUser(schedule); break;
            case 7: cout << "Goodbye!" << endl; break;
            default: cout << "Pick a number from 1 to 7." << endl;
        }
    }
    return 0;
}
