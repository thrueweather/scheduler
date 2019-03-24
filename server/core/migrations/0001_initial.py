# Generated by Django 2.2a1 on 2019-03-15 17:25

import core.models
from decimal import Decimal
from django.conf import settings
import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import djmoney.models.fields
import localflavor.us.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('line1', models.CharField(help_text='Address Line 1', max_length=128)),
                ('line2', models.CharField(blank=True, help_text='Address Line 2', max_length=128, null=True)),
                ('city', models.CharField(max_length=128)),
                ('state', localflavor.us.models.USStateField(max_length=2)),
                ('zipcode', localflavor.us.models.USZipCodeField(max_length=10)),
            ],
            options={
                'ordering': ['state', 'city', 'line1', 'line2'],
            },
        ),
        migrations.CreateModel(
            name='CommonForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('project_recipient', models.CharField(choices=[('PROPERTY_MANAGER', 'Property Manager'), ('MEP_ENGINEER', 'Mep Engineer'), ('ARCHITECT', 'Architect'), ('CONSTRUCTION_MANAGER', 'Construction Manager'), ('BUILDING_ENGINEERING', 'Building Engineering'), ('PROJECT MANAGER', 'Project Manager'), ('ASSISTANT_PROJECT_MANAGER', 'Assistant Project Manager'), ('SUPERINTENDENT', 'Superintendent'), ('ACCOUNTING', 'Accounting')], default='ARCHITECT', max_length=64)),
                ('project_sender', models.CharField(choices=[('PROPERTY_MANAGER', 'Property Manager'), ('MEP_ENGINEER', 'Mep Engineer'), ('ARCHITECT', 'Architect'), ('CONSTRUCTION_MANAGER', 'Construction Manager'), ('BUILDING_ENGINEERING', 'Building Engineering'), ('PROJECT MANAGER', 'Project Manager'), ('ASSISTANT_PROJECT_MANAGER', 'Assistant Project Manager'), ('SUPERINTENDENT', 'Superintendent'), ('ACCOUNTING', 'Accounting')], default='PROJECT MANAGER', max_length=64)),
                ('trade_division', core.models.CSICode(choices=[('0700 Division 0', 'General conditions'), ('3000 Division 3', 'Concrete'), ('4000 Division 4', 'Masonry'), ('5000 Division 5', 'Metals'), ('6100 Division 6', 'Rough carpentry'), ('6200 Division 6', 'Finish carpentry(aka millwork)'), ('7000 Division 7', 'Thermal and moisture control'), ('8050 Division 8', 'Doors/frames/hardware'), ('8800 Division 8', 'Glass and glazing'), ('9300 Division 9', 'Ceramic tile and ceramics'), ('9500 Division 9', 'Acoustical ceilings'), ('9600 Division 9', 'Flooring'), ('0000 NULL 0', 'empty')], default='0000 NULL 0', max_length=32)),
            ],
            options={
                'ordering': ['project', 'name', 'id'],
            },
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('phone', models.CharField(blank=True, help_text='Company Phone Number', max_length=17, null=True)),
                ('address', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Address')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(help_text='First Name', max_length=128)),
                ('last_name', models.CharField(help_text='Last Name', max_length=128)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('phone', models.CharField(blank=True, help_text='Primary Phone Number', max_length=17, null=True)),
                ('cell', models.CharField(blank=True, help_text='Cellphone Number', max_length=17, null=True)),
                ('title', models.CharField(blank=True, help_text='Professional Title', max_length=128, null=True)),
                ('role', models.CharField(blank=True, choices=[('PROPERTY_MANAGER', 'Property Manager'), ('MEP_ENGINEER', 'Mep Engineer'), ('ARCHITECT', 'Architect'), ('CONSTRUCTION_MANAGER', 'Construction Manager'), ('BUILDING_ENGINEERING', 'Building Engineering'), ('ASSISTANT_PROJECT_MANAGER', 'Assistant Project Manager'), ('SUPERINTENDENT', 'Superintendent'), ('ACCOUNTING', 'Accounting')], max_length=64, null=True)),
                ('company', models.ForeignKey(blank=True, help_text='Employer', null=True, on_delete=django.db.models.deletion.PROTECT, to='core.Company')),
            ],
            options={
                'ordering': ['company', 'first_name', 'last_name', 'title', 'email', 'cell'],
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=True)),
                ('raw_data', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('changes_list', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=255), blank=True, default=list, editable=False, size=None)),
                ('creation_approved', models.BooleanField(default=False)),
                ('name', models.CharField(help_text='Name of Project', max_length=128)),
                ('value_currency', djmoney.models.fields.CurrencyField(choices=[('XUA', 'ADB Unit of Account'), ('AFN', 'Afghani'), ('DZD', 'Algerian Dinar'), ('ARS', 'Argentine Peso'), ('AMD', 'Armenian Dram'), ('AWG', 'Aruban Guilder'), ('AUD', 'Australian Dollar'), ('AZN', 'Azerbaijanian Manat'), ('BSD', 'Bahamian Dollar'), ('BHD', 'Bahraini Dinar'), ('THB', 'Baht'), ('PAB', 'Balboa'), ('BBD', 'Barbados Dollar'), ('BYN', 'Belarussian Ruble'), ('BYR', 'Belarussian Ruble'), ('BZD', 'Belize Dollar'), ('BMD', 'Bermudian Dollar (customarily known as Bermuda Dollar)'), ('BTN', 'Bhutanese ngultrum'), ('VEF', 'Bolivar Fuerte'), ('BOB', 'Boliviano'), ('XBA', 'Bond Markets Units European Composite Unit (EURCO)'), ('BRL', 'Brazilian Real'), ('BND', 'Brunei Dollar'), ('BGN', 'Bulgarian Lev'), ('BIF', 'Burundi Franc'), ('XOF', 'CFA Franc BCEAO'), ('XAF', 'CFA franc BEAC'), ('XPF', 'CFP Franc'), ('CAD', 'Canadian Dollar'), ('CVE', 'Cape Verde Escudo'), ('KYD', 'Cayman Islands Dollar'), ('CLP', 'Chilean peso'), ('XTS', 'Codes specifically reserved for testing purposes'), ('COP', 'Colombian peso'), ('KMF', 'Comoro Franc'), ('CDF', 'Congolese franc'), ('BAM', 'Convertible Marks'), ('NIO', 'Cordoba Oro'), ('CRC', 'Costa Rican Colon'), ('HRK', 'Croatian Kuna'), ('CUP', 'Cuban Peso'), ('CUC', 'Cuban convertible peso'), ('CZK', 'Czech Koruna'), ('GMD', 'Dalasi'), ('DKK', 'Danish Krone'), ('MKD', 'Denar'), ('DJF', 'Djibouti Franc'), ('STD', 'Dobra'), ('DOP', 'Dominican Peso'), ('VND', 'Dong'), ('XCD', 'East Caribbean Dollar'), ('EGP', 'Egyptian Pound'), ('SVC', 'El Salvador Colon'), ('ETB', 'Ethiopian Birr'), ('EUR', 'Euro'), ('XBB', 'European Monetary Unit (E.M.U.-6)'), ('XBD', 'European Unit of Account 17(E.U.A.-17)'), ('XBC', 'European Unit of Account 9(E.U.A.-9)'), ('FKP', 'Falkland Islands Pound'), ('FJD', 'Fiji Dollar'), ('HUF', 'Forint'), ('GHS', 'Ghana Cedi'), ('GIP', 'Gibraltar Pound'), ('XAU', 'Gold'), ('XFO', 'Gold-Franc'), ('PYG', 'Guarani'), ('GNF', 'Guinea Franc'), ('GYD', 'Guyana Dollar'), ('HTG', 'Haitian gourde'), ('HKD', 'Hong Kong Dollar'), ('UAH', 'Hryvnia'), ('ISK', 'Iceland Krona'), ('INR', 'Indian Rupee'), ('IRR', 'Iranian Rial'), ('IQD', 'Iraqi Dinar'), ('IMP', 'Isle of Man Pound'), ('JMD', 'Jamaican Dollar'), ('JOD', 'Jordanian Dinar'), ('KES', 'Kenyan Shilling'), ('PGK', 'Kina'), ('LAK', 'Kip'), ('KWD', 'Kuwaiti Dinar'), ('AOA', 'Kwanza'), ('MMK', 'Kyat'), ('GEL', 'Lari'), ('LVL', 'Latvian Lats'), ('LBP', 'Lebanese Pound'), ('ALL', 'Lek'), ('HNL', 'Lempira'), ('SLL', 'Leone'), ('LSL', 'Lesotho loti'), ('LRD', 'Liberian Dollar'), ('LYD', 'Libyan Dinar'), ('SZL', 'Lilangeni'), ('LTL', 'Lithuanian Litas'), ('MGA', 'Malagasy Ariary'), ('MWK', 'Malawian Kwacha'), ('MYR', 'Malaysian Ringgit'), ('TMM', 'Manat'), ('MUR', 'Mauritius Rupee'), ('MZN', 'Metical'), ('MXV', 'Mexican Unidad de Inversion (UDI)'), ('MXN', 'Mexican peso'), ('MDL', 'Moldovan Leu'), ('MAD', 'Moroccan Dirham'), ('BOV', 'Mvdol'), ('NGN', 'Naira'), ('ERN', 'Nakfa'), ('NAD', 'Namibian Dollar'), ('NPR', 'Nepalese Rupee'), ('ANG', 'Netherlands Antillian Guilder'), ('ILS', 'New Israeli Sheqel'), ('RON', 'New Leu'), ('TWD', 'New Taiwan Dollar'), ('NZD', 'New Zealand Dollar'), ('KPW', 'North Korean Won'), ('NOK', 'Norwegian Krone'), ('PEN', 'Nuevo Sol'), ('MRO', 'Ouguiya'), ('TOP', 'Paanga'), ('PKR', 'Pakistan Rupee'), ('XPD', 'Palladium'), ('MOP', 'Pataca'), ('PHP', 'Philippine Peso'), ('XPT', 'Platinum'), ('GBP', 'Pound Sterling'), ('BWP', 'Pula'), ('QAR', 'Qatari Rial'), ('GTQ', 'Quetzal'), ('ZAR', 'Rand'), ('OMR', 'Rial Omani'), ('KHR', 'Riel'), ('MVR', 'Rufiyaa'), ('IDR', 'Rupiah'), ('RUB', 'Russian Ruble'), ('RWF', 'Rwanda Franc'), ('XDR', 'SDR'), ('SHP', 'Saint Helena Pound'), ('SAR', 'Saudi Riyal'), ('RSD', 'Serbian Dinar'), ('SCR', 'Seychelles Rupee'), ('XAG', 'Silver'), ('SGD', 'Singapore Dollar'), ('SBD', 'Solomon Islands Dollar'), ('KGS', 'Som'), ('SOS', 'Somali Shilling'), ('TJS', 'Somoni'), ('SSP', 'South Sudanese Pound'), ('LKR', 'Sri Lanka Rupee'), ('XSU', 'Sucre'), ('SDG', 'Sudanese Pound'), ('SRD', 'Surinam Dollar'), ('SEK', 'Swedish Krona'), ('CHF', 'Swiss Franc'), ('SYP', 'Syrian Pound'), ('BDT', 'Taka'), ('WST', 'Tala'), ('TZS', 'Tanzanian Shilling'), ('KZT', 'Tenge'), ('XXX', 'The codes assigned for transactions where no currency is involved'), ('TTD', 'Trinidad and Tobago Dollar'), ('MNT', 'Tugrik'), ('TND', 'Tunisian Dinar'), ('TRY', 'Turkish Lira'), ('TMT', 'Turkmenistan New Manat'), ('TVD', 'Tuvalu dollar'), ('AED', 'UAE Dirham'), ('XFU', 'UIC-Franc'), ('USD', 'US Dollar'), ('USN', 'US Dollar (Next day)'), ('UGX', 'Uganda Shilling'), ('CLF', 'Unidad de Fomento'), ('COU', 'Unidad de Valor Real'), ('UYI', 'Uruguay Peso en Unidades Indexadas (URUIURUI)'), ('UYU', 'Uruguayan peso'), ('UZS', 'Uzbekistan Sum'), ('VUV', 'Vatu'), ('CHE', 'WIR Euro'), ('CHW', 'WIR Franc'), ('KRW', 'Won'), ('YER', 'Yemeni Rial'), ('JPY', 'Yen'), ('CNY', 'Yuan Renminbi'), ('ZMK', 'Zambian Kwacha'), ('ZMW', 'Zambian Kwacha'), ('ZWD', 'Zimbabwe Dollar A/06'), ('ZWN', 'Zimbabwe dollar A/08'), ('ZWL', 'Zimbabwe dollar A/09'), ('PLN', 'Zloty')], default='USD', editable=False, max_length=3)),
                ('value', djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='USD', max_digits=13)),
                ('number', models.CharField(help_text='Project Identification Number', max_length=20)),
                ('phase', models.CharField(choices=[('1', 'Bid/Negotation'), ('2', 'Buyout/Submittals'), ('3', 'In Progress'), ('4', 'Punchlist'), ('5', 'Completed')], default=0, max_length=255, null=True)),
                ('start_date', models.DateTimeField(null=True)),
                ('end_date', models.DateTimeField(null=True)),
                ('history', django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=255), size=2), blank=True, default=list, editable=False, size=None)),
                ('previous_state', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict, null=True)),
                ('address', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='core.Address')),
                ('architect', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='architects', to='core.Person')),
                ('assistant_manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='assistant_managers', to='core.Person')),
                ('company', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='core.Company')),
                ('construction_manager', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='construction_managers', to='core.Person')),
                ('contact', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='contacts', to='core.Person')),
                ('manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='managers', to=settings.AUTH_USER_MODEL)),
                ('mep', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='meps', to='core.Person')),
                ('superintendent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='projects', to='core.Person')),
            ],
            options={
                'ordering': ['company', 'value', 'name'],
            },
        ),
        migrations.CreateModel(
            name='ToCIItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('line_item', models.CharField(max_length=128)),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='line_items', to='core.CommonForm')),
            ],
            options={
                'ordering': ['form', 'line_item'],
            },
        ),
        migrations.CreateModel(
            name='SuperPerson',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('PROPERTY_MANAGER', 'Property Manager'), ('MEP_ENGINEER', 'Mep Engineer'), ('ARCHITECT', 'Architect'), ('CONSTRUCTION_MANAGER', 'Construction Manager'), ('BUILDING_ENGINEERING', 'Building Engineering'), ('PROJECT MANAGER', 'Project Manager'), ('ASSISTANT_PROJECT_MANAGER', 'Assistant Project Manager'), ('SUPERINTENDENT', 'Superintendent'), ('ACCOUNTING', 'Accounting')], max_length=64)),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Person')),
            ],
            options={
                'ordering': ['role', 'person'],
            },
        ),
        migrations.CreateModel(
            name='Submittal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.CommonForm')),
            ],
            options={
                'ordering': ['form'],
            },
        ),
        migrations.CreateModel(
            name='SubContractor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trade_division', core.models.CSICode(choices=[('0700 Division 0', 'General conditions'), ('3000 Division 3', 'Concrete'), ('4000 Division 4', 'Masonry'), ('5000 Division 5', 'Metals'), ('6100 Division 6', 'Rough carpentry'), ('6200 Division 6', 'Finish carpentry(aka millwork)'), ('7000 Division 7', 'Thermal and moisture control'), ('8050 Division 8', 'Doors/frames/hardware'), ('8800 Division 8', 'Glass and glazing'), ('9300 Division 9', 'Ceramic tile and ceramics'), ('9500 Division 9', 'Acoustical ceilings'), ('9600 Division 9', 'Flooring'), ('0000 NULL 0', 'empty')], default='0000 NULL 0', max_length=32)),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Person')),
            ],
            options={
                'ordering': ['trade_division', 'person'],
            },
        ),
        migrations.CreateModel(
            name='RFI',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('plan_page_number', models.CharField(blank=True, max_length=15, null=True)),
                ('plan_detail_number', models.CharField(blank=True, max_length=15, null=True)),
                ('form', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.CommonForm')),
            ],
            options={
                'ordering': ['form'],
            },
        ),
        migrations.CreateModel(
            name='PurchaseOrder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trade_division', core.models.CSICode(choices=[('0700 Division 0', 'General conditions'), ('3000 Division 3', 'Concrete'), ('4000 Division 4', 'Masonry'), ('5000 Division 5', 'Metals'), ('6100 Division 6', 'Rough carpentry'), ('6200 Division 6', 'Finish carpentry(aka millwork)'), ('7000 Division 7', 'Thermal and moisture control'), ('8050 Division 8', 'Doors/frames/hardware'), ('8800 Division 8', 'Glass and glazing'), ('9300 Division 9', 'Ceramic tile and ceramics'), ('9500 Division 9', 'Acoustical ceilings'), ('9600 Division 9', 'Flooring'), ('0000 NULL 0', 'empty')], default='0000 NULL 0', max_length=32)),
                ('value', models.PositiveIntegerField()),
                ('type', models.CharField(choices=[('CHANGE_ORDER', 'Change Order'), ('BASE_BID', 'Base Bid'), ('NCC', 'NCC'), ('BACK_CHARGE', 'Back Charge')], default='CHANGE_ORDER', max_length=32)),
                ('description', models.TextField()),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Company')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Project')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Person')),
            ],
            options={
                'ordering': ['company', 'project', 'value'],
            },
        ),
        migrations.AddField(
            model_name='commonform',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.Project'),
        ),
    ]