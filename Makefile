CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -Isrc
LIB = src/MenuItem.cpp src/DailyMenu.cpp src/WeeklySchedule.cpp src/MenuCycle.cpp

all: cafe run_tests

cafe: src/main.cpp $(LIB)
	$(CXX) $(CXXFLAGS) $^ -o $@

run_tests: tests/tests.cpp $(LIB)
	$(CXX) $(CXXFLAGS) $^ -o $@

test: run_tests
	./run_tests

clean:
	rm -f cafe run_tests test_save.txt
