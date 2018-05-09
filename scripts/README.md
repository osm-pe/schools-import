# Scripts to fix the imported data

**Note**

Don't use the script on large regions, this script should be managed carefully

### Fixing ref tag

```
python refs.py osmfile.osm

```

The command line will return an osmfile_new.osm file, which you have to upload to osm.



### Fixing isced:level tag

```
python isced-level.py osmfile.osm

```

The command line will return an osmfile_new.osm file, which you have to upload to osm.


