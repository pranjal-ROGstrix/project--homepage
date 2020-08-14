from django.db import models
# Create your models here.


class login(models.Model):
    lib_id = models.CharField(max_length=10)
    password = models.CharField(max_length=16, default='student')
    name = models.CharField(max_length=20)


class birthday(models.Model):
    name = models.CharField(max_length=20)
    course = models.CharField(max_length=10)
    department = models.CharField(max_length=10)
    year = models.CharField(max_length=5)
    date = models.DateTimeField(auto_now_add=True)


class marks(models.Model):
    key = models.ForeignKey('login', on_delete=models.CASCADE)
    subject = models.CharField(max_length=10)
    marks = models.CharField(max_length=3)


class attendance(models.Model):
    key = models.ForeignKey('login', on_delete=models.CASCADE)
    attendance_type = models.CharField(max_length=20)
    attendance_percentage = models.CharField(max_length=4)
    attendance_present = models.CharField(max_length=4)
    attendance_total = models.CharField(max_length=4)
