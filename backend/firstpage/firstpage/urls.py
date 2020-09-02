from django.contrib import admin
from django.urls import path, include
from student import urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('student/', include('student.urls'))
]
