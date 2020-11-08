import { Controller, Get, Post, Body, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service';

const fs = require('fs');

const sharp = require('sharp');
const path = require('path');

class Resize {
  folder = ''
  filename = ''
  constructor(folder, filename) {
    this.folder = folder;
    this.filename = filename
  }
  async save(buffer) {
    const filepath = this.filepath(this.filename);
    await sharp(buffer).toFile(filepath);
    return this.filename;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}

@Controller('tensorflow')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(@UploadedFiles() files) {
    let file = files[0]
    const fileName = file.originalname
    const folderName = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/' + fileName.split('_')[0] + '_image'
    if (!fs.existsSync(folderName)){
      fs.mkdirSync(folderName);
    }
    for (let i = 0; i < files.length; i ++) {
      file = files[i]
      console.log('file.originalname ', i, file.originalname)
      if (!file) {
        return "error"
      } else {
        // call class Resize
        const fileUpload = new Resize(folderName, file.originalname.split('_')[1]);
        fileUpload.save(file.buffer);
      }
    }
    return "success";
  }

  @Post('uploadDatas')
  uploadDatas(@Body() body): string {
    const datakeys = Object.keys(body.data)
    let data = []
    let subdata = []
    let keys = []
    const folderName = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/' + body.data.name + '_text'
    if (!fs.existsSync(folderName)){
      fs.mkdirSync(folderName);
    }
    for (let i = 0; i < datakeys.length; i++) {
      if (datakeys[i] != 'name') {
        subdata = body.data[datakeys[i]]
        keys = Object.keys(subdata)
        data = []
        for (let i = 0; i < keys.length; i++) {
          data.push(subdata[keys[i]])
        }
        fs.writeFile('C:/Users/sangh/body-pix/body-pix-backend/scripts/'+ body.data.name + '_text/' + datakeys[i] + '.txt', data.toString(), function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success');
          }
        })
      }
    }

    
    // for (let i = 0; i < keys.length; i++) {
    //   data.push(body.data[keys[i]])
    // }
    // const fs = require('fs');
    // fs.writeFile('C:/Users/sangh/body-pix/body-pix-backend/scripts/data.txt', data.toString(), function (err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('success');
    //     const spawn = require("child_process").spawn;
    //     const pythonProcess = spawn('python',["C:/Users/sangh/body-pix/body-pix-backend/scripts/image_export.py"]);

    //     pythonProcess.stdout.on('data', (data) => {
    //       console.log(`data:${data}`);
    //     });
    //     pythonProcess.stderr.on('data', (data) => {
    //       console.log(`error:${data}`);
    //     });
    //     pythonProcess.stderr.on('close', () => {
    //       console.log("Closed");
    //     });
    //   }
    // });
    return 'success'
  }

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file) {
    console.log('__dirname  ', __dirname);

    if (!file) {
      return "error"
    } else {
      // folder upload
      const imagePath = 'C:/Users/sangh/body-pix/body-pix-backend/scripts/images/';
      // call class Resize
      const fileUpload = new Resize(imagePath, 'person.jpg');
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
