import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service';

const sharp = require('sharp');
const path = require('path');

class Resize {
  folder = ''
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = 'person.jpg';
    const filepath = this.filepath(filename);
    await sharp(buffer).toFile(filepath);
    return filename;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}

@Controller('tensorflow')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file) {
    console.log(file);

    if (!file) {
      return "error"
    } else {
      // folder upload
      const imagePath = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/images/';
      // call class Resize
      const fileUpload = new Resize(imagePath);
      const filename = await fileUpload.save(file.buffer);
      return "success";
    }
  }

  @Post('uploadData')
  uploadData(@Body() body): string {
    const keys = Object.keys(body.data)
    const data = []
    for (let i = 0; i < keys.length; i++) {
      data.push(body.data[keys[i]])
    }
    const fs = require('fs');
    fs.writeFile('C:/Users/sangh/body-pix/body-pix-backend/scripts/data.txt', data.toString(), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('success');
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python',["C:/Users/sangh/body-pix/body-pix-backend/scripts/image_export.py"]);

        pythonProcess.stdout.on('data', (data) => {
          console.log(`data:${data}`);
        });
        pythonProcess.stderr.on('data', (data) => {
          console.log(`error:${data}`);
        });
        pythonProcess.stderr.on('close', () => {
          console.log("Closed");
        });
      }
    });
    return 'success'
  }
}
