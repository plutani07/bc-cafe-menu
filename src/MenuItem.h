#ifndef MENUITEM_H
#define MENUITEM_H

#include <string>
#include <vector>
using namespace std;

// One food item served at the BC Cafe.
class MenuItem {
private:
    string name;
    vector<string> ingredients;
    int calories;

public:
    static const int MIN_CALORIES = 10;
    static const int MAX_CALORIES = 1000;

    MenuItem(string itemName = "Unnamed Item");

    void setName(string itemName);
    void setIngredients(vector<string> itemIngredients);
    bool setCalories(int cal);          // returns false if out of range

    string getName() const;
    vector<string> getIngredients() const;
    int getCalories() const;

    bool hasIngredient(string ingredient) const;
    void display() const;
};

#endif
