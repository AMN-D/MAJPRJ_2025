from django.http import HttpResponse
from django.template import loader

def home(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())

def vcm(request):
    template = loader.get_template('vcm.html')
    return HttpResponse(template.render())

def ambulance(request):
    template = loader.get_template('ambulance.html')
    return HttpResponse(template.render())