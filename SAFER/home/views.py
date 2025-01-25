from django.http import HttpResponse
from django.shortcuts import render
from quick_first_aid.models import Symptom

def home(request):
    return render(request, 'home.html')

def vcm(request):
    return render(request, 'vcm.html')

def quick_first_aid(request):
    symptoms = Symptom.objects.all()
    return render(request, 'quick_first_aid.html', {'symptoms': symptoms})

def ambulance(request):
    import geocoder
    g = geocoder.ip('me')
    return render(request, 'ambulance.html', {"latitude": g.lat or 0, "longitude": g.lng or 0})
