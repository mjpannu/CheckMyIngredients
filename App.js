import React, { useState, useEffect, useCallback } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToS3, invokeLambdaFunction, askIngredients } from './services';
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";



export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  const [image, setImage] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [isDone, setIsDone] = useState(false);

  const handleCompleteTask = () => {
    setIsDone(true);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access camera is required!');
      }
    })();
  }, []);

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setUploading(true);
      try {
        const s3Response = await uploadToS3(result.assets[0].uri);
        const image = s3Response.Location.replace("<My bucket>", "");
        const apiResponse = await invokeLambdaFunction(image);
        const jsonObject = JSON.parse(apiResponse.Payload);
        const ingredients = JSON.stringify(jsonObject.extracted_text);
        const ingredientsData = await askIngredients(ingredients);
        setApiData(ingredientsData);
      } catch (error) {
        console.error('Error uploading image or fetching API data:', error);
        Alert.alert('Error uploading image or fetching API data', error.message);
      } finally {
        setUploading(false);
      }
    }
  };


  const invokeLambda = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setUploading(true);
      try {
        const s3Response = await uploadToS3(result.assets[0].uri);
        const image = s3Response.Location.replace("<My bucket>", "");
        const apiResponse = await invokeLambdaFunction(image);
        const jsonObject = JSON.parse(apiResponse.Payload);
        const ingredients = JSON.stringify(jsonObject.extracted_text);
        const ingredientsData = await askIngredients(ingredients);
        setApiData(ingredientsData);
      } catch (error) {
        console.error('Error uploading image or fetching API data:', error);
        Alert.alert('Error uploading image or fetching API data', error.message);
      } finally {
        setUploading(false);
      }
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require("./assets/logo.png")} />

      <View style={styles.container}>
        {!image && <Button title="Take Picture" onPress={takePicture} />}
        {apiData && image && <Image source={{ uri: image }} style={styles.image} />}
        {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        <View style={styles.line}></View>
        <Text style={styles.summary}>Summary of Ingredients</Text>

        {apiData && (
          <View style={styles.info}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.healthInfo}> {apiData}</Text>
            </ScrollView>
          </View>
        )}


      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    height: 80,
    width: 80
  },
  summary: {
    fontFamily: "Montserrat_700Bold",
    marginBottom: 10
    // fontWeight: 2
  },
  healthInfo: {
    fontFamily: "Montserrat_400Regular",
    fontWeight: 2,

  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "black"
  },
  info: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "#D1FFBD",
    padding: 20
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
    borderRadius: 100
  },
  scrollView: {
    width: '100%',
    textAlign: "left"
  },
});
