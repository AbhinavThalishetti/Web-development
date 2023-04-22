from django.shortcuts import render
from django.http import HttpResponse
from .models import Product, Contact, Order, OrderUpdate
from math import ceil
from django.contrib import messages
import json

# Create your views here.

# Index page
def index(request):
    allProds=[]
    catprods=Product.objects.values('category', 'id')
    cats={item['category'] for item in catprods}
    for cat in cats:
        prod=Product.objects.filter(category=cat)
        n=len(prod)
        nSlides=n//3+ceil((n/3)-(n//3))
        allProds.append([prod, range(1,nSlides), nSlides])
    params={"allProds":allProds}
    return render(request, 'shop/index.html', params)

# Search queries match
def searchMatch(query, item):
    if query in item.desc.casefold() or query in item.category.casefold() or query in item.product_name.casefold() or query in item.sub_category.casefold():
        return True
    else:
        return False

# Search queries page
def search(request):
    query=request.GET.get('search')
    allProds=[]
    catprods=Product.objects.values('category', 'id')
    cats={item['category'] for item in catprods}
    for cat in cats:
        prodtemp=Product.objects.filter(category=cat)
        prod=[i for i in prodtemp if searchMatch(query.casefold(), i)]
        n=len(prod)
        nSlides=n//3+ceil((n/3)-(n//3))
        if len(prod)!=0:
            allProds.append([prod, range(1,nSlides), nSlides])
    msg=""
    if len(allProds)==0 or len(query)<3:
        msg='error'
        allProds.clear()
        messages.error(request, "Please make sure to enter relevant search query.")
    params={"allProds":allProds, "msg": msg}
    return render(request, 'shop/search.html', params)

# Product page
def productview(request, myid):
    product=Product.objects.filter(id= myid)
    return render(request, 'shop/products.html', {"product": product[0]})
    
# About page
def about(request):
    return render(request, 'shop/about.html')    
    
# Contact page
def contact(request):
    if request.method=="POST":
        name=request.POST.get('name', '')
        email=request.POST.get('email', '')
        phone=request.POST.get('phone', '')
        desc=request.POST.get('desc', '')
        if len(name)<3 or len(email)<3 or len(phone)<10 or len(desc)<4:
            messages.error(request, "Please fill the form correctly")
        else:
            contact=Contact(name=name, email=email, phone=phone, desc=desc)
            contact.save()
            messages.success(request, "Your query has been successfully submitted.")
    return render(request, 'shop/contact.html')
    
# Tracker page
def tracker(request):
    if request.method=="POST":
        order_id=request.POST.get('order_id', '')
        email=request.POST.get('email', '')
        try:
            order=Order.objects.filter(order_id=order_id, email=email)
            if len(order)>0:
                update=OrderUpdate.objects.filter(order_id=order_id)
                updates=[]
                for item in update:
                    updates.append({'text': item.update_desc, 'time': item.timestamp})
                    response=json.dumps({"status": "success", "updates": updates, "itemsJson": order[0].items_json}, default=str)
            else:
                response=json.dumps({"status": "noitem"}, default=str)
        except Exception as e:
                response=json.dumps({"status": "error"}, default=str)
        return HttpResponse(response)
    return render(request, 'shop/tracker.html')

#Checkout page
def checkout(request):
    if request.method=="POST":
        items_json=request.POST.get('items_json')
        name=request.POST.get('name')
        amount=request.POST.get('amount')
        email=request.POST.get('email')
        address=request.POST.get('address1')+" "+request.POST.get('address2')
        city=request.POST.get('city')
        state=request.POST.get('state')
        zip_code=request.POST.get('zip-code')
        phone=request.POST.get('phone')
        if all((items_json, name, amount, email, address, city, state, zip_code, phone)):
            order=Order(items_json=items_json, name=name, email=email, address=address, city=city, state=state, zip_code=zip_code, phone=phone, amount=amount)
            order.save()
            update=OrderUpdate(order_id=order.order_id, update_desc="The order has been placed.")
            update.save()
            id=order.order_id
            thank=True
            return render(request, 'shop/checkout.html', {'thank': thank, 'id': id})
        else:
            thank=False
            messages.error(request, "Please fill the form correctly")
    return render(request, 'shop/checkout.html')