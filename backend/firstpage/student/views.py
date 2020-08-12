from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import login
# Create your views here.


def student_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        lib_id = data['lib_id']
        password = data['password']
        if login.objects.filter(lib_id=lib_id, password=password).exists():
            response = "valid"
        else:
            response = "Invalid Credentials"
        return JsonResponse(response, safe=False)
