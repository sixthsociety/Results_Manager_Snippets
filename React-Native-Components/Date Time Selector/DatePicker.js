import React, { forwardRef, useImperativeHandle, useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, TextInput } from 'react-native';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// used for rendering each day in the month, checks for if it is in the current month, if it is today, and if it is selected.
const Day = ({ day, isInCurrentMonth, isToday, onPress }) => (
    <Pressable
        onPress={onPress}
        style={[styles.renderDay, {
            opacity: isInCurrentMonth ? 1 : 0.5,
            backgroundColor: isToday ? '#22668D' : '#FFFADD'
        }]}
    >
        {day ? <Text style={{ color: isToday ? '#FFFADD' : '#22668D' }}>{day}</Text> : null}
    </Pressable>
);

// used for rendering the days of the week (Sunday - Saturday)
const DayHeader = ({ day }) => (
    <View style={styles.renderDayHeader}>
        <Text style={{ fontWeight: 'bold' }}>{day}</Text>
    </View>
);


const DatePicker = forwardRef(({ }, ref) => {

    const [selectedDate, setSelectedDate] = useState(new Date());

    //Set to current month and year and day by default. On the month button press they are changed lower down in the code. 
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    //Date that the user selects.
    //const [selectedDate, setSelectedDate] = useState(new Date());

    const [yearInput, setYearInput] = useState(selectedYear.toString()); // Additional state to manage year input
    const [monthInput, setMonthInput] = useState(monthNames[new Date().getMonth()]);  // Additional state to manage month input

    //for access from parent component
    useImperativeHandle(ref, () => ({
        getSelectedDate: () => {
            return selectedDate;
        },
    }));

    // Update the year/month inputs when the selected selection changes
    useEffect(() => {
        setYearInput(selectedYear.toString());
    }, [selectedYear]);
    useEffect(() => {
        setMonthInput(monthNames[selectedMonthIndex]);
    }, [selectedMonthIndex]);

    const handleYearInputChange = (input) => {
        setYearInput(input);
    };
    const handleMonthInputChange = (input) => {
        setMonthInput(input);
    };

    const handleApplyYearInput = () => {
        // ensure that the input is a number and is within a reasonable range (1-9999)
        // +yearInput converts the string to a number
        if (!isNaN(yearInput) && +yearInput > 0 && +yearInput <= 9999) {
            setSelectedYear(+yearInput);
        } else {
            // reset to the currently selected year on invalid input
            setYearInput(selectedYear.toString());
            console.log("Invalid year entered");
        }
    };

    const handleApplyMonthInput = () => {
        // ensure that the input is valid. It can be a full month name or a month number [1-12].
        // this will return -1 if the month is not found in the array
        const monthIndexByName = monthNames.findIndex(
            month => month.toLowerCase() === monthInput.toLowerCase()
        );
        const monthIndexByNumber = parseInt(monthInput) - 1;

        if (monthIndexByName > -1) {
            setSelectedMonthIndex(monthIndexByName);
        } else if (!isNaN(monthIndexByNumber) && monthIndexByNumber >= 0 && monthIndexByNumber <= 11) {
            setSelectedMonthIndex(monthIndexByNumber);
        } else {
            // Reset to the currently selected month on invalid input
            setMonthInput(monthNames[selectedMonthIndex]);
            console.log("Invalid month entered");
        }
    };

    //switch month on arrow presses, check if the year also needs to be updated.
    const nextMonth = () => {
        if (selectedMonthIndex === 11) {
            setSelectedYear(selectedYear + 1);
            setSelectedMonthIndex(0);
        } else {
            setSelectedMonthIndex(selectedMonthIndex + 1);
        }
    };
    const prevMonth = () => {
        if (selectedMonthIndex === 0) {
            setSelectedYear(selectedYear - 1);
            setSelectedMonthIndex(11);
        } else {
            setSelectedMonthIndex(selectedMonthIndex - 1);
        }
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(selectedYear, selectedMonthIndex, day);
        //console.log(clickedDate);
        setSelectedDate(clickedDate);
    };

    const daysData = useMemo(() => {
        const firstDayOfMonth = new Date(selectedYear, selectedMonthIndex, 1).getDay();
        const daysInCurrentMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
        const daysInPrevMonth = new Date(selectedYear, selectedMonthIndex, 0).getDate();

        let daysData = [];
        //fill days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysData.push({ day: daysInPrevMonth - firstDayOfMonth + i + 1, isInCurrentMonth: false });
        }
        //fill days from current month
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            daysData.push({ day: i, isInCurrentMonth: true });
        }
        //fill days from next month
        const remainder = daysData.length % 7;
        for (let i = 1; i <= 7 - remainder; i++) {
            daysData.push({ day: i, isInCurrentMonth: false });
        }
        //console.log(daysData);
        return daysData;
    }, [selectedMonthIndex, selectedYear]);


    return (
        <View style={{ flex: 1, width: '100%' }}>
            <Text>Date Picker</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
                <Pressable onPress={prevMonth} style={{ padding: 10, backgroundColor: '#22668D' }}>
                    <Text style={{ color: '#FFFADD' }}>&lt;</Text>
                </Pressable>

                <TextInput
                    style={{ height: 30, borderColor: 'gray', borderWidth: 1, width: 100, textAlign: 'center' }}
                    value={monthInput}
                    onChangeText={handleMonthInputChange}
                    onBlur={handleApplyMonthInput}
                />

                <TextInput
                    style={{ height: 30, borderColor: 'gray', borderWidth: 1, width: 70, textAlign: 'center' }}
                    keyboardType="numeric"
                    maxLength={4}
                    value={yearInput}
                    onChangeText={handleYearInputChange}
                    onBlur={handleApplyYearInput}
                />

                <Pressable onPress={nextMonth} style={{ padding: 10, backgroundColor: '#22668D' }}>
                    <Text style={{ color: '#FFFADD' }}>&gt;</Text>
                </Pressable>
            </View>

            <View style={{ flexDirection: 'row' }}>
                {daysOfTheWeek.map((day, index) => (
                    <DayHeader key={index.toString()} day={day} />
                ))}
            </View>

            <FlatList
                style={{ flex: 1 }}
                data={daysData}
                renderItem={({ item }) => (
                    <Day
                        day={item.day}
                        isInCurrentMonth={item.isInCurrentMonth}
                        isToday={
                            selectedDate &&
                            selectedDate.getDate() === item.day &&
                            selectedDate.getMonth() === selectedMonthIndex &&
                            selectedDate.getFullYear() === selectedYear &&
                            item.isInCurrentMonth
                        }
                        onPress={() => item.isInCurrentMonth && handleDateClick(item.day)}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={7}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    renderDay: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#FFCC70',
        alignItems: 'center',
        justifyContent: 'center',

    },
    renderDayHeader: {
        flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFCC70'
    }
});

export default DatePicker;
