#!/usr/bin/python
import sys
import string
from lxml import etree
osmfilename = sys.argv[1] if (len(sys.argv) > 1) else sys.exit("Invalid file name")
tree = etree.parse(osmfilename)
refs = tree.findall(".//tag[@k='ref']");
modify=False
def fillRef( refs ):
  refs = refs.split(';')
  for idx, item in enumerate(refs):
    if len(item)== 6:
      refs[idx] = "0"+item
  return ';'.join(refs);
for ref in refs:
  parent = ref.getparent()
  amenity=parent.findall(".//tag[@k='amenity']")
  if len(amenity) > 0 and (amenity[0].get("v").title()=='School' or amenity[0].get("v").title()=='Kindergarten'):
    old_refs=ref.get("v").title();
    new_refs=fillRef(old_refs)
    ref.set("v", new_refs)
    if old_refs != new_refs:
      print old_refs +' => '+ new_refs
      modify=True;
  if modify == True :
    parent.attrib['action']='modify'
    modify = False
xml = "<?xml version='1.0' encoding='UTF-8'?>\n"+etree.tostring(tree, encoding='utf8')
new_file = open(osmfilename[:-4]+'_new'+osmfilename[-4:], 'w')
new_file.write(xml)