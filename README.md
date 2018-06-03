# osm-tasking-import

We created this app as a preparations for the OSMGeoWeek. Our idea is import Peru school opendata into OpenStreetMap, but without  a handler data tool  it would be difficult and messy.

This app works similar to [tasking manager](https://github.com/hotosm/osm-tasking-manager2), the differences is that  you can setup each block to an url of data and download into JOSM to evaluate the data there, each block should have: `progress`, `done` and `validated` stage as the progress import is going. 

![import2](https://user-images.githubusercontent.com/1152236/40888544-5ae823b6-671e-11e8-99dc-89b81f948909.gif)

# Link of task 
You can find this task in https://osm-pe.github.io/schools-import/#11.82/-13.1675/-74.2395
# Import Schools in Peru

This repo focuses on the Peru import schools.
Right now we're importing  around 100, 000 schools in Peru 
You can jump in and follow the guide and select an area to import today -- > https://osm-pe.github.io/schools-import/#11.82/-13.1675/-74.2395

#### Why are we doing this?

To improve our map! More data will allow more users to create projects and do analysis on a variety of things. This data will tell you.
 
###  More on this project

Attribute mapping

#### Address attributes 

 Attribute |	OSM Equivalent | 	Dataset used | 	Description	Add/Ignore?	 
 ---       | ---             | ---           |---                        
 Ubigeo||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Departamento||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Provincia|```addr:province```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Distrito|```addr:district```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Cod. CCPP||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Nom. CCPP|```addr:subdistrict```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Cod. Local||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Codigo Modular|```ref```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Nom. IIEE |```name```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Direccion |```addr:full```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Docentes ||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Alumnos ||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 ¿ECE? ||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Grado ||[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Ignored
 Altitud |```ele```|[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added
 Fuente |```source``` |[SIGMED-MINEDU](sigmed.minedu.gob.pe/mapaeducativo/)|Added


#### Amenity atributes
 
 tag | value
---  | ---
amenity | school / kindergarten
isced:level | primary / secondary
name | Name of school
note | Localization of school

#### Types of note: 

**Location hamlet level - Centro Poblado (CP)**:This kind of information is not accurate, You can find the data near to the parks or at center of the ```centros poblados``` - CP.

-  DRE/ UGEL (CP)

- IMG_SATELITAL  (CP)

- IGN (CP)

- INEI (CP)

- MED_GPS (CP)

**Location local level:**

- MED_GPS (LOCAL) : This is the location more accurate of the school.

- UBICACION_WEB (LOCAL)

- GPS_OTRAS_FUENTES (LOCAL)

# Some important observations 
If you are  working on this task  you should follow the next recommendations:

 - Just one person should be finish the import in a place,  this is the best way for checking the data and avoid duplicates.
 - Check tag: ``` ref``` and name of schools for validating the data, in some cases you can find duplicate data of schools.
 - It  would be great if you can trace area of the school and add tag ```amenity= *  ``` and paste data of imports schools.
 
 #### Example of tagging amenity and building
 ![example](https://user-images.githubusercontent.com/8483644/35742125-8fab4c34-0807-11e8-9a00-c48ca55aae7a.png)
- The border will be tagged as ``` amenity = *```
- The edification will be tagged as ``` building =* ```



