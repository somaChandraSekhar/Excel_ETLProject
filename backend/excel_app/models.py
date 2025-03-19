from django.db import models

class ExcelData(models.Model):
    name = models.CharField(max_length=255, blank=True)
    revenue = models.FloatField(default=0.0)
    profit = models.FloatField(default=0.0)
    employees = models.IntegerField(default=0)
    country = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name