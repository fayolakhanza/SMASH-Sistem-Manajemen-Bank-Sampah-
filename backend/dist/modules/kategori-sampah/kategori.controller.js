"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KategoriSampahController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const kategori_service_1 = require("./kategori.service");
const create_kategori_dto_1 = require("./dto/create-kategori.dto");
const update_kategori_dto_1 = require("./dto/update-kategori.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const file_upload_util_1 = require("../../common/utils/file-upload.util");
let KategoriSampahController = class KategoriSampahController {
    kategoriService;
    constructor(kategoriService) {
        this.kategoriService = kategoriService;
    }
    async findAll(appMakerId) {
        return this.kategoriService.findAll(appMakerId);
    }
    async create(appMakerId, dto, file, req) {
        const fotoUrl = file ? (0, file_upload_util_1.getFileUrl)(req, file.filename) : undefined;
        return this.kategoriService.create(appMakerId, dto, fotoUrl);
    }
    async findOne(appMakerId, id) {
        return this.kategoriService.findOne(appMakerId, id);
    }
    async update(appMakerId, id, dto, file, req) {
        const fotoUrl = file ? (0, file_upload_util_1.getFileUrl)(req, file.filename) : undefined;
        return this.kategoriService.update(appMakerId, id, dto, fotoUrl);
    }
    async remove(appMakerId, id) {
        return this.kategoriService.remove(appMakerId, id);
    }
};
exports.KategoriSampahController = KategoriSampahController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KategoriSampahController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', { storage: file_upload_util_1.multerStorage })),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_kategori_dto_1.CreateKategoriSampahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], KategoriSampahController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KategoriSampahController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', { storage: file_upload_util_1.multerStorage })),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_kategori_dto_1.UpdateKategoriSampahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], KategoriSampahController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KategoriSampahController.prototype, "remove", null);
exports.KategoriSampahController = KategoriSampahController = __decorate([
    (0, common_1.Controller)('api/v1/kategori-sampah'),
    __metadata("design:paramtypes", [kategori_service_1.KategoriSampahService])
], KategoriSampahController);
//# sourceMappingURL=kategori.controller.js.map