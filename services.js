
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI("<Gemini Key>");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const uploadToS3 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });

    const s3 = new S3({
        accessKeyId: '<AWS access Key>',
        secretAccessKey: '<AWS Secret Key>',
        region: '<AWS Region>',
    });

    const params = {
        Bucket: '<My Bucket>',
        Key: `photos/${Date.now()}.jpg`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: 'image/jpeg',
    };

    return s3.upload(params).promise();
};


AWS.config.update({
    accessKeyId: '<AWS access Key>',
    secretAccessKey: '<AWS Secret Key>',
    region: '<AWS Region>',
});

const lambda = new AWS.Lambda();

export const invokeLambdaFunction = async (image) => {
    return new Promise((resolve, reject) => {
        const params = {
            FunctionName: 'test',
            Payload: JSON.stringify({
                "s3": {
                    "bucket": {
                        "name": "<AWS Bucket>"
                    },
                    "object": {
                        "key": image
                    }
                }
            })
        };

        lambda.invoke(params, (err, data) => {
            if (err) {
                console.log('Error invoking Lambda function:', err);
                reject(err);
            } else {
                // console.log('Response from Lambda function:', data);
                resolve(data);
            }
        });
    });
};



export const askIngredients = async (ingredients) => {


    try {
        console.log("ingredients list:", ingredients)
        // const prompt = "You are given a text, which contains list of ingredients. List down the harmful ingredients from this text and provided a small description of why they are harmful, ignore the useless information from text. If there are no harmful ingredients, respond with no harmful ingredients found  and do no list the ingredients which are not present in the provided text:  " + (ingredients)
        const prompt = "create formatted list of ingredients that you can understand from this text : " + ingredients
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        // const prompt1 = "You are given a text, which contains list of ingredients. List down the unhealthy ingredients from this text and provided a small description of why they are harmful, ignore the useless information from text. If there are no harmful ingredients, respond with no harmful ingredients found  and do no list the ingredients which are not present in the provided text:  " + (text)
        const prompt1 = "list the unhealthy substances from this, if unhealthy substance exists then provide the answer in key value form where key is the substance and value is small description of why it is harmful. Send the key value pair as elements of array:" + text
        const result1 = await model.generateContent(prompt1);
        const response1 = await result1.response;
        const text1 = response1.text();
        console.log(text1);
        return text1;
    } catch (error) {
        console.log(error)
    }
};


export const fetchAPIData = (imageUrl) => {
    return axios.post('YOUR_API_ENDPOINT', { imageUrl });
};
