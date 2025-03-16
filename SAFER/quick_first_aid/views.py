from django.shortcuts import render
from .models import Symptom, QuickFirstAid

def select_symptoms(request):
    symptoms = Symptom.objects.all()
    diseases = None

    if request.method == "POST":
        selected_symptom_ids = request.POST.getlist("symptom")
        if selected_symptom_ids:
            diseases = QuickFirstAid.objects.filter(symptoms__id__in=selected_symptom_ids).distinct()

    return render(request, "your_template.html", {"symptoms": symptoms, "diseases": diseases})
