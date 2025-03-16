# First, let's get all the diseases that were added but have no symptoms
from quick_first_aid.models import QuickFirstAid, Symptom

# The data we need to process
new_data = [
    {
        "disease": "Heat Stroke",
        "description": "A severe heat-related illness causing high body temperature, confusion, and unconsciousness.",
        "symptoms": ["High Body Temperature", "Confusion", "Unconsciousness"],
        "web_links": "https://youtu.be/HRokV6nFAyU"
    },
    {
        "disease": "Dehydration",
        "description": "A condition caused by excessive loss of water from the body, leading to dizziness and weakness.",
        "symptoms": ["Dizziness", "Weakness", "Dry Mouth"],
        "web_links": "https://youtu.be/HRG6M_Wq-Xk"
    },
    {
        "disease": "Snake Bite",
        "description": "A venomous snake bite can cause swelling, difficulty breathing, and severe pain.",
        "symptoms": ["Swelling", "Difficulty Breathing", "Severe Pain"],
        "web_links": "https://youtu.be/hz8erE1yoxs"
    },
    {
        "disease": "Poisoning",
        "description": "Ingestion of toxic substances causing nausea, dizziness, and difficulty breathing.",
        "symptoms": ["Nausea", "Dizziness", "Difficulty Breathing"],
        "web_links": "https://youtu.be/tnm5os6MOTs"
    },
]

# Link symptoms to diseases
for disease_data in new_data:
    try:
        # Get the disease from the database
        disease = QuickFirstAid.objects.get(disease=disease_data["disease"])
        
        # Link symptoms to the disease
        for symptom_name in disease_data["symptoms"]:
            symptom = Symptom.objects.get(name=symptom_name)
            disease.symptoms.add(symptom)
        
        disease.save()
        print(f"Updated symptoms for: {disease_data['disease']}")
    except QuickFirstAid.DoesNotExist:
        print(f"Disease not found: {disease_data['disease']}")
    except Symptom.DoesNotExist:
        print(f"Symptom not found: {symptom_name}")

# Print Final Data
print("\nFinal List of Diseases and Symptoms:\n")
for disease in QuickFirstAid.objects.all():
    symptoms_list = ", ".join([s.name for s in disease.symptoms.all()])
    print(f"Disease: {disease.disease} | Symptoms: {symptoms_list} | Web Link: {disease.web_links}")