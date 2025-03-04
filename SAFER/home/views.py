CLIENT_ID = '96dHZVzsAusmd9BE-YVmk5vKqY2ZvyybsjXuCEOnjfc0M8_reXKcYfe6MQ9wkrvr4OIhGnDjVOVmlDi6X_sNFw=='
CLIENT_SECRET = 'lrFxI-iSEg8Iw7ItTBbX9x9x008GqoA7WgxodeqLit8LCmo5NMcKQvMxgCdTQ_9m0kVlfNGsb8v90b5ZruJnjcaA9-BPAMVE'
TOKEN_URL = 'https://outpost.mapmyindia.com/api/security/oauth/token'

from django.http import HttpResponse
from django.shortcuts import render
from quick_first_aid.models import Symptom, QuickFirstAid

def home(request):
    return render(request, 'home.html')

def get_mapmyindia_access_token():
    client_id = CLIENT_ID 
    client_secret = CLIENT_SECRET
    token_url = TOKEN_URL
    
    try:
        response = requests.post(token_url, data={
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        })

        if response.status_code == 200:
            access_token = response.json().get('access_token')
            return access_token
        else:
            print("Error fetching access token:", response.content)  
            raise Exception(f"Error fetching access token: {response.content}")
    
    except requests.exceptions.RequestException as e:
        print("Request failed:", e)  
        raise Exception(f"Request failed: {e}")

def nearby_hospitals(request):
        lat = request.GET.get('lat', '28.6139')  
        lng = request.GET.get('lng', '77.2090')  
        access_token = get_mapmyindia_access_token()
        if access_token:
            headers = {
                'Authorization': f'Bearer {access_token}'  
            }
            url = f'https://atlas.mapmyindia.com/api/places/nearby/json?keywords=hospital&refLocation={lat},{lng}'
            try:
                print("Requesting nearby hospitals with URL:", url) 
                response = requests.get(url, headers=headers)
                response_data = response.json()
                print("MapmyIndia API Response:", response_data)  

                hospitals = []
                for location in response_data.get('suggestedLocations', []):
                    print("Location Data:", location) 

                    place_name = location.get('placeName')
                    place_address = location.get('placeAddress')
                    
                    geoapify_data = get_coordinates_from_geoapify(place_address)
                    
                    coordinates = None
                    if geoapify_data:
                        features = geoapify_data.get('features', [])
                        if features:
                            coordinates = features[0].get('geometry', {}).get('coordinates', [])
                    
                    hospitals.append({
                        'placeName': place_name,
                        'placeAddress': place_address,
                        'eLoc': location.get('eLoc'),  
                        'coordinates': coordinates  
                    })

                return JsonResponse({'hospitals': hospitals})
            except requests.exceptions.RequestException as e:
                print("Request exception:", e)  
                return JsonResponse({'error': 'Unable to fetch data from MapmyIndia API'}, status=500)
        else:
            return JsonResponse({'error': 'Unable to authenticate with MapmyIndia API'}, status=401)

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


