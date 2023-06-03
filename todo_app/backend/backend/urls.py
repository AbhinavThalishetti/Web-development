from django.contrib import admin
from django.urls import path,include               
from rest_framework import routers                 
from todo import views                             

router = routers.DefaultRouter()                   
router.register(r'todos', views.TodoView, 'todo')  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))             
]

admin.site.site_header  =  "TodoAdmin"  
admin.site.site_title  =  "Admin"
admin.site.index_title  =  "Todo administration"