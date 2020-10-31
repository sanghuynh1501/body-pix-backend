import  PythonShell from 'python-shell'

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

const options = {
  mode: 'text',
  pythonPath: 'path/to/python',
  pythonOptions: ['-u'],
  scriptPath: 'path/to/my/scripts',
  args: ['value1', 'value2', 'value3']
};

@Controller('tensorflow')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadData')
  uploadData(@Body() body): string {
    console.log('body ', body)
    PythonShell.run('my_script.py', options, function (err, results) {
      if (err) 
        throw err;
      // Results is an array consisting of messages collected during execution
      console.log('results: %j', results);
    });
    return 'success'
  }
}
