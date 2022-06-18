import os
import json
import time
import re

#Variables
Path = os.getcwd() + "\Music" #Path
Music = {"Music": []} #Music dictionary

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

#Gets all files in the music folder
Music["Music"] = GetAllFiles(Path)

#Removes nothinglol.mp3 from the music folder
print(f"Removed \"{Music['Music'][Music['Music'].index('nothinglol.mp3')]}\"")
Music["Music"].pop(Music["Music"].index("nothinglol.mp3"))

#Sorts the main list as Tyler, Alex, Other order
Music["Music"][0], Music["Music"][1] = Music["Music"][1], Music["Music"][0]
Music["Music"][0], Music["Music"][2] = Music["Music"][2], Music["Music"][0]

#Converts to JSON format
Json = json.dumps(Music, indent = 4)

#Writes to the text file
with open(os.getcwd() + "\Music List.txt", "w") as MusicList:
    MusicList.write(Json)

#Does not instantly close window
print("Press enter to close.")
input()