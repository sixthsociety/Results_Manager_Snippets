import { Alert, StyleSheet, Text, Pressable, View } from "react-native";
import React, { useContext } from "react";
import { colorPallette } from "../styles/styles";
import { auth, db } from "../Functions/firebase.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocFromCache,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage"; //npm i react-native-async-storage/async-storage
import Loading from "./Loading";
import { shift } from "../screens/ShiftScreens/shift";
import { context } from "../App.js";
import { ButtonIconStyles } from "../styles/styles";

/**
 * @description - This component is a button that allows the user to clock in and out of their shift. It uses the user's location to record the time and location of the clock in and out. It also updates the server with the user's clock in and out times.
 * Editors Note - This was the first component written by Justin Donaldson and is likely a horrible example of how to efficiently write a Punch clock button. Note that the time for the operation to complete is set to 10 seconds. This is to prevent the system from running endlessly if the location data is not retrieved. This is a very bad way to handle this and should be replaced with a better system. Additionally there are a few too many console.logs() in this component.
 * Also note that the component is not very reusable as it is hard coded to the user's pay rate and the shift object. This should be replaced with a more dynamic system that allows the user to input their pay rate and the shift object to be passed in as a prop.
 * Requries - Firebase, Expo-Location, React-Native-Async-Storage
 * Uses a useContext var (imported from a parent component) as context
 * @returns PunchClockButton
 */
