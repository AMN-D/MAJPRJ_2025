from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def vcm(request):
    return render(request, 'vcm.html')

def ambulance(request):
    return render(request, 'ambulance.html')
