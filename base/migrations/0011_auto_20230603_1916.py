# Generated by Django 3.2.6 on 2023-06-03 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_alter_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='inegrationGuid',
            field=models.CharField(blank=True, max_length=36, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='inegrationGuid',
            field=models.CharField(blank=True, max_length=36, null=True),
        ),
    ]
