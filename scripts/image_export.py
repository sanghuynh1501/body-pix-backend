import sys
import cv2
import os
import numpy as np

TEXT_FOLDER = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/061120200927_text/'
IMAGE_FOLDER = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/061120200927_image/'
IMAGE_RESULT = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/result/'

for idx, text_file in enumerate(os.listdir(TEXT_FOLDER)):
    if idx % 1 == 0:
        f = open(TEXT_FOLDER + str(idx) + '.txt', "r")
        data = f.read()
        data = data.split(',')
        data = np.array(data)
        data = np.reshape(data, (400, 400))

        image_file = str(idx) + '.png'
        image = cv2.imread(IMAGE_FOLDER + image_file)
        origin_shape = image.shape[:2]
        image = cv2.resize(image, (400, 400))

        result = np.zeros((400, 400, 3))
        for i in range(400):
            for j in range(400):
                # if data[i, j] != '0':
                result[i, j] = image[i, j, :]
                # else:
                    # result[i, j] = np.array([0,177,64])

        result = cv2.resize(result, (origin_shape[1], origin_shape[0]))
        cv2.imwrite(IMAGE_RESULT + image_file, result) 
        print('result.shape ', result.shape)
        sys.stdout.flush()