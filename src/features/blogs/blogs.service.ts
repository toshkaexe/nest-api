import { CreateBlogDto } from './models/input/create-blog.dto';

export class BlogsService {
  private _createBlogDto: CreateBlogDto;
  private _id: string;
  create(createBlogDto: CreateBlogDto) {
    this._createBlogDto = createBlogDto;
  }

  async remove(id: string) {
    this._id = id;
  }
}