const PunchClockButton = () => {
  //#region Clock In Logic

  //---------- Variables
  const [isClockedIn, setIsClockedIn] = useContext(context);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  var shiftID = "";
  const userRef = doc(db, "users", auth.currentUser.uid);
  let ShiftKey = {
    //This framework can be used for multiple logic systems
    key: "shiftId",
    id: "",
  };

  useEffect(() => {
    assignCurrentState();
  }, []);

  const timeouts = [];
  useEffect(() => { }, [isRunning]);

  //--------- Functions
  function PunchClockFunction() {
    var alertMessage = "";
    //Step 1
    if (isRunning) {
      // To block the code from running if its currently being executed
      console.log("This Operation is Running Currently");
      return;
    }
    timeouts.push(
      setTimeout(() => {
        alert(
          `Operation timed out. Please try again or Restart the application: ${alertMessage}`
        );
        setIsRunning(false);
      }, 10000)
    );

    setIsRunning(true);
    const getPermissionsAndLocation = async () => {
      console.log("Getting Permissions and Location");
      alertMessage = "Failed getting permission for Location data";
      let status = await Location.requestForegroundPermissionsAsync();
      if (status.granted != true) {
        setErrorMsg(
          "This application will not work without Location Authorization. Please enable location services to use this application"
        );
        return;
      }

      console.log("Getting current position");
      alertMessage = "Failed getting Location data";
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      await assignCurrentState();
      UpdateServerDocument(location); //Step 3 - Update the Server
    };

    getPermissionsAndLocation();
  }

  async function assignCurrentState() {
    //Step 1 - CALLED ON LOAD
    console.log("1. Checking if the user is clocked in");
    alertMessage = "Failed to update current Clock In Status";
    if (shiftID == "") {
      // If the application does not have the current shift saved in the variable
      var shiftData = await AsyncStorage.getItem(ShiftKey.key); // Check memory to see if the shift exists
      if (shiftData === null) {
        console.log("1. User is not clocked in");
        setIsClockedIn(false);
      } else {
        console.log("1. User is currently clocked in " + shiftData);
        setIsClockedIn(true);
        shiftID = shiftData;
      }
    } else {
      console.log("1. User is currently clocked in " + shiftID);
      setIsClockedIn(true);
    }
  }

  function UpdateServerDocument(position) {
    // Step 3
    let coordinates = position.coords;

    //Set the data to the variables
    let lat = JSON.stringify(coordinates.latitude);
    let long = JSON.stringify(coordinates.longitude);
    let accur = JSON.stringify(coordinates.accuracy);

    console.log(
      `2. Successfully retrieved the GeoLocation: ${lat}, ${long}, ${accur}`
    );

    //Pass the data to the server call
    PassDataToServer(lat, long, accur);
  }


  async function PassDataToServer(lat, long, accuracy) {
    // Step 4
    if (!isClockedIn) {
      console.log(
        `3. Clocking In on Server with: ${lat}, ${long}, ${accuracy}`
      );

      //Get the Date/Time data & User's Rate of pay
      var timestamp = await serverTimestamp();
      var currentRate = 0;
      try {
        let snap = await getDocFromCache(userRef);
        currentRate = snap.data().payRate;
      } catch {
        let snap = await getDoc(userRef);
        currentRate = snap.data().payRate;
      }
      var data = shift;

      //Set the data
      data.User = auth.currentUser.email;
      data.UserID = auth.currentUser.uid;
      data.payRate = currentRate;
      data.TimeInLattitude = lat;
      data.TimeInLongitude = long;
      data.AccuracyIn = accuracy;
      data.TimeIn = timestamp;
      data.active = true;

      //Add the data to the server
      const ref = await addDoc(collection(db, "shifts"), data);
      shiftID = ref.id;

      //Save the shift ID in local Storage
      ShiftKey.id = ref.id;
      await AsyncStorage.setItem(ShiftKey.key, ShiftKey.id);
      //Update the states
      setIsClockedIn(true);
      setIsRunning(false);

      //Alert the user so they know the operation was successful after a small delay
      setTimeout(() => {
        alert(`Thank you for clocking in at ${new Date().toTimeString()}`);
      }, 100);
    } else {
      console.log("3. Clocking Out on Server");

      //Get the Date/Time data
      var timestamp = await serverTimestamp();
      console.log("Retrieved at " + timestamp);
      const ref = await doc(db, "shifts", shiftID);

      //Set the data
      var data = {
        TimeOutLattitude: lat,
        TimeOutLongitude: long,
        AccuracyOut: accuracy,
        TimeOut: timestamp,
      };

      //Update the server
      setDoc(ref, data, { merge: true });
      shiftID = ""; //Reset the shift ID

      //Remove the shift ID from local Storage
      await AsyncStorage.removeItem(ShiftKey.key);
      
      //Update the states
      setIsClockedIn(false);
      setIsRunning(false);

      setTimeout(() => {
        alert(`Thank you for clocking out at ${new Date().toTimeString()}`);
      }, 100);
    }

    //Clear the timeout which is meant to stop the system from running endlessly when attempting to get the location
    timeouts.forEach((timeout) => {
      clearTimeout(timeout);
      console.log("Cleared timeout");
    });

    console.log("4. Successfully updated the server");
    console.log("Punch Clock Operation completed");
  }
  //#endregion

  if (isRunning) {
    return (
      <View>
        {/* Use a loading component to render the loading symbol. - We are using our own custom loading overlay for this system however you are able to swap this with a standard React Native Loading Component  */}
        <Loading />
      </View>
    );
  }

  return (
    <View>
        <Pressable
          style={[isClockedIn ? styles.clockedInContainer : styles.clockedOutContainer, isHovered && ButtonIconStyles.hoverAdd]}
          onPress={PunchClockFunction}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
            {isClockedIn ? 
                (<Text style={styles.clockedInText}>Clock Out</Text>) : 
                (<Text style={styles.clockedOutText}>Clock In</Text>)
            }
        </Pressable>
    </View>
  );
};

export default PunchClockButton;

const styles = StyleSheet.create({
  clockedInContainer: {
    width: 315,
    height: 100,
    borderRadius: 10,
    backgroundColor: colorPallette.button_delete,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    marginBottom: 10,
  },
  clockedInText: {
    color: "white",
    fontSize: 30,
    marginBottom: "auto",
    marginTop: "auto",
    textAlign: "center",
  },
  clockedOutContainer: {
    width: 315,
    height: 100,
    borderRadius: 10,
    backgroundColor: colorPallette.button_add,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    marginBottom: 10,
  },
  clockedOutText: {
    color: "white",
    fontSize: 30,
    marginBottom: "auto",
    marginTop: "auto",
    textAlign: "center",
  },
});
