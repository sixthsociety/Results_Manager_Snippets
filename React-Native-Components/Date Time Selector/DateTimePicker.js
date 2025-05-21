import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { View, Button, Text, Modal, ScrollView, TouchableOpacity, FlatList, Pressable } from 'react-native';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const DateTimePicker = () => {
    // date and time as the current date and time
    const now = new Date();

    const timePickerRef = useRef(null);  // Create a ref
    const datePickerRef = useRef(null);  // Create a ref


    // date object representing midnight of the current day
    const midnightToday = new Date(now);
    midnightToday.setHours(0, 0, 0, 0);

    // Initialize state
    const [selectedDate, setSelectedDate] = useState(midnightToday);
    const [selectedTime, setSelectedTime] = useState(midnightToday);
    const [selectedDateTime, setSelectedDateTime] = useState(midnightToday);

    useEffect(() => {
        combineDateTime(selectedDate, selectedTime);
    }, [selectedDate, selectedTime]);

    useEffect(() => {
        console.log('Selected Date Time: ' + selectedDateTime);
    }, [selectedDateTime]);

    const combineDateTime = (date, time) => {
        const combinedDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds(),
            time.getMilliseconds()
        );
        setSelectedDateTime(combinedDateTime);

    };

    //Use this function to save to Database
    const saveDateTime = () => {
        if (timePickerRef.current != null && datePickerRef.current != null) {
            const selectedTime1 = timePickerRef.current.getSelectedTime();
            const selectedDate1 = datePickerRef.current.getSelectedDate();

            // Trigger the useEffect by updating the state
            setSelectedDate(selectedDate1);
            setSelectedTime(selectedTime1);
        }
        else {
            console.log('Please select a date and time');
        }
    };

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <DatePicker ref={datePickerRef} />
            <TimePicker
                ref={timePickerRef}
            />

            <Pressable
                onPress={saveDateTime}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#22668D',
                    padding: 10,
                    borderRadius: 5
                }}
            >
                <Text style={{ color: '#FFFADD' }}>Save Date and Time</Text>
            </Pressable>
        </View>
    );
};

export default DateTimePicker;



