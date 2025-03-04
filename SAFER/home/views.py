from django.http import HttpResponse
from django.shortcuts import render
from quick_first_aid.models import Symptom, QuickFirstAid

def home(request):
    return render(request, 'home.html')

def vcm(request):
    return render(request, 'vcm.html')

def quick_first_aid(request):
    symptoms = Symptom.objects.all()
    diseases = None

    if request.method == "POST":
        selected_symptom_ids = request.POST.getlist('symptom')
        if selected_symptom_ids:
            diseases = QuickFirstAid.objects.filter(symptoms__id__in=selected_symptom_ids).distinct()[:3]

    return render(request, 'quick_first_aid.html', {'symptoms': symptoms, 'diseases': diseases})

def ambulance(request):
    import geocoder
    g = geocoder.ip('me')
    return render(request, 'ambulance.html', {"latitude": g.lat or 0, "longitude": g.lng or 0})


