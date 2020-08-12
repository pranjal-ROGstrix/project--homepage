from django.urls import path, include
from .import views

urlpatterns = [
    path('login/', views.student_login, name='login')
]
