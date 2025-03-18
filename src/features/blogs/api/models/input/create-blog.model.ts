import { IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBlogModel {
  @IsString()
  @MaxLength(15)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @MaxLength(100)
  @IsUrl()
  websiteUrl: string;
}
