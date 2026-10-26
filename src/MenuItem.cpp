#include "MenuItem.h"
#include <iostream>
#include <algorithm>
using namespace std;

// Lowercase helper so searches aren't case-sensitive
static string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}

MenuItem::MenuItem(string itemName) {
    name = itemName;
    calories = 0;
}

void MenuItem::setName(string itemName) { name = itemName; }

void MenuItem::setIngredients(vector<string> itemIngredients) {
    ingredients = itemIngredients;
}

bool MenuItem::setCalories(int cal) {
    if (cal >= MIN_CALORIES && cal <= MAX_CALORIES) {
        calories = cal;
        return true;
    }
    cout << "Invalid value: " << cal << " (calories must be between "
         << MIN_CALORIES << " and " << MAX_CALORIES << ")" << endl;
    return false;
}

string MenuItem::getName() const { return name; }
vector<string> MenuItem::getIngredients() const { return ingredients; }
int MenuItem::getCalories() const { return calories; }

bool MenuItem::hasIngredient(string ingredient) const {
    string target = toLower(ingredient);
    for (size_t i = 0; i < ingredients.size(); i++) {
        if (toLower(ingredients[i]).find(target) != string::npos) return true;
    }
    return false;
}

void MenuItem::display() const {
    cout << "  - " << name << " (" << calories << " cal)" << endl;
    cout << "      Ingredients: ";
    if (ingredients.empty()) cout << "(none listed)";
    for (size_t i = 0; i < ingredients.size(); i++) {
        cout << ingredients[i];
        if (i + 1 < ingredients.size()) cout << ", ";
    }
    cout << endl;
}
