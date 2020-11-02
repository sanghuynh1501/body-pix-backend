import sys
import cv2
import numpy as np

f = open("C:/Users/sangh/body-pix/body-pix-backend/scripts/data.txt", "r")
image = cv2.imread("C:/Users/sangh/body-pix/body-pix-backend/scripts/images/person.jpg", cv2.IMREAD_UNCHANGED)
origin_shape = image.shape[:2]
image = cv2.resize(image, (400, 400))

img_BGRA = cv2.cvtColor(image, cv2.COLOR_RGB2RGBA)

data = f.read()
data = data.split(',')
data = np.array(data)
data = np.reshape(data, (400, 400))

result = np.zeros((400, 400, 4))
for i in range(400):
    for j in range(400):
        if data[i, j] != '0':
            result[i, j] = img_BGRA[i, j, :]

result = cv2.resize(result, (origin_shape[1], origin_shape[0]))
cv2.imwrite("C:/Users/sangh/body-pix/body-pix-backend/scripts/images/result.png", result) 
print('result.shape ', result.shape)
sys.stdout.flush()