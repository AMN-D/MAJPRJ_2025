from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils.timezone import now
from twilio.rest import Client
import logging
import os

ACCOUNT_SID = "AC2560b7110edec0ee3eb720a2afbcbfa8"
AUTH_TOKEN = "3ab87c3c777b69ddd12ac002cffe5b78"  
TWILIO_PHONE_NUMBER = "+14178553539"  
MESSAGING_SERVICE_SID = "MG9235c617c48955617f204989ca2ae61a"  

@csrf_exempt
def send_sms(request):
    if request.method == "POST":
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")

        print(latitude, longitude)

        maps_link = f"https://www.google.com/maps?q={latitude},{longitude}"
        sms_body = f"🚨 Emergency! Location: {maps_link} 📍 Please send an ambulance! 🚑"

        try:
            client = Client(ACCOUNT_SID, AUTH_TOKEN)
            message = client.messages.create(
                messaging_service_sid=MESSAGING_SERVICE_SID,
                body=sms_body,
                to="+919359195852",  
            )
            return JsonResponse({"status": "success", "message_sid": message.sid})

        except Exception as e:
                print(f"Twilio Error: {str(e)}")  
                return JsonResponse({"status": "error", "message": str(e)})

    return JsonResponse({"status": "failed", "error": "Invalid request method."})
