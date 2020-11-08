import numpy as np
import glob
import cv2
import os
 
img_array = []
filenames = []

IMAGE_RESULT = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/result/'

for filename in os.listdir(IMAGE_RESULT):
    filenames.append(filename)

# filenames.sort()

for i in range(75):
    filename = str(i) + '.png'
    print('filename ', filename)
    img = cv2.imread(IMAGE_RESULT + filename)
    if img is not None:
        height, width, layers = img.shape
        size = (width,height)
        img_array.append(img)
 
 
out = cv2.VideoWriter('project.avi',cv2.VideoWriter_fourcc(*'DIVX'), 15, size)
 
for i in range(len(img_array)):
    out.write(img_array[i])
out.release()