import os
import json
import time
import re

#Variables
Path = os.getcwd() + "\Images" #Path
Images = {"Images": []} #Images dictionary

#Gets integer numbers
def tryint(s):
    try:
        return int(s)
    except:
        return s

#Natural sorting
def NatSort(s):
    return [tryint(c) for c in re.split('([0-9]+)', s)]

#Gets all files in path (made by Zhiwen)
def GetAllFiles(Path):
    Result = [] #List of files
    #Scans each item in the path
    for x in sorted(os.scandir(Path), key = lambda x : (x.is_file(), NatSort(x.name))):
        #Checks if item is a directory
        if x.is_dir():
            #Adds directory to the list as a dictionary and apply recursion to its directory
            Result.append({x.name: GetAllFiles(x.path)})
            print(f"Got \"{x.name}\" as a directory")
        #Item is a file
        else:
            #Adds file to the list
            Result.append(x.name)
            print(f"Got \"{x.name}\" as a file")
        time.sleep(0.015)
    #Gives back the list
    return Result

#Gets all files in the images folder
Images["Images"] = GetAllFiles(Path)

#Removes nothinglol.png from the images folder
print(f"Removed \"{Images['Images'][Images['Images'].index('nothinglol.png')]}\"")
Images["Images"].pop(Images["Images"].index("nothinglol.png"))

#Converts to JSON format
Json = json.dumps(Images, indent = 4)

#Writes to the text file
with open(os.getcwd() + "\Images List.txt", "w") as ImagesList:
    ImagesList.write(Json)

#Does not instantly close window
print("Press enter to close.")
input()