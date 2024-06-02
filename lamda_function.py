

import boto3

def lambda_handler(event, context):
    # Get the S3 bucket and key from the event
    bucket = event['s3']['bucket']['name']
    key = event['s3']['object']['key']
    
    print("bucket : ", str(bucket))
    print("key : ", str(key))

    # Initialize the Textract client
    textract_client = boto3.client('textract')
    
    # Call Textract to analyze the document
    response = textract_client.detect_document_text(
        Document={
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        }
    )

    # Extract text from the response
    extracted_text = ''
    for item in response['Blocks']:
        if item['BlockType'] == 'LINE':
            extracted_text += item['Text'] + '\n'

    # Return the extracted text
    return {
        'extracted_text': extracted_text
    }

