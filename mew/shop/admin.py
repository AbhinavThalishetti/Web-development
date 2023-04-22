from django.contrib import admin
from .models import Product, Contact, Order, OrderUpdate
from django.contrib.auth.models import  Group 

# Register your models here.

admin.site.register(Product)
admin.site.register(Contact)
admin.site.register(Order)
admin.site.register(OrderUpdate)

admin.site.unregister(Group)