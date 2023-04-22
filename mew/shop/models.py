from django.db import models

# Create your models here.

# Product
class Product(models.Model):
    product_name=models.CharField(max_length=50)
    category=models.CharField(max_length=50, default="")
    sub_category=models.CharField(max_length=50, default="")
    price=models.IntegerField(default=0)
    desc=models.CharField(max_length=300)
    pub_date=models.DateTimeField()
    image=models.ImageField(upload_to='shop/images',default="")

    def __str__(self):
        return self.product_name 

# Contact
class Contact(models.Model):
    msg_id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=50)
    email=models.CharField(max_length=50, default="")
    phone=models.CharField(max_length=10, default="")
    desc=models.CharField(max_length=500, default="")

    def __str__(self):
        return self.name

# Order
class Order(models.Model):
    order_id=models.AutoField(primary_key=True)
    items_json=models.CharField(max_length=5000)
    amount=models.IntegerField(default=0)
    name=models.CharField(max_length=50)
    email=models.CharField(max_length=100)
    address=models.CharField(max_length=300)
    city=models.CharField(max_length=50)
    state=models.CharField(max_length=50)
    zip_code=models.CharField(max_length=6)
    phone=models.CharField(max_length=10)

    def __str__(self):
        return self.name
    
# Tracker
class OrderUpdate(models.Model):
    update_id=models.AutoField(primary_key=True)
    order_id=models.IntegerField(default="")
    update_desc=models.CharField(max_length=5000)
    timestamp=models.DateField(auto_now_add=True)

    def __str__(self):
        return self.update_desc[0:7]+"..."