# Ingredient Checker

This project allows you to analyze product ingredient labels using image recognition and AI to identify potentially unhealthy ingredients.

## How It Works

1. **Image Capture**: Take a photo of a product's ingredient label using your device's camera.

2. **Text Extraction**: The app uses Optical Character Recognition (OCR) to extract text from the captured image.

3. **AI Analysis**: The extracted text is sent to the Google Gemini model with a custom prompt to analyze the ingredients.

4. **Results**: The AI provides a response indicating whether any unhealthy ingredients were detected in the product.

## Key Features

- **Image-to-Text Conversion**: Utilizes OCR technology to accurately extract text from ingredient labels.
- **AI-Powered Analysis**: Leverages the Google Gemini model to interpret ingredient lists and identify potential health concerns.
- **User-Friendly Interface**: Simple process of capturing an image and receiving instant feedback.

## Technologies Used

- **OCR Library**: AWS Textract
- **Google Gemini API**: For AI-based ingredient analysis
- **[Your programming language]**: Python, JavaScript

