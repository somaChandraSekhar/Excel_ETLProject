


from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_excel, name='upload_excel'),
    path('data/', views.get_data, name='get_data'),
    path('data/<int:pk>/update/', views.update_data, name='update_data'),
    path('data/<int:pk>/delete/', views.delete_data, name='delete_data'),
    path('data/add/', views.add_data, name='add_data'),
]