#ifndef MENUITEM_H
#define MENUITEM_H

#include <string>
#include <vector>
using namespace std;

// One food item served at the BC Cafe (Perkins College Dining Hall).
class MenuItem {
private:
    string name;
    string station;              // e.g. "Laurene's", "Sapori", "Crisp"
    vector<string> ingredients;  // ingredients, or build-your-own options
    vector<string> tags;         // "side", "rotating", "vegetarian"
    int calories;                // 0 = not listed

public:
    static const int MIN_CALORIES = 10;
    static const int MAX_CALORIES = 1000;

    MenuItem(string itemName = "Unnamed Item", string itemStation = "");

    void setName(string itemName);
    void setStation(string itemStation);
    void setIngredients(vector<string> itemIngredients);
    void setTags(vector<string> itemTags);
    bool setCalories(int cal);          // returns false if out of range
    void clearCalories();               // back to "not listed"

    string getName() const;
    string getStation() const;
    vector<string> getIngredients() const;
    vector<string> getTags() const;
    int getCalories() const;            // 0 if not listed

    bool hasCalories() const;
    bool hasTag(string tag) const;
    bool isSide() const;
    bool hasIngredient(string ingredient) const;
    bool matches(string text) const;    // name or any ingredient

    // Short lists print in full; long build-your-own lists are trimmed unless full = true
    void display(bool full = false) const;
};

#endif
