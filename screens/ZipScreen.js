import React, { useState, useRef,   useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, TouchableHighlight, } from "react-native";
import { SearchBar } from "react-native-elements"; 
import { Button, Input } from "react-native-elements";
import {
    initRecordDB,
    storeRecordItem,
    setupRecordListener,
    updateRecord,
    deleteRecord,
  } from '../helpers/fb-calc';
import { getLocation } from "../api/mapServer";

const ZipScreen = ({ route, navigation }) => {
  const [states, setStates] = useState({
    ready: false,
    lat:null, 
    lng:null,
    error: null
  });
function componentDidMount(){
  let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60 * 24
  };
  setStates({ready:false, error: null });
  navigator.geolocation.getCurrentPosition( geoSuccess, 
                                          geoFailure,
                                          geoOptions);
};
geoSuccess = (position) => {
  console.log(position.coords.latitude);
  
  setStates({
      ready:true,
      where: {lat: position.coords.latitude,lng:position.coords.longitude }
  })
};
geoFailure = (err) => {
  setStates({error: err.message});
};

const initialField = useRef(null);

const [records, setRecords] = useState([]);

const [location, setLocation] = useState("");

useEffect(() => {
    try {
      initRecordDB();
    } catch (err) {
      console.log(err);
    }
    setupRecordListener((items) => {
      setRecords(items);
    });
  }, []);

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('List Data')}>
        <Text style={styles.headerButton}> Cancel </Text>
      </TouchableOpacity>
    ),
});0

  function validate(value) {
    return (isNaN(value) ? "Must be a number" : "");
  };

  function formValid(vals) {
    if ( isNaN(vals.total) || isNaN(vals.price) || isNaN(vals.quantity)) {
      return false;
    } else if (vals.total === '' || vals.price==='' || vals.quantity==='') {
      return false;
    } else {
      return true;
    }
  };

  const updateStatesObject = (vals) => {
    setStates({
      ...states,
      ...vals,
    });
  };

  function editDataDown(data){
    let locations = data.name;
    return locations;
  }

  function apiCall(){
      getLocation(states.lat, states.lng, (data) => {
        setLocation(editDataDown(data));
      });
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
            <View style={styles.container}>
            { !states.ready && (
                <Text>Using Geolocation in React Native.</Text>
            )}
            { states.error && (
            <Text>{state.error}</Text>
            )}
            {states.ready && (
                <Text>{
                `Latitude: ${states.lat}
                Longitude: ${states.lng}`
                }</Text>
            )}
            <View>
            <Button
                style={styles.buttons}
                title="Get latitude and longitude"
                //onPress={() => apiCall()}
                onPress={() => componentDidMount()}
            />
                <View>
                <Input
                style={styles.input}
                placeholder="Enter latitude"
                ref={initialField}
                value={states.lat}
                autoCorrect={false}
                errorStyle={styles.inputError}
                errorMessage={validate(states.lat1)}
                onChangeText={(val) => updateStatesObject({ lat: val })}
            />
            <Input
                style={styles.input}
                placeholder="Enter longitude"
                value={states.lng}
                autoCorrect={false}
                errorStyle={styles.inputError}
                errorMessage={validate(states.lon1)}
                onChangeText={(val) => updateStatesObject({ lng: val })}
            />
                <Button
                style={styles.buttons}
                title="Call API to find City"
                onPress={() => apiCall()}
                />
            </View>
            <Text>Location: {location} </Text>
        </View>
      </View>
      </View>
    </View>
  );
};

/* 
Start: {item.start1}, {item.start2} {"\n"}
End: {item.end1}, {item.end2}{"\n"}
Date: {item.date}
 */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 4,
        paddingTop: 10,
        backgroundColor: "#E8EAF6",
    },
    container: {
        marginHorizontal: 4,
        marginVertical: 8,
        paddingHorizontal: 8,
        flex: 1,
    },
    headerButton: {
        color: '#fff',
        fontWeight: 'bold',
    },
    separator: {
        borderTopWidth: 1,
        borderTopColor: '#000',
    },
    list: {
        fontSize: 20,
    },
    listDate: {
        fontStyle: 'italic',
        flex: 1,
        textAlign: 'right'
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        backgroundColor: '#A6A6A6',
        borderRadius: 20,
    },
    buttons: {
      marginTop: 10,
      marginBottom: 10,
    },
    input: {
      padding: 10,
    },

});

export default ZipScreen;
