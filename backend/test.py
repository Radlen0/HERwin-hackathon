from fastapi import FastAPI
from dotenv import load_dotenv
from prompts import chatbot_prompt
import requests
import json
import os

load_dotenv("local_env/.env")
api_openrouter = os.getenv("OPENROUTER_API_KEY")

if (api_openrouter != None):

    user_messages = [
        {
            "role": "system",
            "content": chatbot_prompt
        }
    ]

    while (True):
        mess = input("Talk: ")
        user_messages.append(
            {
            "role": "user",
            "content": mess
        })
        response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": "Bearer " + api_openrouter,
                    "Content-Type": "application/json",
                },
                data=json.dumps({
                    "model": "~deepseek/deepseek-pro-latest",
                    "messages": user_messages,
                    "max_tokens": 19819
                })
            )
        print((response.json())['choices'][0]['message']['content'])