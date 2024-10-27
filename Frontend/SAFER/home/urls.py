from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('voice-controlled-map/', views.vcm, name='vcm'),
    path('ambulance/', views.ambulance, name='ambulance'),
]