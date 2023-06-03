from django.contrib import admin
from .models import Todo

class TodoAdmin(admin.ModelAdmin):
  list = ('title', 'description', 'completed', 'startDatetime', 'endDatetime')
  
  def _str_(self):
     return self.title

admin.site.register(Todo, TodoAdmin)