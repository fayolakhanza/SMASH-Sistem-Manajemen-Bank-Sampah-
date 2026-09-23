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
exports.HadiahController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const hadiah_service_1 = require("./hadiah.service");
const create_hadiah_dto_1 = require("./dto/create-hadiah.dto");
const update_hadiah_dto_1 = require("./dto/update-hadiah.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const file_upload_util_1 = require("../../common/utils/file-upload.util");
let HadiahController = class HadiahController {
    hadiahService;
    constructor(hadiahService) {
        this.hadiahService = hadiahService;
    }
    async findAll(appMakerId) {
        return this.hadiahService.findAll(appMakerId);
    }
    async create(appMakerId, dto, file, req) {
        const fotoUrl = file ? (0, file_upload_util_1.getFileUrl)(req, file.filename) : undefined;
        return this.hadiahService.create(appMakerId, dto, fotoUrl);
    }
    async findOne(appMakerId, id) {
        return this.hadiahService.findOne(appMakerId, id);
    }
    async update(appMakerId, id, dto, file, req) {
        const fotoUrl = file ? (0, file_upload_util_1.getFileUrl)(req, file.filename) : undefined;
        return this.hadiahService.update(appMakerId, id, dto, fotoUrl);
    }
    async remove(appMakerId, id) {
        return this.hadiahService.remove(appMakerId, id);
    }
};
exports.HadiahController = HadiahController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HadiahController.prototype, "findAll", null);
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
    __metadata("design:paramtypes", [String, create_hadiah_dto_1.CreateHadiahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], HadiahController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HadiahController.prototype, "findOne", null);
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
    __metadata("design:paramtypes", [String, String, update_hadiah_dto_1.UpdateHadiahDto, Object, Object]),
    __metadata("design:returntype", Promise)
], HadiahController.prototype, "update", null);
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
], HadiahController.prototype, "remove", null);
exports.HadiahController = HadiahController = __decorate([
    (0, common_1.Controller)('api/v1/hadiah'),
    __metadata("design:paramtypes", [hadiah_service_1.HadiahService])
], HadiahController);
//# sourceMappingURL=hadiah.controller.js.map