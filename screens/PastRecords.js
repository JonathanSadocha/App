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

const PastRecords = ({ route, navigation }) => {
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
    headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Add Bill')}>
          <Text style={styles.headerButton}> Add Bill </Text>
        </TouchableOpacity>
      ),
    headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Location')}>
          <Text style={styles.headerButton}> Location </Text>
        </TouchableOpacity>
    )
  });
  
  const onPress = (id,type,dateOfBill,quantity,total,price) => {
    navigation.navigate('Add Bill', {
        id,  
        type,
        dateOfBill,
        quantity,
        total,
        price,
      });
  };

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

  function average(type){
    let i = 0;
    let total = 0;
    records.forEach(element => {
      if(element.type === type){
        total = total + element.total; 
        i++;
      };
    });
    return (total/i) ;
  };

  function latestBill(type){
    let i = 0;
    let total = 0;
    let latest = null;
    records.forEach(element => {
      if(element.type === type){
        if(i===0){
          latest = element.dateOfBill;
          total = element.total;
        }
        if(latest <= element.dateOfBill){
          let latest = element.dateOfBill;
          total = element.total;
        };
      };
    });
    return total;
  };


  function editDataDown(data){
    console.log(data);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
      <View >
        <Text style={styles.title}> Future Bill Projection</Text>
          <Text style={styles.large}>Electric: </Text>
          <Text>Average for Last 12 months: {average("Electric")}</Text>
          <Text>Latest Bill Price:{latestBill("Electric")}</Text>
          <Text style={styles.large}>Gas: </Text>
          <Text>Average for Last 12 months: {average("Gas")}</Text>
          <Text>Latest Bill Price:{latestBill("Gas")}</Text>
          <Text style={styles.large}>Water: </Text>
          <Text>Average for Last 12 months: {average("Water")}</Text>
          <Text>Latest Bill Price:{latestBill("Water")}</Text>
        </View>
          <View >
            <FlatList
                ListHeaderComponent = {<Text style={styles.title}> Past Bills </Text>}
                keyExtractor={(item) =>item.id}
                data={records}
                ItemSeparatorComponent={({highlighted}) => (
                    <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
                )}
                renderItem={({index,item,separators}) => {
                    return(
                        <TouchableOpacity
                        onPress={() => onPress(item.id,item.type,item.dateOfBill,item.quantity,item.total,item.price)}
                        >
                            <View>
                                <Text style={styles.list}> 
                                    Utiliy Type: {item.type} {"\n"}
                                    Bill Date: {item.dateOfBill} {"\n"}
                                    Total: {item.total} {"\n"}
                                    Quantity Used: {item.quantity} {"\n"}
                                    Price Of Unit: {item.price} {"\n"}
                                </Text>
                                <Text style={styles.listDate}>Date: {item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    );       
                }}
            />
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
    large:{
      fontSize: 20,
    }

});

export default PastRecords;
