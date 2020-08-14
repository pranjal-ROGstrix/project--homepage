from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import login
from .models import birthday
from .models import attendance
# Create your views here.


def student_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        lib_id = data['lib_id']
        password = data['password']
        if login.objects.filter(lib_id=lib_id, password=password).exists():
            response = list(login.objects.filter(
                lib_id=lib_id, password=password).values('name', 'lib_id'))
        else:
            response = "invalid"
        return JsonResponse(response, safe=False)


def get_birthdays(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        todays_date = data['date']
        if birthday.objects.filter(date=todays_date).exists():
            response = list(birthday.objects.filter(date=todays_date).values())
        else:
            response = "No Birthdays today"
        return JsonResponse(response, safe=False)


def get_attendance(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        lib_id = data['lib_id']
        if attendance.objects.filter(key__lib_id=lib_id).exists():
            response = list(attendance.objects.filter(
                key__lib_id=lib_id).values())
        return JsonResponse(response, safe=False)
