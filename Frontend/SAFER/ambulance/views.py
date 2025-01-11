from django.shortcuts import render

# Create your views here.
def ambulance(request):
    template = loader.get_template('ambulance.html')
    return HttpResponse(template.render())