from django.shortcuts import render

# Create your views here.
def report_generator(request):
    return render(request, 'report.html')
