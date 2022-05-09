import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index') // -> views/index.hbs
  root() {
    return {
      data: {
        title: 'Chattings',
        copyright: 'suyeon kim',
      },
    };
  }
}
