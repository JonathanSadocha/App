import React, { useState, useRef,   useEffect } from "react";
import { StyleSheet, Text, Keyboard, TouchableOpacity, View, TouchableWithoutFeedback, Image } from "react-native";
import { Button, Input } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    initRecordDB,
    storeRecordItem,
    setupRecordListener,
    updateRecord,
    deleteRecord,
  } from '../helpers/fb-calc';
  
//import Geolocation from '@react-native-community/geolocation';

const RecordData = ({ route, navigation }) => {

//

//

  const [state, setState] = useState({
    type: "Electric",
    total: "",
    price: "",
    quantity: "",
  });

  const [date1, setDate] = useState(new Date(1598051730000));
  const [update, setUpdate] = useState(false);
  const [id,setID] = useState("");

  const initialField = useRef(null);

  useEffect(() => {
    if (route.params?.type) {
        setState({
            type: route.params.type.toString(),
            dateOfBill: route.params.dateOfBill,
            quantity: route.params.quantity,
            total: route.params.total.toString(),
            price: route.params.price.toString(),
          })}
          setUpdate(true);
          try {
            setID(route.params.id)
          } catch (err) {
            console.log(err);
          }
  }, [route.params?.type]);

  const billTypes = [
    {
        value: "Electric",
    },
    {
        value: "Gas",
    },
    {
        value: "Water",
    },
  ];

  function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  function validate(value) {
    return (isNaN(value) ? "Must be a number" : "");
  }

  function formValid(vals) {
    if ( isNaN(vals.total) || isNaN(vals.price) || isNaN(vals.quantity)) {
      return false;
    } else if (vals.total === '' || vals.price==='' || vals.quantity==='') {
      return false;
    } else {
      return true;
    }
  }
  function enterData(){
    if (formValid(state)) {
    var date = getCurDate();
    /* if(update === true){
      updateRecord({
        id:id,
        type: state.type,
        dateOfBill: date1.toString(),
        total: state.total,
        price: state.price,
        quantity: state.quantity,
        date: date
      })
    }
    else{ */
      storeRecordItem({
        type: state.type,
        dateOfBill: date1.toString(),
        total: state.total,
        price: state.price,
        quantity: state.quantity,
        date: date
      });
    //}
    
    navigation.navigate('List Data')
    }
  }

  function getCurDate(){
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes(); 
    var sec = new Date().getSeconds();

    return(date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec)
  }

  const updateStateObject = (vals) => {
    setState({
      ...state,
      ...vals,
    });
  };

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  //Nav
  navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('List Data')}>
          <Text style={styles.headerButton}> Cancel </Text>
        </TouchableOpacity>
      ),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Dropdown
            value={state.type}
            onChangeText={(val) => updateStateObject({ type: val })}
            label="Utility Bill Type"
            data={billTypes}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date1}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <View>
          <Button onPress={showDatepicker} title="Show date picker!" />
        </View>
        <Input
          style={styles.input}
          placeholder="Total Paid:"
          value={state.total}
          autoCorrect={false}
          errorStyle={styles.inputError}
          errorMessage={validate(state.total)}
          onChangeText={(val) => updateStateObject({ total: val })}
        />
        <Input
          style={styles.input}
          placeholder="Price per unit:"
          value={state.price}
          autoCorrect={false}
          errorStyle={styles.inputError}
          errorMessage={validate(state.price)}
          onChangeText={(val) => updateStateObject({ price: val })}
        />
        <Input
        //One or the other?
          style={styles.input}
          placeholder="Quantity:"
          value={state.quantity}
          autoCorrect={false}
          errorStyle={styles.inputError}
          errorMessage={validate(state.quantity)}
          onChangeText={(val) => updateStateObject({ quantity: val })}
        />
        <View>
          <Button
            style={styles.buttons}
            title="Save"
            //Send
            onPress={() => enterData()}
          />
        </View>
        <View>
          <Button
            style={styles.buttons}
            title="Clear"
            onPress={() => {
              //initialField.current.focus();
              Keyboard.dismiss();
              setState({
                dateOfBill: '',
                total: '',
                price: '',
                quantity: '',
              });
            }}
          />
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#E8EAF6',
    flex: 1,
  },
  buttons: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputError: {
    color: 'red',
  },
  input: {
    padding: 10,
  },
  resultsGrid: {
    borderColor: '#000',
    borderWidth: 1,
  },
  resultsRow: {
    flexDirection: 'row',
    borderColor: '#000',
    borderBottomWidth: 1,
  },
  resultsLabelContainer: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    flex: 1,
  },
  resultsLabelText: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
  resultsValueText: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    padding: 10,
  },
  headerButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherView: {
    flexDirection: 'row',
    backgroundColor: '#91AAB4',
    marginTop: 5,
    marginBottom: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderLeftWidth:1,
    borderLeftColor: '#000',
    borderBottomWidth:1,
    borderBottomColor: '#000',
    borderTopWidth:1,
    borderTopColor: '#000',
  },
});

export default RecordData;
