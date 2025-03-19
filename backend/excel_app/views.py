from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
from .models import ExcelData
from .serializers import ExcelDataSerializer

@api_view(['POST'])
def upload_excel(request):
    if 'file' not in request.FILES:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    try:
        df = pd.read_excel(file)
        ExcelData.objects.all().delete()  # Clear existing data (optional)
        for _, row in df.iterrows():
            ExcelData.objects.create(
                name=row.get('name', ''),
                revenue=row.get('revenue', 0.0),
                profit=row.get('profit', 0.0),
                employees=row.get('employees', 0),
                country=row.get('country', '')
            )
        return Response({"message": "File uploaded successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_data(request):
    data = ExcelData.objects.all()
    serializer = ExcelDataSerializer(data, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_data(request, pk):
    try:
        item = ExcelData.objects.get(pk=pk)
        serializer = ExcelDataSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ExcelData.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_data(request, pk):
    try:
        item = ExcelData.objects.get(pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except ExcelData.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_data(request):
    serializer = ExcelDataSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)