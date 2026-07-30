import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NumberPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _metadata: any) {
    const num = Number(value);

    if (isNaN(num)) {
      throw new BadRequestException('Not a number');
    }

    return num;
  }
}
