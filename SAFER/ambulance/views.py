from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils.timezone import now
from twilio.rest import Client
import logging
import json
import os

ACCOUNT_SID = "AC2560b7110edec0ee3eb720a2afbcbfa8"
AUTH_TOKEN = "3ab87c3c777b69ddd12ac002cffe5b78"  
TWILIO_PHONE_NUMBER = "+14178553539"  
MESSAGING_SERVICE_SID = "MG28ba2756c0c8fac803a25ea8df75d95b"  

user_locations = {}


@csrf_exempt
@csrf_exempt
def send_sms(request):
    if request.method == "POST":
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")

        print(latitude, longitude)

        maps_link = f"127.0.0.1:8000/ambulance/track/"
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
    
def track(request):
    return render(request, 'track.html')

@csrf_exempt
def receive_location(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            if latitude is None or longitude is None:
                return JsonResponse({"status": "error", "message": "Invalid data!"}, status=400)
            user_ip = request.META.get('REMOTE_ADDR', 'unknown')
            user_locations[user_ip] = {"latitude": latitude, "longitude": longitude}
            print(f"📍 User {user_ip} is at {latitude}, {longitude}")
            return JsonResponse({"status": "success", "message": "Location received!"})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON!"}, status=400)
    elif request.method == "GET":
        return JsonResponse({"status": "success", "locations": user_locations})
    return JsonResponse({"status": "error", "message": "Only POST & GET allowed!"}, status=405)

    