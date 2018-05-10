# encoding=utf8
#!/usr/bin/python
import sys
import string
from lxml import etree
import sys
reload(sys)
sys.setdefaultencoding('utf8')
osmfilename = sys.argv[1] if (len(sys.argv) > 1) else sys.exit("Invalid file name")
tree = etree.parse(osmfilename)
iscedLevels = tree.findall(".//tag[@k='isced:level']");
modify=False

def rigthTags( arr ):
  fixisced=[]
  if arr[0]=='primary':
    fixisced.append('1')
    fixisced.append('2')
    return ';'.join(fixisced)
  elif arr[0]=='secondary':
    fixisced.append('2')
    fixisced.append('1')
    return ';'.join(fixisced)
  return ';'.join(arr)
  
def fixIsCedLevel( iscedLevel ):
  iscedLevel=iscedLevel.replace(" ", "").lower()
  a=iscedLevel.split(':')
  b=iscedLevel.split(';')
  if len(a)>1:
    iscedLevel=rigthTags(a)
  elif len(b)>1:
    iscedLevel=rigthTags(b)
  elif iscedLevel=='primary':
    iscedLevel='1'
  elif iscedLevel=='secondary':
    iscedLevel='2'
  elif iscedLevel=='básicaespecial-inicial':
    iscedLevel='0'
  return iscedLevel

for iscedLevel in iscedLevels:
  parent = iscedLevel.getparent()
  amenity=parent.findall(".//tag[@k='amenity']")
  if len(amenity) > 0 and (amenity[0].get("v").title()=='School' or amenity[0].get("v").title()=='Kindergarten'):
    old_iscedLevels=iscedLevel.get("v").title();
    new_iscedLevels=fixIsCedLevel(old_iscedLevels)
    # print old_iscedLevels +' => '+ new_iscedLevels
    if old_iscedLevels != new_iscedLevels:
      print old_iscedLevels +' => '+ new_iscedLevels
      iscedLevel.set("v", new_iscedLevels)
      modify=True;
    if new_iscedLevels=='0':
      amenity[0].set("v","kindergarten")
    
  if modify == True :
    parent.attrib['action']='modify'
    modify = False
xml = "<?xml version='1.0' encoding='UTF-8'?>\n"+etree.tostring(tree, encoding='utf8')
new_file = open(osmfilename[:-4]+'_new'+osmfilename[-4:], 'w')
new_file.write(xml)