from django.urls import path, include
from .import views

urlpatterns = [
    path('login/', views.student_login, name='login'),
    path('get_birthdays/', views.get_birthdays, name='get birthdays'),
    path('get_attendance/', views.get_attendance, name="attendance"),
    path('get_marks/', views.get_marks, name="marks"),
    path('get_timetable/', views.get_timetable, name="timetable"),
]
