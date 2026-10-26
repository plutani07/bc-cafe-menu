#include "MenuItem.h"
#include <iostream>
#include <algorithm>
using namespace std;

// Lowercase helper so searches aren't case-sensitive
static string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}

MenuItem::MenuItem(string itemName, string itemStation) {
    name = itemName;
    station = itemStation;
    calories = 0;
}

void MenuItem::setName(string itemName) { name = itemName; }
void MenuItem::setStation(string itemStation) { station = itemStation; }
void MenuItem::setIngredients(vector<string> itemIngredients) { ingredients = itemIngredients; }
void MenuItem::setTags(vector<string> itemTags) { tags = itemTags; }

bool MenuItem::setCalories(int cal) {
    if (cal >= MIN_CALORIES && cal <= MAX_CALORIES) {
        calories = cal;
        return true;
    }
    cout << "Invalid value: " << cal << " (calories must be between "
         << MIN_CALORIES << " and " << MAX_CALORIES << ")" << endl;
    return false;
}

void MenuItem::clearCalories() { calories = 0; }

string MenuItem::getName() const { return name; }
string MenuItem::getStation() const { return station; }
vector<string> MenuItem::getIngredients() const { return ingredients; }
vector<string> MenuItem::getTags() const { return tags; }
int MenuItem::getCalories() const { return calories; }

bool MenuItem::hasCalories() const { return calories > 0; }

bool MenuItem::hasTag(string tag) const {
    for (size_t i = 0; i < tags.size(); i++) {
        if (tags[i] == tag) return true;
    }
    return false;
}

bool MenuItem::isSide() const { return hasTag("side"); }

bool MenuItem::hasIngredient(string ingredient) const {
    string target = toLower(ingredient);
    for (size_t i = 0; i < ingredients.size(); i++) {
        if (toLower(ingredients[i]).find(target) != string::npos) return true;
    }
    return false;
}

bool MenuItem::matches(string text) const {
    return toLower(name).find(toLower(text)) != string::npos || hasIngredient(text);
}

void MenuItem::display(bool full) const {
    const size_t SHORT_LIST = 6;
    cout << "  - " << name;
    if (hasCalories()) cout << " (" << calories << " cal)";
    if (hasTag("vegetarian")) cout << " [vegetarian]";
    if (hasTag("rotating")) cout << " [rotates]";
    cout << endl;
    if (!ingredients.empty()) {
        size_t shown = (full || ingredients.size() <= SHORT_LIST) ? ingredients.size() : SHORT_LIST;
        cout << "      ";
        for (size_t i = 0; i < shown; i++) {
            cout << ingredients[i];
            if (i + 1 < shown) cout << ", ";
        }
        if (shown < ingredients.size()) cout << " + " << (ingredients.size() - shown) << " more";
        cout << endl;
    }
}
