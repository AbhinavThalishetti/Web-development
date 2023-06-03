from django.db import models

class Todo(models.Model):
   title = models.CharField(max_length=100)
   description = models.TextField()
   completed = models.BooleanField(default=False)
   startDatetime = models.DateTimeField()
   endDatetime = models.DateTimeField()

   def _str_(self):
     return self.title