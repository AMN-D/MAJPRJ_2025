@echo off

cd /d O:\Users\AMANDHUMAL\Documents\GitHub\MAJPRJ_2025
call venv\Scripts\activate.bat

start cmd /k python SAFER\manage.py runserver
start cmd /k sass --watch SAFER\ambulance\static\ambulance.scss SAFER\ambulance\static\ambulance.css
start cmd /k sass --watch SAFER\disaster_assessment\static\disaster_assessment.scss SAFER\disaster_assessment\static\disaster_assessment.css
start cmd /k sass --watch SAFER\home\static\home.scss SAFER\home\static\home.css
start cmd /k sass --watch SAFER\quick_first_aid\static\quick_first_aid.scss SAFER\quick_first_aid\static\quick_first_aid.css
start cmd /k sass --watch SAFER\quick_first_aid\static\quick_first_aid_symptoms.scss SAFER\quick_first_aid\static\quick_first_aid_symptoms.css
