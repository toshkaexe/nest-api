import {Controller, Delete, Get, Param} from "@nestjs/common";


@Controller('testing')
export class TestingService {
    @Delete(':id')
    deleteUser(@Param('id') userId: string) {
        return;
    }
}